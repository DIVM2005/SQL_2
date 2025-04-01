import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Validate token with backend
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      localStorage.setItem('token', response.token);
      setUser({ token: response.token });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed',
        details: error.response?.data
      };
    }
  };

  const signup = async (email, password) => {
    try {
      console.log('Attempting signup with:', { email });
      const response = await apiSignup({ email, password });
      console.log('Signup response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({ token: response.data.token });
        return { success: true };
      } else {
        console.error('Invalid signup response:', response);
        return { 
          success: false, 
          error: 'Invalid response from server',
          details: response
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed',
        details: error.response?.data
      };
    }
  };

  const logout = async () => {
    try {
      // Try to call the logout API, but proceed even if it fails
      try {
        await apiLogout();
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }
      
      // Always clear local storage and user state
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if something goes wrong, try to clear the state
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 