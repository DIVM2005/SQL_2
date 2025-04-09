# SQL Query Generator

A web application that converts natural language descriptions into SQL queries. The application features a clean, modern interface with a grey, black, and white color scheme.

## Features

- **Natural Language Processing**: Convert plain English descriptions into SQL queries
- **Database Connection**: Connect to PostgreSQL databases
- **Query History**: Keep track of generated queries with timestamps
- **Modern UI**: Clean and responsive interface with a professional color scheme

## Quick Start Guide

### Prerequisites
1. Install Python (version 3.8 or higher)
   - Download from: https://www.python.org/downloads/
   - During installation, make sure to check "Add Python to PATH"

2. Install PostgreSQL
   - Download from: https://www.postgresql.org/download/
   - Remember the password you set during installation

3. Get a GROQ API Key
   - Sign up at: https://console.groq.com/
   - Create an API key in your account dashboard

### Installation Steps

1. **Download the Project**
   - Click the green "Code" button on this page
   - Select "Download ZIP"
   - Extract the ZIP file to a folder on your computer

2. **Set Up Environment Variables**
   - Rename `.env.example` to `.env`
   - Open `.env` in a text editor
   - Replace `your_groq_api_key_here` with your actual GROQ API key
   - Optionally, update the database configuration if you want to use default values

3. **Install Required Python Packages**
   - Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Navigate to the project folder:
     ```
     cd path/to/extracted/folder
     ```
   - Install required packages:
     ```
     pip install -r requirements.txt
     ```

### Running the Application

1. **Start the Backend Server**
   - Open a new Command Prompt/Terminal window
   - Navigate to the project folder
   - Run:
     ```
     python draft1fast.py
     ```
   - You should see a message that the server is running on port 5000

2. **Start the Frontend Server**
   - Open another Command Prompt/Terminal window
   - Navigate to the project folder
   - Run:
     ```
     python -m http.server 3000
     ```
   - You should see a message that the server is running on port 3000

3. **Access the Application**
   - Open your web browser
   - Go to: http://localhost:3000
   - You should see the SQL Query Generator interface

### Using the Application

1. **Connect to Database**
   - Click on "Connection" in the navigation menu
   - Enter your PostgreSQL database details:
     - Host: localhost
     - Port: 5432
     - Database: your_database_name
     - Username: postgres
     - Password: your_postgres_password
   - Click "Connect"

2. **Generate Queries**
   - Click on "Generator" in the navigation menu
   - Type your query in natural language (e.g., "Show all users who registered this month")
   - Click "Generate Query"
   - View the generated SQL query

3. **View History**
   - Click on "History" in the navigation menu
   - See all your previously generated queries
   - Clear history if needed

## Troubleshooting

- **"ModuleNotFoundError"**: Make sure you've installed all requirements using `pip install -r requirements.txt`
- **"Port already in use"**: Close other applications using ports 3000 or 5000
- **"Cannot connect to database"**: Verify your PostgreSQL credentials and make sure PostgreSQL is running
- **"API key not found"**: Make sure you've created a `.env` file with your GROQ API key

## Project Structure

```
sql-query-generator/
├── draft1fast.py     # Backend server
├── index.html        # Frontend HTML
├── styles.css        # CSS styles
├── script.js         # Frontend JavaScript
├── requirements.txt  # Python dependencies
├── .env.example      # Template for environment variables
└── .env              # Your actual environment variables (not in repo)
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Groq for providing the LLM API
- FastAPI for the backend framework
- The open-source community for inspiration and tools 