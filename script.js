// Global variables
let isConnected = false;
let currentDatabase = null;
let currentTables = [];
let currentColumns = {};

// API Base URL
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const pages = {
    home: document.getElementById('homePage'),
    connection: document.getElementById('connectionPage'),
    generator: document.getElementById('generatorPage'),
    history: document.getElementById('historyPage')
};

const navLinks = {
    home: document.querySelector('a[href="#home"]'),
    connection: document.querySelector('a[href="#connection"]'),
    generator: document.querySelector('a[href="#generator"]'),
    history: document.querySelector('a[href="#history"]')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check backend health
    checkBackendHealth();
    
    // Load history
    loadHistory();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize navigation
    initializeNavigation();
});

// Check backend health
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (data.status === 'healthy') {
            console.log('Backend is healthy:', data.message);
            // Don't show error if backend is healthy
        } else {
            showError('Backend is not healthy: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        showError('Could not connect to backend. Please make sure the backend server is running.');
        console.error('Backend health check failed:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Database connection form
    document.getElementById('connectForm').addEventListener('submit', handleConnection);
    
    // Query generation form
    document.getElementById('queryForm').addEventListener('submit', handleQueryGeneration);
    
    // Clear history button
    document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
}

// Initialize navigation
function initializeNavigation() {
    // Handle initial page load
    const hash = window.location.hash || '#home';
    navigateTo(hash.substring(1));
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        navigateTo(hash);
    });
}

// Navigate to a specific page
function navigateTo(pageId) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    if (pages[pageId]) {
        pages[pageId].classList.add('active');
    }
    
    // Update active nav link
    Object.values(navLinks).forEach(link => {
        link.classList.remove('active');
    });
    if (navLinks[pageId]) {
        navLinks[pageId].classList.add('active');
    }
    
    // Update connection status banner if on generator page
    if (pageId === 'generator') {
        updateConnectionStatusBanner();
    }
}

// Handle database connection
async function handleConnection(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const connectionData = {
        host: formData.get('host'),
        port: formData.get('port'),
        database: formData.get('database'),
        user: formData.get('user'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(connectionData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            isConnected = true;
            currentDatabase = connectionData.database;
            currentTables = data.tables;
            showSuccess('Successfully connected to database');
            navigateTo('generator');
        } else {
            showError(data.error || 'Failed to connect to database');
        }
    } catch (error) {
        showError('Failed to connect to database');
        console.error('Connection error:', error);
    }
}

// Handle query generation
async function handleQueryGeneration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const queryData = {
        question: formData.get('naturalLanguage')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('generatedQuery').textContent = data.response;
            addToHistory({
                naturalLanguage: queryData.question,
                generatedQuery: data.response,
                timestamp: new Date().toISOString(),
                status: 'success'
            });
        } else {
            showError(data.message || 'Failed to generate query');
            addToHistory({
                naturalLanguage: queryData.question,
                error: data.message,
                timestamp: new Date().toISOString(),
                status: 'failed'
            });
        }
    } catch (error) {
        showError('Failed to generate query');
        console.error('Query generation error:', error);
    }
}

// Update connection status banner
function updateConnectionStatusBanner() {
    const banner = document.getElementById('connectionStatusBanner');
    if (isConnected) {
        banner.textContent = `Connected to database: ${currentDatabase}`;
        banner.classList.add('connected');
    } else {
        banner.innerHTML = 'Not connected to any database. <a href="#connection">Connect now</a>';
        banner.classList.remove('connected');
    }
}

// Load query history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No query history available</div>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item ${item.status}">
            <div class="history-item-header">
                <span class="history-item-timestamp">${new Date(item.timestamp).toLocaleString()}</span>
                <span class="history-item-status">${item.status.toUpperCase()}</span>
            </div>
            <div class="history-item-details">
                <p><strong>Natural Language:</strong> ${item.naturalLanguage}</p>
                ${item.generatedQuery ? `<p><strong>Generated Query:</strong> ${item.generatedQuery}</p>` : ''}
                ${item.error ? `<p class="error-message"><strong>Error:</strong> ${item.error}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Add query to history
function addToHistory(queryData) {
    const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
    history.unshift(queryData);
    localStorage.setItem('queryHistory', JSON.stringify(history));
    loadHistory();
}

// Clear query history
function clearHistory() {
    if (confirm('Are you sure you want to clear all query history?')) {
        localStorage.removeItem('queryHistory');
        loadHistory();
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
} 