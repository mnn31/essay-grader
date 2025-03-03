import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUpload = ({ file, onFileChange, onFileRemove }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        backgroundColor: 'background.default',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
          borderColor: 'primary.dark',
        }
      }}
    >
      <input
        accept=".txt"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={onFileChange}
      />
      
      {!file ? (
        <Box sx={{ textAlign: 'center' }}>
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload Essay File
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            or drag and drop your .txt file here
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon color="primary" />
            <Typography variant="body1">
              {file.name}
            </Typography>
          </Box>
          <Tooltip title="Remove file">
            <IconButton 
              onClick={onFileRemove}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload; 