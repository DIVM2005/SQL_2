# SQL Query Generator

A web application that converts natural language to SQL queries using AI. This tool helps you write SQL queries without knowing SQL by converting your questions from plain English to SQL.

## Features
- Natural language to SQL query conversion
- User authentication
- Database connection management
- Query history
- Modern Material-UI interface
- Real-time query execution
- Query optimization
- Schema understanding

## Project Structure
```
sql-query-generator/
├── src/                    # Frontend source files
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   ├── agents/           # AI agent implementations
│   ├── api/              # API service files
│   └── App.js            # Main application component
├── public/               # Static files
├── backend/              # Backend server files
└── package.json         # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js (Download from nodejs.org)
- A web browser (Chrome recommended)

### Setup Instructions

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   The backend will run on http://localhost:5000

2. **Frontend Setup**
   ```bash
   npm install
   npm start
   ```
   The frontend will run on http://localhost:3001

### First Time Setup
1. Create an account using the Sign Up page
2. Add your database connection in the Database section
3. Test the connection
4. Start using natural language queries

## User Guide

### Database Connection
1. Click "Database" in the top menu
2. Fill in your database details:
   - Type (MySQL, PostgreSQL, SQLite)
   - Host (usually "localhost")
   - Port (default depends on database type)
   - Username
   - Password
   - Database name
3. Click "Test Connection" to verify
4. Click "Save" to store the connection

### Using the Application
1. Click "Chat" in the top menu
2. Type your question in plain English
   Examples:
   - "Show me all customers"
   - "Find orders from last week"
   - "Count how many products cost more than $100"
3. The application will convert your question to SQL
4. View your results in the Execution Result page

### Other Features
- **History**: View and reuse past queries
- **Profile**: Manage your account settings
- **Query Optimization**: Automatic query performance improvements
- **Schema Understanding**: AI-powered database schema comprehension

## Technical Details

### Color Scheme
- Primary: `#424242` (Dark Grey)
- Secondary: `#757575` (Medium Grey)
- Background: `#ffffff` (White)
- Text: `#212121` (Almost Black)

### Security Features
- Password hashing
- JWT authentication
- Encrypted database credentials
- CORS security
- Input sanitization

### Performance Optimizations
- Lazy loading for routes
- Optimized re-renders
- Caching implementation
- Error boundaries
- Loading states

## Troubleshooting

### Common Issues
1. **Connection Errors**
   - Verify backend is running
   - Check database credentials
   - Ensure database is accessible

2. **Query Errors**
   - Review generated SQL
   - Check database schema
   - Verify table names and columns

3. **Application Issues**
   - Clear browser cache
   - Check browser console (F12)
   - Verify all services are running

### Need Help?
- Check error messages in the UI
- Review browser console logs
- Contact support if needed

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 