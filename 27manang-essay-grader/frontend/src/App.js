import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  TextField,
  Grid,
  ThemeProvider,
  createTheme
} from '@mui/material';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import GradingCriteria from './components/GradingCriteria';
import GradeDisplay from './components/GradeDisplay';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [grade, setGrade] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError('');
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setContent('');
  };

  const handleSubmit = async () => {
    if (!content) {
      setError('Please upload an essay file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/grade', {
        content
      });
      
      setGrade(response.data.grade);
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error('Full error:', err);
      setError(`Error grading essay: ${err.response?.data?.details || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <AutoAwesomeIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main',
                  mb: 2
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                Essay Grader
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Upload your essay and get instant feedback on your writing quality
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <FileUpload 
                  file={file}
                  onFileChange={handleFileChange}
                  onFileRemove={handleFileRemove}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  label="Essay Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || !content}
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                >
                  Grade Essay
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <GradingCriteria />
              </Grid>
            </Grid>

            <GradeDisplay 
              grade={grade}
              feedback={feedback}
              loading={loading}
              error={error}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
