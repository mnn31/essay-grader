const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/essay-grader')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Essay Schema
const essaySchema = new mongoose.Schema({
  content: String,
  grade: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

const Essay = mongoose.model('Essay', essaySchema);

// Essay grading function
function gradeEssay(content) {
  let grade = 100;
  const contentLower = content.toLowerCase();
  
  // Rule 1: Check for "very" and "really"
  const veryCount = (contentLower.match(/very/g) || []).length;
  const reallyCount = (contentLower.match(/really/g) || []).length;
  
  // Rule 1: Check for forms of "get"
  const getPattern = /\b(get|gets|got|gotten|getting)\b/g;
  const getCount = (contentLower.match(getPattern) || []).length;
  
  // Calculate total deductions
  const totalDeductions = veryCount + reallyCount + getCount;
  
  // Deduct 1% for each instance
  grade = 100 - totalDeductions;
  
  // Ensure grade doesn't go below 0
  return Math.max(0, grade);
}

// Routes
app.post('/api/grade', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { content } = req.body;
    
    if (!content) {
      console.log('No content provided');
      return res.status(400).json({ error: 'Essay content is required' });
    }

    console.log('Content received, length:', content.length);

    const grade = gradeEssay(content);
    const veryCount = (content.toLowerCase().match(/very/g) || []).length;
    const reallyCount = (content.toLowerCase().match(/really/g) || []).length;
    const getCount = (content.toLowerCase().match(/\b(get|gets|got|gotten|getting)\b/g) || []).length;
    const totalDeductions = veryCount + reallyCount + getCount;
    
    const feedback = `Grade: ${grade}%\n\nIssues found:\n` +
      `Rule 1 - Nasty no-nos:\n` +
      `- "very" used ${veryCount} times\n` +
      `- "really" used ${reallyCount} times\n` +
      `- Forms of "get" used ${getCount} times\n\n` +
      `Total deductions: ${totalDeductions}%`;

    console.log('Grade calculated:', grade);
    console.log('Deductions:', { veryCount, reallyCount, getCount, totalDeductions });

    const essay = new Essay({
      content,
      grade,
      feedback
    });

    await essay.save();
    console.log('Essay saved to database');

    res.json({ grade, feedback });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Error grading essay',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 