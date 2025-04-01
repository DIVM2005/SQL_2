import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData);
export const logout = () => api.post('/auth/logout');

// Database Connection APIs
export const saveConnection = (connectionData) =>
  api.post('/connections', connectionData);
export const getConnections = () => api.get('/connections');
export const testConnection = (connectionData) =>
  api.post('/connections/test', connectionData);
export const deleteConnection = (connectionId) =>
  api.delete(`/connections/${connectionId}`);

// Query APIs
export const executeQuery = (queryData) => api.post('/queries/execute', queryData);
export const getQueryHistory = () => api.get('/queries/history');
export const deleteQueryHistory = (queryId) =>
  api.delete(`/queries/history/${queryId}`);

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 