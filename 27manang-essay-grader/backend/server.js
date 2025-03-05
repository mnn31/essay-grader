const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Load wordlist dictionary
const dictionary = new Set();
const dictionaryPath = path.join(__dirname, '../wordlist.txt');
try {
  console.log('Starting to load wordlist dictionary from:', dictionaryPath);
  const dictionaryContent = fs.readFileSync(dictionaryPath, 'utf8');
  console.log('Dictionary file read successfully, size:', dictionaryContent.length, 'bytes');
  const lines = dictionaryContent.split('\n');
  console.log('Split into', lines.length, 'lines');
  lines.forEach(line => {
    const word = line.trim().toLowerCase();
    if (word) {
      dictionary.add(word);
    }
  });
  console.log('Successfully loaded wordlist dictionary with', dictionary.size, 'words');
} catch (error) {
  console.error('Error loading wordlist dictionary:', error);
}

// Define common words for spelling check
const commonWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'were', 'will', 'with',
  'about', 'after', 'again', 'against', 'all', 'am', 'any', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'if', 'into', 'its', 'itself', 'just', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'off', 'once', 'only', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'beautiful', 'beach', 'water', 'ocean', 'swim', 'sand', 'waves', 'dolphins', 'photos', 'sunset', 'stars', 'night', 'friends', 'food', 'experience', 'memorable', 'amazing', 'activities', 'restaurants', 'people', 'crowded', 'place', 'fun', 'favorite', 'spot', 'belong', 'happy', 'treasures', 'coral', 'fish', 'seaweed', 'rocks', 'exciting', 'crystal', 'clear', 'weather', 'perfect', 'snorkeling', 'colorful', 'reefs', 'gentle', 'seashells', 'sandcastles', 'spectacular', 'bright', 'delicious', 'coastal', 'excellent', 'shoreline', 'ideal', 'walking', 'surfing', 'wonderful', 'interesting', 'peaceful', 'relaxation', 'various', 'creatures', 'formations', 'remarkable', 'memories', 'forever', 'adventure', 'incredible', 'journey', 'unforgettable', 'trip'
]);

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

// Helper function to count words
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// Helper function to split text into sentences
function splitIntoSentences(text) {
  // Split on sentence endings followed by space and capital letter
  return text.split(/([.!?]+\s+[A-Z])/).reduce((acc, curr, i, arr) => {
    if (i % 2 === 0) {
      acc.push(curr + (arr[i + 1] || ''));
    }
    return acc;
  }, []);
}

// Helper function to get first word of a sentence
function getFirstWord(sentence) {
  return sentence.trim().split(/\s+/)[0].toLowerCase();
}

// Helper function to check if sentence ends with preposition
function endsWithPreposition(sentence) {
  const prepositions = ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'under', 'over', 'into', 'onto', 'upon', 'within', 'without'];
  const words = sentence.trim().split(/\s+/);
  const lastWord = words[words.length - 1].toLowerCase();
  return prepositions.includes(lastWord);
}

// Helper function to check spelling
function checkSpelling(text) {
  const words = text.toLowerCase().split(/\s+/);
  let misspelledCount = 0;
  const misspelledWords = [];
  
  words.forEach(word => {
    // Skip numbers
    if (/^\d+$/.test(word)) {
      return;
    }

    // Remove all punctuation except apostrophes
    word = word.replace(/[.,!?;:"()\[\]{}]/g, '');
    
    // Handle contractions with apostrophes
    if (word.includes("'")) {
      // Split on apostrophe and check each part
      const parts = word.split("'");
      if (parts.length === 2) {
        // Handle common contractions like "don't", "won't", "can't"
        if (['dont', 'wont', 'cant'].includes(parts[0])) {
          return;
        }
        // Handle possessive forms
        if (parts[1] === 's' || parts[1] === 't') {
          word = parts[0];
        }
      }
    }
    
    // Skip empty words
    if (!word) return;
    
    // Check if word is in dictionary or is a plural/ing form of a dictionary word
    if (!dictionary.has(word) && !commonWords.has(word)) {
      // Try removing 's' or 'es' to check if base word exists
      const baseWord = word.replace(/(?:s|es)$/, '');
      if (dictionary.has(baseWord)) {
        return;
      }
      
      // Try removing 'ing' to check if base word exists
      const ingBaseWord = word.replace(/ing$/, '');
      if (dictionary.has(ingBaseWord)) {
        return;
      }
      
      // Try removing 'ing' and adding 'e' (for words like 'making' -> 'make')
      const ingBaseWordWithE = word.replace(/ing$/, 'e');
      if (dictionary.has(ingBaseWordWithE)) {
        return;
      }
      
      misspelledCount++;
      misspelledWords.push(word);
    }
  });
  
  return {
    count: misspelledCount,
    words: misspelledWords
  };
}

// Function to check for nasty no-nos
function checkNastyNoNos(text) {
  const nastyWords = {
    very: 0,
    really: 0,
    get: 0
  };

  // Count occurrences of nasty words
  const words = text.toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (word === 'very') nastyWords.very++;
    if (word === 'really') nastyWords.really++;
    if (word.startsWith('get')) nastyWords.get++;
  });

  return {
    veryCount: nastyWords.very,
    reallyCount: nastyWords.really,
    getCount: nastyWords.get,
    totalDeductions: nastyWords.very + nastyWords.really + nastyWords.get
  };
}

