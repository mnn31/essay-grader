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
  Chip
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';

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

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mt: 2,
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
              fontWeight: 'bold'
            }}
          >
            {grade}%
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Feedback</Typography>
          {misspelledWords.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<SpellcheckIcon />}
              onClick={() => setShowMisspelledWords(true)}
              sx={{ borderRadius: 2 }}
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
            }
          }}
        >
          {feedback}
        </Typography>
      </Paper>

      <Dialog 
        open={showMisspelledWords} 
        onClose={() => setShowMisspelledWords(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Misspelled Words</DialogTitle>
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
                      sx={{ borderRadius: 1 }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMisspelledWords(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GradeDisplay; 