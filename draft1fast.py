from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.tools.sql_database.tool import (
    InfoSQLDatabaseTool,
    ListSQLDatabaseTool,
    QuerySQLCheckerTool,
    QuerySQLDataBaseTool,
)
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent
from urllib.parse import quote
import mysql.connector
import sqlite3
import psycopg2
from typing import Dict, Any, Optional, List
import os

# -------------------- Database Configuration --------------------
# Default values (will be overridden by user input)
DB_TYPE = "mysql"  # Default database type
DB_HOST = "localhost"
DB_PORT = "3306"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = ""
DB_PATH = ""  # For SQLite

# Global database connection
db = None

# -------------------- LLM Configuration --------------------
try:
    llm = ChatGroq(
        model='llama-3.1-8b-instant',
        temperature=0.2,
        groq_api_key="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"
    )
except Exception as e:
    print(f"Error initializing LLM: {str(e)}")
    raise

# -------------------- Database Connection Functions --------------------
def get_connection_string(db_type: str, host: str, port: str, user: str, password: str, db_name: str, path: str = "") -> str:
    """Generate the appropriate connection string based on database type."""
    if db_type == "mysql":
        return f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}"
    elif db_type == "postgresql":
        return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"
    elif db_type == "sqlite":
        return f"sqlite:///{path}"
    else:
        raise ValueError(f"Unsupported database type: {db_type}")

def connect_to_database(db_config: Dict[str, Any]) -> SQLDatabase:
    """Connect to the database using the provided configuration."""
    global db
    
    db_type = db_config.get("db_type", "mysql")
    host = db_config.get("host", "localhost")
    port = db_config.get("port", "3306")
    user = db_config.get("user", "root")
    password = db_config.get("password", "")
    db_name = db_config.get("db_name", "")
    path = db_config.get("path", "")
    
    try:
        connection_string = get_connection_string(db_type, host, port, user, password, db_name, path)
        db = SQLDatabase.from_uri(connection_string)
        return db
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# -------------------- Tool Definitions --------------------
@tool("list_tables")
def list_tables(tool_input: str = "") -> str:
    """List the available tables from the database."""
    if db is None:
        return "Database not connected. Please connect to a database first."
    return ListSQLDatabaseTool(db=db).invoke("")

@tool("tables_schema")
def tables_schema(tables: str) -> str:
    """
    Input is a comma-separated list of tables, output is the schema and sample rows
    for those tables. Be sure that the tables actually exist by calling `list_tables` first!
    Example Input: table1, table2, table3
    """
    if db is None:
        return "Database not connected. Please connect to a database first."
    return InfoSQLDatabaseTool(db=db).invoke(tables)

@tool("execute_query")
def execute_query(query: str) -> str:
    """Use this tool to execute the SQL query against the database and fetch result data from it."""
    if db is None:
        return "Database not connected. Please connect to a database first."
    return QuerySQLDataBaseTool(db=db).invoke(query)

@tool("query_checker")
def query_checker(sql_query: str) -> str:
    """Use this tool to double check whether the given query is proper or not before executing it."""
    if db is None:
        return "Database not connected. Please connect to a database first."
    return QuerySQLCheckerTool(db=db, llm=llm).invoke({"query": sql_query})

# -------------------- Agent Prompt --------------------
prompt_template = """
Understand the Task:

- Given a question, create a correct SQL query for {dialect}.
- Always query for the available tables and their schema first.
- Use relevant columns and limit the results to {top_k}.
- Order the results by the most relevant column for insight.
- Never execute queries that alter the data (e.g., INSERT, UPDATE, DELETE).

### Instructions:
follow this instruction in the same order do not miss or disobey this order

1. **List Available Tables**: Always query the list of tables first using the tool `list_tables`.
2. **Check Schema of Relevant Table**: Inspect the schema of the table using the tool `tables_schema`.
3. **Formulate and Execute the Query**: After gathering schema information, formulate the query and execute it.
4. **Error Handling**: If an error occurs, debug and fix the query before re-executing it.
"""
system_message = prompt_template.format(dialect="SQL", top_k=20)

# -------------------- Create the Agent --------------------
tools = [list_tables, tables_schema, execute_query, query_checker]
agent_executor = create_react_agent(llm, tools=tools, prompt=system_message)

def run_sql_agent(user_query: str) -> str:
    try:
        if db is None:
            return "Database not connected. Please connect to a database first."
        result = agent_executor.invoke({"messages": [("user", user_query)]})
        return result["messages"][-2].content
    except Exception as e:
        return f"Error processing query: {str(e)}"

# -------------------- FastAPI Server Setup --------------------
app = FastAPI(
    title="SQL Query Agent API",
    version="1.0",
    description="This API takes natural language input and returns SQL query results using Groq's LLM.",
)

# Add CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend running on port 3000
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# -------------------- API Models --------------------
class DatabaseConfig(BaseModel):
    db_type: str
    host: Optional[str] = "localhost"
    port: Optional[str] = "3306"
    user: Optional[str] = "root"
    password: Optional[str] = ""
    db_name: Optional[str] = ""
    path: Optional[str] = ""  # For SQLite

class QueryRequest(BaseModel):
    question: str

# -------------------- API Endpoints --------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to the SQL Query Agent API!"}

@app.post("/connect")
async def connect_database(config: DatabaseConfig):
    try:
        connect_to_database(config.dict())
        return {"status": "success", "message": f"Connected to {config.db_type} database"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/health")
async def health_check():
    try:
        # Just return healthy if the API is running
        return {"status": "healthy", "message": "API server is running"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/query")
async def query_sql(request: QueryRequest):
    try:
        if db is None:
            return {"status": "error", "message": "Database not connected. Please connect to a database first."}
        result = run_sql_agent(request.question)
        return {"status": "success", "response": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
