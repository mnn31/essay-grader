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
  IconButton,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import GradingCriteria from './components/GradingCriteria';
import GradeDisplay from './components/GradeDisplay';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
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
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const writingExamples = [
    {
      title: "Strong Opening",
      content: "The sun dipped below the horizon, painting the sky in brilliant hues of orange and purple. As I stood on the beach, the gentle waves lapping at my feet, I couldn't help but reflect on the transformative journey that had brought me here."
    },
    {
      title: "Vivid Description",
      content: "The ancient oak tree stood sentinel at the edge of the clearing, its gnarled branches reaching skyward like fingers grasping for the stars. Moonlight filtered through its leaves, creating a dappled pattern on the forest floor below."
    },
    {
      title: "Emotional Impact",
      content: "Her eyes sparkled with unshed tears as she held the letter close to her heart. The words on the page seemed to blur as memories of their shared laughter and whispered secrets flooded her mind."
    }
  ];

  const achievements = [
    {
      title: "Word Master",
      description: "Used no 'very' or 'really' words",
      icon: "📚"
    },
    {
      title: "Sentence Variety",
      description: "No repeated sentence starters",
      icon: "✨"
    },
    {
      title: "Perfect Spelling",
      description: "No spelling mistakes",
      icon: "🎯"
    },
    {
      title: "Strong Structure",
      description: "No sentences ending with prepositions",
      icon: "🏗️"
    }
  ];

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
      setMisspelledWords(response.data.misspelledWords || []);
    } catch (err) {
      console.error('Full error:', err);
      setError(`Error grading essay: ${err.response?.data?.details || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    try {
      await axios.post('http://localhost:5001/api/clear-database');
      alert('Database cleared successfully');
    } catch (err) {
      console.error('Error clearing database:', err);
      alert('Error clearing database');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231976d2\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
          zIndex: 0,
        }
      }}>
        <BookIcon className="floating-icon floating-icon-1" sx={{ fontSize: 60 }} />
        <EditIcon className="floating-icon floating-icon-2" sx={{ fontSize: 60 }} />
        <SchoolIcon className="floating-icon floating-icon-3" sx={{ fontSize: 60 }} />
        <EmojiEventsIcon className="floating-icon floating-icon-4" sx={{ fontSize: 60 }} />

        <div className="background-decoration">
          <div className="decoration-element decoration-element-1"></div>
          <div className="decoration-element decoration-element-2"></div>
          <div className="decoration-element decoration-element-3"></div>
        </div>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 2,
                mb: 2
              }}>
                <Box sx={{ position: 'relative' }}>
                  <AutoAwesomeIcon 
                    sx={{ 
                      fontSize: 48, 
                      color: 'primary.main',
                      animation: 'float 3s ease-in-out infinite'
                    }} 
                  />
                  <SchoolIcon 
                    sx={{ 
                      fontSize: 24, 
                      color: 'secondary.main',
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      animation: 'bounce 2s ease-in-out infinite'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Essay Grader
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                color="primary"
                gutterBottom
                sx={{ 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <span>Mr. Mark Adams</span>
                <span style={{ color: '#1976d2' }}>•</span>
                <span>English Teacher</span>
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <span>Upload your essay and get instant feedback on your writing quality</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Writing Tips">
                  <IconButton 
                    color="primary" 
                    onClick={() => setShowTips(!showTips)}
                    sx={{ 
                      animation: showTips ? 'pulse 1s infinite' : 'none',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    <LightbulbIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Writing Examples">
                  <IconButton 
                    color="primary"
                    onClick={() => setShowExamples(true)}
                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <EditNoteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Achievement Badges">
                  <IconButton 
                    color="primary"
                    onClick={() => setShowAchievements(true)}
                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <EmojiEventsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearDatabase}
                sx={{ borderRadius: 2 }}
              >
                Clear Database
              </Button>
            </Box>

            <Fade in={showTips}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 2,
                  backgroundColor: 'primary.light',
                  color: 'white',
                  borderRadius: 2,
                  display: showTips ? 'block' : 'none'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <HelpOutlineIcon />
                  <Typography variant="subtitle1">Quick Writing Tips</Typography>
                </Box>
                <Typography variant="body2">
                  • Start each paragraph with a strong topic sentence<br />
                  • Use specific examples to support your ideas<br />
                  • Vary your sentence structure and length<br />
                  • Proofread carefully before submitting
                </Typography>
              </Paper>
            </Fade>

            <Dialog
              open={showExamples}
              onClose={() => setShowExamples(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Writing Examples</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  {writingExamples.map((example, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {example.title}
                      </Typography>
                      <Typography variant="body1">
                        {example.content}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowExamples(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={showAchievements}
              onClose={() => setShowAchievements(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Achievement Badges</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {achievements.map((achievement, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          backgroundColor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s'
                          }
                        }}
                      >
                        <Typography variant="h2" sx={{ mb: 1 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAchievements(false)}>Close</Button>
              </DialogActions>
            </Dialog>

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
              misspelledWords={misspelledWords}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
