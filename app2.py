from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from langchain_groq import ChatGroq
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langgraph.prebuilt import create_react_agent
from langchain_core.prompts import PromptTemplate
from langchain_community.tools.sql_database.tool import (
    InfoSQLDatabaseTool,
    ListSQLDatabaseTool,
    QuerySQLCheckerTool,
    QuerySQLDataBaseTool,
)
from langchain_community.tools import tool
from langserve import add_routes
from urllib.parse import quote
from pydantic import BaseModel
from typing import Dict, Any

# Initialize FastAPI app
app = FastAPI(title="SQL Agent API", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# MySQL Database Connection
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "praveen@odc"
MYSQL_DB = "compaaany"

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB
        )
        return conn
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(err)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# Initialize Groq AI model
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.2,
    groq_api_key="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"
)

# SQL Agent Prompt Template
prompt_template = """
Understand the Task:

- Given a question, create a correct SQL query for MySQL.
- Always query for the available tables and their schema first.
- Use relevant columns and limit the results to 20.
- Order the results by the most relevant column for insight.
- Never execute queries that alter the data (e.g., INSERT, UPDATE, DELETE).

### Instructions:
follow this instruction in the same order do not miss or disobey this order

1. **List Available Tables**: Always query the list of tables first using the tool `list_tables`.
2. **Check Schema of Relevant Table**: Inspect the schema of the table using the tool `tables_schema`. Always find for relevent details from the table schema accoridng to the user prompt 
3. **Formulate and Execute the Query**: After gathering schema information, formulate the query and execute it and fetch the result from the database.
4. **Error Handling**: If an error occurs, debug and fix the query before re-executing it.
"""

# Initialize SQLDatabase
try:
    encoded_password = quote(MYSQL_PASSWORD)
    db = SQLDatabase.from_uri(f"mysql+mysqlconnector://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}/{MYSQL_DB}")
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to initialize SQLDatabase: {str(e)}")

# Create SQL Agent Tools
@tool("list_tables")
def list_tables(tool_input: str = "") -> str:
    """List the available tables from the database"""
    try:
        return ListSQLDatabaseTool(db=db).invoke("")
    except Exception as e:
        return f"Error listing tables: {str(e)}"

@tool("tables_schema")
def tables_schema(tables: str) -> str:
    """
    Input is a comma-separated list of tables, output is the schema and sample rows
    for those tables. Be sure that the tables actually exist by calling list_tables first!
    Example Input: table1, table2, table3
    """
    try:
        tool = InfoSQLDatabaseTool(db=db)
        return tool.invoke(tables)
    except Exception as e:
        return f"Error getting table schema: {str(e)}"

@tool("query_checker")
def query_checker(sql_query: str) -> str:
    """Use this tool to double check whether the given query is proper or not before executing it."""
    try:
        return QuerySQLCheckerTool(db=db, llm=llm).invoke({"query": sql_query})
    except Exception as e:
        return f"Error checking query: {str(e)}"

@tool("execute_query")
def execute_query(query: str) -> str:
    """Use this tool to execute the SQL query against the database and fetch result data."""
    try:
        return QuerySQLDataBaseTool(db=db).invoke(query)
    except Exception as e:
        return f"Error executing query: {str(e)}"

# Create SQL Agent
tools = [list_tables, tables_schema, query_checker, execute_query]
agent_executor = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=prompt_template
)

# Define custom input model
class SQLInput(BaseModel):
    input: str

# Add LangServe routes
add_routes(
    app,
    agent_executor,
    path="/NLPSQL",
    input_type=SQLInput,
    enabled_endpoints=["invoke"],
)

@app.post("/sql")
async def custom_sql(request: Request):
    try:
        data = await request.json()
        if not data.get("input"):
            raise HTTPException(status_code=400, detail="Input is required")
            
        result = agent_executor.invoke({"messages": [("user", data["input"])]})
        
        # Extract the final response from the agent's output
        if isinstance(result, dict) and "messages" in result:
            messages = result["messages"]
            if messages and len(messages) > 1:
                return {
                    "status": "success",
                    "data": {
                        "response": messages[-1].content,
                        "raw_messages": [msg.content for msg in messages]
                    }
                }
        
        return {
            "status": "success",
            "data": {
                "response": str(result)
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)