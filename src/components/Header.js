import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        showToast('Logged out successfully', 'success');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showToast('An error occurred during logout', 'error');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          SQL Query Generator
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : user ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/chat')}
                sx={{ textTransform: 'none' }}
              >
                Chat
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/database')}
                sx={{ textTransform: 'none' }}
              >
                Database
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/history')}
                sx={{ textTransform: 'none' }}
              >
                History
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/profile')}
                sx={{ textTransform: 'none' }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          ) : !isAuthPage && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 