# SQL Query Generator

A web application that generates SQL queries from natural language descriptions using AI. The application features a clean, modern interface with a grey, black, and white color scheme.

## Features

- **Natural Language to SQL**: Convert plain English descriptions into SQL queries
- **Database Connection**: Connect to PostgreSQL databases
- **Query History**: Keep track of generated queries with timestamps
- **Modern UI**: Clean and responsive interface with a professional color scheme

## Tech Stack

- **Frontend**:
  - HTML5
  - CSS3
  - Vanilla JavaScript
  - Modern grey, black, and white theme

- **Backend**:
  - Python
  - FastAPI
  - Langchain with Groq
  - PostgreSQL support

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- PostgreSQL database (for connecting to your data)

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd sql-query-generator
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

## Running the Application

1. Start the backend server:
   ```bash
   python draft1fast.py
   ```
   The backend will run on `http://localhost:5000`

2. Start the frontend server:
   ```bash
   python -m http.server 3000
   ```
   Access the application at `http://localhost:3000`

## Usage

1. **Connect to Database**:
   - Navigate to the Connection page
   - Enter your database credentials
   - Click "Connect"

2. **Generate Queries**:
   - Go to the Generator page
   - Enter your query description in natural language
   - Click "Generate Query"
   - View the generated SQL query

3. **View History**:
   - Visit the History page to see all previously generated queries
   - Clear history as needed

## Project Structure

```
sql-query-generator/
├── draft1fast.py     # Backend server
├── index.html        # Frontend HTML
├── styles.css        # CSS styles
├── script.js         # Frontend JavaScript
└── requirements.txt  # Python dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Groq for providing the LLM API
- FastAPI for the backend framework
- The open-source community for inspiration and tools 