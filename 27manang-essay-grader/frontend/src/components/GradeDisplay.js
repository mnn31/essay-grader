import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const GradeDisplay = ({ grade, feedback, loading, error, misspelledWords }) => {
  const [showMisspelledWords, setShowMisspelledWords] = useState(false);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        icon={<ErrorOutlineIcon />}
        sx={{ mt: 2 }}
      >
        {error}
      </Alert>
    );
  }

  if (grade === null) {
    return null;
  }

  const getGradeColor = (grade) => {
    if (grade <= 0) return 'error.main';
    if (grade < 50) return 'warning.main';
    return 'success.main';
  };

  const getGradeEmoji = (grade) => {
    if (grade <= 0) return <SentimentVeryDissatisfiedIcon sx={{ fontSize: 40, color: 'error.main' }} />;
    if (grade < 50) return <SentimentSatisfiedIcon sx={{ fontSize: 40, color: 'warning.main' }} />;
    return <SentimentVerySatisfiedIcon sx={{ fontSize: 40, color: 'success.main' }} />;
  };

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mt: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            color: 'white'
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              mr: 2,
              fontWeight: 'bold'
            }}
          >
            MA
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Mr. Adams' Grade Report
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {getGradeEmoji(grade)}
            <GradeIcon 
              sx={{ 
                fontSize: 40, 
                color: getGradeColor(grade),
                animation: 'bounce 0.5s ease-in-out'
              }} 
            />
            <Typography 
              variant="h4" 
              component="div"
              sx={{ 
                color: getGradeColor(grade),
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {grade}%
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Feedback
            </Typography>
            {misspelledWords.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<SpellcheckIcon />}
                onClick={() => setShowMisspelledWords(true)}
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'error.main',
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.dark',
                    backgroundColor: 'error.light',
                    color: 'error.dark'
                  }
                }}
              >
                Show Misspelled Words
              </Button>
            )}
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line',
              '& strong': {
                color: 'primary.main'
              },
              lineHeight: 1.8
            }}
          >
            {feedback}
          </Typography>
        </Box>
      </Paper>

      <Dialog 
        open={showMisspelledWords} 
        onClose={() => setShowMisspelledWords(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
          color: 'white'
        }}>
          Misspelled Words
        </DialogTitle>
        <DialogContent>
          <List>
            {misspelledWords.map((word, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={
                    <Chip 
                      label={word} 
                      color="error" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 1,
                        borderWidth: 2,
                        '&:hover': {
                          backgroundColor: 'error.light'
                        }
                      }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowMisspelledWords(false)}
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GradeDisplay; 