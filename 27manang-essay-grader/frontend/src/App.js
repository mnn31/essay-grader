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
  createTheme,
  CircularProgress,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import GradeDisplay from './components/GradeDisplay';
import SchoolIcon from '@mui/icons-material/School';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import DeleteIcon from '@mui/icons-material/Delete';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
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
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

const API_URL = `http://localhost:${process.env.REACT_APP_API_PORT || '2020'}`;

function App() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [grade, setGrade] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [misspelledWords, setMisspelledWords] = useState([]);

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
      const response = await axios.post(`${API_URL}/api/grade`, {
        content
      });
      
      setGrade(response.data.grade);
      setFeedback(response.data.feedback);
      setMisspelledWords(response.data.misspelledWords || []);
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dynamic Background Elements */}
        <Box className="background-decoration">
          <Box className="decoration-element decoration-element-1" />
          <Box className="decoration-element decoration-element-2" />
          <Box className="decoration-element decoration-element-3" />
          <Box className="decoration-element decoration-element-4" />
          <Box className="decoration-element decoration-element-5" />
        </Box>

        {/* Floating Icons */}
        <Box className="floating-icon floating-icon-1">
          <EditNoteIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-2">
          <SpellcheckIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-3">
          <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-4">
          <LightbulbIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-5">
          <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-6">
          <StarIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-7">
          <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.1 }} />
        </Box>
        <Box className="floating-icon floating-icon-8">
          <EmojiObjectsIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.1 }} />
        </Box>

        {/* Top Banner */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
            mb: 4
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Essay Grader Pro 📝
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Clear Database">
                  <IconButton 
                    color="inherit"
                    onClick={async () => {
                      try {
                        await axios.post(`${API_URL}/api/clear-database`);
                        alert('Database cleared successfully!');
                      } catch (error) {
                        console.error('Error clearing database:', error);
                        alert('Error clearing database');
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'primary.main',
                  mr: 2,
                  animation: 'pulse 2s infinite'
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                Essay Grader ✍️
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <UploadFileIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Upload Your Essay
                    </Typography>
                  </Box>

                  <FileUpload 
                    file={file}
                    onFileChange={handleFileChange}
                    onFileRemove={handleFileRemove}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    variant="outlined"
                    label="Essay Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ 
                      mt: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !content}
                    fullWidth
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoStoriesIcon />}
                    sx={{ 
                      mt: 3, 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976d2 30%, #1CB5E0 90%)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                      }
                    }}
                  >
                    {loading ? 'Grading...' : 'Grade Essay'}
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <GradeDisplay 
              grade={grade}
              feedback={feedback}
              loading={loading}
              error={error}
              misspelledWords={misspelledWords}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
