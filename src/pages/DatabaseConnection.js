import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { saveConnection, getConnections, testConnection } from '../api/apiService';

const DatabaseConnection = () => {
  const [connectionData, setConnectionData] = useState({
    type: '',
    host: '',
    port: '',
    username: '',
    password: '',
    databaseName: '',
  });
  const [savedConnections, setSavedConnections] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadSavedConnections();
  }, []);

  const loadSavedConnections = async () => {
    try {
      const connections = await getConnections();
      setSavedConnections(connections);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load saved connections',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveConnection(connectionData);
      setSnackbar({
        open: true,
        message: 'Connection saved successfully',
        severity: 'success',
      });
      loadSavedConnections();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save connection',
        severity: 'error',
      });
    }
  };

  const handleTest = async () => {
    try {
      await testConnection(connectionData);
      setSnackbar({
        open: true,
        message: 'Connection test successful',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Connection test failed',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Database Connection
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Database Type</InputLabel>
                <Select
                  name="type"
                  value={connectionData.type}
                  onChange={handleInputChange}
                  label="Database Type"
                >
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="postgresql">PostgreSQL</MenuItem>
                  <MenuItem value="sqlite">SQLite</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Host"
                name="host"
                value={connectionData.host}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Port"
                name="port"
                value={connectionData.port}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={connectionData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={connectionData.password}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Database Name"
                name="databaseName"
                value={connectionData.databaseName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={!connectionData.type || !connectionData.host}
                >
                  Save Connection
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleTest}
                  disabled={!connectionData.type || !connectionData.host}
                >
                  Test Connection
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Saved Connections
          </Typography>
          {savedConnections.length === 0 ? (
            <Typography color="textSecondary">No saved connections</Typography>
          ) : (
            <Grid container spacing={2}>
              {savedConnections.map((connection) => (
                <Grid item xs={12} key={connection.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      {connection.type} - {connection.host}:{connection.port}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Database: {connection.databaseName}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DatabaseConnection; 