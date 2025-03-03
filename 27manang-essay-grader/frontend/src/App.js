import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  TextField
} from '@mui/material';
import axios from 'axios';

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Essay Grader
        </Typography>
        
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Upload your essay to get graded based on:
          <br />
          • -1% for each use of "very", "really", or forms of "get"
          <br />
          • -1% for each spelling mistake
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <input
            accept=".txt"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span">
              Upload Essay
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Essay Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !content}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Grade Essay'}
        </Button>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {grade !== null && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Grade: {grade}%
            </Typography>
            <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
              {feedback}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default App;
