import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const GradingCriteria = () => {
  const criteria = [
    {
      icon: <WarningIcon color="error" />,
      text: "Word count deduction: -50% if outside 500-1000 words"
    },
    {
      icon: <WarningIcon color="error" />,
      text: "Spelling mistakes: -1% per misspelled word"
    },
    {
      icon: <WarningIcon color="error" />,
      text: "Nasty no-nos: -1% per use of 'very', 'really', or forms of 'get'"
    },
    {
      icon: <WarningIcon color="error" />,
      text: "Repeated starters: -3% per pair of sentences starting with the same word"
    },
    {
      icon: <WarningIcon color="error" />,
      text: "Preposition endings: -5% per sentence ending with a preposition"
    },
    {
      icon: <CheckCircleIcon color="success" />,
      text: "Maximum deduction cap: -200%"
    },
    {
      icon: <InfoIcon color="info" />,
      text: "Plagiarism results in an automatic grade of 0%"
    }
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        backgroundColor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon color="primary" />
        Grading Criteria
      </Typography>
      
      <List>
        {criteria.map((criterion, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              {criterion.icon}
            </ListItemIcon>
            <ListItemText 
              primary={criterion.text}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default GradingCriteria; 