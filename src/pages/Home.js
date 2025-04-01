import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ title, description, action, actionText }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Typography color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary" onClick={action}>
        {actionText}
      </Button>
    </CardActions>
  </Card>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Natural Language Queries',
      description: 'Convert your questions into SQL queries using AI-powered natural language processing.',
      action: () => navigate('/chat'),
      actionText: 'Try it now',
    },
    {
      title: 'Database Connections',
      description: 'Connect to your databases securely and manage multiple connections.',
      action: () => navigate('/database'),
      actionText: 'Manage Connections',
    },
    {
      title: 'Query History',
      description: 'Access your past queries and results for future reference.',
      action: () => navigate('/history'),
      actionText: 'View History',
    },
  ];

  return (
    <Box>
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?sql)',
          height: '400px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 3, md: 6 },
            pb: { xs: 3, md: 6 },
            px: { xs: 3, md: 6 },
          }}
        >
          <Container maxWidth="sm" sx={{ position: 'relative' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              SQL Query Generator
            </Typography>
            <Typography variant="h5" paragraph>
              Transform your natural language questions into SQL queries with AI
            </Typography>
            {!user && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ mt: 2 }}
              >
                Get Started
              </Button>
            )}
          </Container>
        </Box>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Paper sx={{ p: 4, bgcolor: 'grey.100' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            1. Sign up for an account to get started
          </Typography>
          <Typography variant="body1" paragraph>
            2. Connect your database in the Database section
          </Typography>
          <Typography variant="body1" paragraph>
            3. Start asking questions in natural language in the Chat section
          </Typography>
          <Typography variant="body1" paragraph>
            4. View your query history and results in the History section
          </Typography>
          {!user && (
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{ mt: 2 }}
            >
              Create Account
            </Button>
          )}
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 