# SQL Query Generator

A web application that converts natural language descriptions into SQL queries. The application features a clean, modern interface with a grey, black, and white color scheme.

## Features

- **Natural Language Processing**: Convert plain English descriptions into SQL queries
- **Database Connection**: Connect to PostgreSQL databases
- **Query History**: Keep track of generated queries with timestamps
- **Modern UI**: Clean and responsive interface with a professional color scheme

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Modern grey, black, and white theme

### Backend
- Python
- FastAPI
- PostgreSQL support
- Groq LLM API for natural language processing

## Project Structure

```
sql-query-generator/
├── frontend/         # Frontend files
│   ├── index.html   # Main HTML file
│   ├── styles.css   # CSS styles
│   └── script.js    # JavaScript functionality
├── draft1fast.py    # Backend server
├── requirements.txt # Python dependencies
├── .env.example     # Template for environment variables
└── .env             # Your actual environment variables (not in repo)
``` 