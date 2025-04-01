import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAgent } from '../context/AgentContext';
import { useToast } from '../context/ToastContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
  });

  const { processQuery, agent, loading: agentLoading } = useAgent();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const result = await processQuery(inputMessage);
      
      if (result.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: result.explanation,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          query: result.result.query,
          data: result.result.data
        };
        setMessages((prev) => [...prev, aiMessage]);
        
        // Navigate to results page if we have data
        if (result.result.data) {
          navigate('/result', { 
            state: { 
              query: result.result.query,
              data: result.result.data
            }
          });
        }
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      console.error('Error processing query:', error);
      showToast('Failed to process query', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseChange = (event) => {
    setSelectedDatabase(event.target.value);
    if (event.target.value) {
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedDatabase('');
  };

  const handleConnectionSubmit = async () => {
    try {
      // TODO: Implement database connection
      showToast('Database connected successfully', 'success');
      handleDialogClose();
    } catch (error) {
      showToast('Failed to connect to database', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Database</InputLabel>
              <Select
                value={selectedDatabase}
                onChange={handleDatabaseChange}
                label="Select Database"
              >
                <MenuItem value="mysql">MySQL</MenuItem>
                <MenuItem value="postgresql">PostgreSQL</MenuItem>
                <MenuItem value="sqlite">SQLite</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    {message.query && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Query: {message.query}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{ display: 'flex', gap: 1 }}
              >
                <TextField
                  fullWidth
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  variant="outlined"
                  disabled={loading || agentLoading}
                />
                <IconButton 
                  type="submit" 
                  color="primary"
                  disabled={loading || agentLoading}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Database Connection Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Host"
              value={connectionDetails.host}
              onChange={(e) =>
                setConnectionDetails((prev) => ({ ...prev, host: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Port"
              value={connectionDetails.port}
              onChange={(e) =>
                setConnectionDetails((prev) => ({ ...prev, port: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Username"
              value={connectionDetails.username}
              onChange={(e) =>
                setConnectionDetails((prev) => ({ ...prev, username: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={connectionDetails.password}
              onChange={(e) =>
                setConnectionDetails((prev) => ({ ...prev, password: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Database"
              value={connectionDetails.database}
              onChange={(e) =>
                setConnectionDetails((prev) => ({ ...prev, database: e.target.value }))
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConnectionSubmit} variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Chat; 