// Helper function to check repeated starters
function checkRepeatedStarters(text) {
  const sentences = splitIntoSentences(text);
  const starters = sentences.map(getFirstWord);
  let totalDeductions = 0;
  const countedPairs = new Set(); // To avoid double counting
  
  // Check each sentence against subsequent sentences within 3 positions
  for (let i = 0; i < sentences.length; i++) {
    const currentStarter = starters[i];
    
    // Only check up to 3 sentences ahead
    for (let j = i + 1; j < Math.min(i + 4, sentences.length); j++) {
      if (currentStarter === starters[j]) {
        // Create a unique key for this pair to avoid double counting
        const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (!countedPairs.has(pairKey)) {
          countedPairs.add(pairKey);
          totalDeductions += 3; // 3% per pair
        }
      }
    }
  }
  
  return totalDeductions;
}

// Helper function to check preposition endings
function checkPrepositionEndings(text) {
  const sentences = splitIntoSentences(text);
  return sentences.filter(endsWithPreposition).length * 5; // 5% per sentence
}

// Helper function to check for plagiarism
async function checkPlagiarism(content) {
  try {
    const previousEssays = await Essay.find({}, 'content');
    
    // Clean content for comparison
    const cleanContent = content.toLowerCase()
      .replace(/[.,!?;:"()\[\]{}]/g, '') // Remove punctuation except apostrophes
      .split(/\s+/)
      .filter(word => {
        // Skip numbers and empty words
        if (/^\d+$/.test(word) || !word) return false;
        
        // Handle contractions and possessives
        if (word.includes("'")) {
          const parts = word.split("'");
          if (parts.length === 2) {
            if (['dont', 'wont', 'cant'].includes(parts[0])) return false;
            if (parts[1] === 's' || parts[1] === 't') return true;
          }
        }
        
        return !commonWords.has(word);
      })
      .join(' ');
    
    for (const essay of previousEssays) {
      const cleanEssay = essay.content.toLowerCase()
        .replace(/[.,!?;:"()\[\]{}]/g, '') // Remove punctuation except apostrophes
        .split(/\s+/)
        .filter(word => {
          // Skip numbers and empty words
          if (/^\d+$/.test(word) || !word) return false;
          
          // Handle contractions and possessives
          if (word.includes("'")) {
            const parts = word.split("'");
            if (parts.length === 2) {
              if (['dont', 'wont', 'cant'].includes(parts[0])) return false;
              if (parts[1] === 's' || parts[1] === 't') return true;
            }
          }
          
          return !commonWords.has(word);
        })
        .join(' ');
      
      // Calculate Jaccard similarity
      const contentWords = new Set(cleanContent.split(/\s+/));
      const essayWords = new Set(cleanEssay.split(/\s+/));
      
      // Find intersection and union
      const intersection = new Set([...contentWords].filter(word => essayWords.has(word)));
      const union = new Set([...contentWords, ...essayWords]);
      
      // Calculate Jaccard similarity ratio
      const similarity = intersection.size / union.size;
      
      // If similarity is above 90%, consider it plagiarized
      if (similarity > 0.9) {
        return {
          isPlagiarized: true,
          similarity: similarity * 100
        };
      }
    }
    
    return {
      isPlagiarized: false,
      similarity: 0
    };
  } catch (error) {
    console.error('Error checking plagiarism:', error);
    return {
      isPlagiarized: false,
      similarity: 0
    };
  }
}

// Essay grading function
async function gradeEssay(content) {
  try {
    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length;
    console.log('Content received, length:', wordCount);

    // Calculate deductions
    const deductions = {
      wordCountDeduction: 0,
      wordDeductions: 0,
      starterDeductions: 0,
      prepositionDeductions: 0,
      spellingDeductions: 0,
      totalDeductions: 0
    };

    // Word count deduction (50% if less than 500 or more than 1000)
    if (wordCount < 500 || wordCount > 1000) {
      deductions.wordCountDeduction = 50;
    }

    // Check spelling
    const spellingResult = checkSpelling(content);
    deductions.spellingDeductions = spellingResult.count;

    // Check nasty no-nos
    const nastyNoNos = checkNastyNoNos(content);
    deductions.wordDeductions = nastyNoNos.totalDeductions;

    // Check repeated starters
    const starterDeductions = checkRepeatedStarters(content);
    deductions.starterDeductions = starterDeductions;

    // Check preposition endings
    const prepositionDeductions = checkPrepositionEndings(content);
    deductions.prepositionDeductions = prepositionDeductions;

    // Calculate total deductions
    deductions.totalDeductions = 
      deductions.wordCountDeduction +
      deductions.wordDeductions +
      deductions.starterDeductions +
      deductions.prepositionDeductions +
      deductions.spellingDeductions;

    // Calculate grade (100 - total deductions)
    let grade = 100 - deductions.totalDeductions;

    // Cap grade at -200%
    if (grade < -200) {
      grade = -200;
    }

    // Check for plagiarism after calculating grade
    const plagiarismResult = await checkPlagiarism(content);
    if (plagiarismResult.isPlagiarized) {
      grade = 0;
    }

    console.log('Grade calculated:', grade);
    console.log('Deductions:', deductions);

    return {
      grade,
      wordCount,
      deductions,
      plagiarismResult,
      misspelledWords: spellingResult.words
    };
  } catch (error) {
    console.error('Error in gradeEssay:', error);
    throw error;
  }
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

    const gradeResult = await gradeEssay(content);
    
    const feedback = `Grade: ${gradeResult.grade}%\n\nIssues found:\n` +
      `Rule 0 - Word count (500-1000 words):\n` +
      `- Current word count: ${gradeResult.wordCount}\n` +
      (gradeResult.wordCount < 500 || gradeResult.wordCount > 1000 ? `- Deducted 50% for incorrect word count\n\n` : `- Word count is within acceptable range\n\n`) +
      `Spelling Check:\n` +
      `- Found ${gradeResult.deductions.spellingDeductions} misspelled words\n` +
      `- Deducted ${gradeResult.deductions.spellingDeductions}% (1% per misspelled word)\n\n` +
      `Rule 1 - Nasty no-nos:\n` +
      `- Found ${gradeResult.deductions.wordDeductions} nasty no-nos\n` +
      `- Deducted ${gradeResult.deductions.wordDeductions}%\n\n` +
      `Rule 2 - Repeated sentence starters:\n` +
      `- Found ${gradeResult.deductions.starterDeductions} pairs of sentences starting with the same word\n` +
      `- Deducted ${gradeResult.deductions.starterDeductions}% (3% per pair)\n\n` +
      `Rule 3 - Sentences ending with prepositions:\n` +
      `- Found ${gradeResult.deductions.prepositionDeductions} sentences ending with prepositions\n` +
      `- Deducted ${gradeResult.deductions.prepositionDeductions}% (5% per sentence)\n\n` +
      `Total deductions: ${gradeResult.deductions.totalDeductions}%\n\n` +
      (gradeResult.grade === 0 ? `This paper was plagiarized with ${gradeResult.plagiarismResult.similarity}% certainty\n` : `This paper was not plagiarized\n`);

    console.log('Grade calculated:', gradeResult.grade);
    console.log('Deductions:', gradeResult.deductions);

    const essay = new Essay({
      content,
      grade: gradeResult.grade,
      feedback
    });

    await essay.save();
    console.log('Essay saved to database');

    res.json({ 
      grade: gradeResult.grade, 
      feedback,
      misspelledWords: gradeResult.misspelledWords
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Error grading essay',
      details: error.message
    });
  }
});

// Add new route to clear database
app.post('/api/clear-database', async (req, res) => {
  try {
    await Essay.deleteMany({});
    res.json({ message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ error: 'Error clearing database' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {
  checkSpelling,
  checkNastyNoNos,
  checkRepeatedStarters,
  checkPrepositionEndings,
  checkPlagiarism,
  gradeEssay
};