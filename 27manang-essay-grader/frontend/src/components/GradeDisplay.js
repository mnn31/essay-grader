import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const GradeDisplay = ({ grade, feedback, loading, error }) => {
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
  );
};

export default GradeDisplay; 