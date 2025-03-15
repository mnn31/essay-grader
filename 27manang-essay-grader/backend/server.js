const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const { Nodehun } = require('nodehun');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2020;  // Allow environment variable override, default to 2020

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/essay-grader';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Essay Schema
const essaySchema = new mongoose.Schema({
  content: String,
  grade: Number,
  feedback: String,
  timestamp: { type: Date, default: Date.now }
});

const Essay = mongoose.model('Essay', essaySchema);

// Initialize Hunspell
let nodehun;
async function initializeSpellChecker() {
  try {
    // Load the en_US dictionary files from local directory
    const affixBuffer = await fs.readFile('../dictionaries/en_US.aff');
    const dictionaryBuffer = await fs.readFile('../dictionaries/en_US.dic');
    nodehun = new Nodehun(affixBuffer, dictionaryBuffer);
    console.log('Spell checker initialized successfully');
  } catch (error) {
    console.error('Error initializing spell checker:', error);
    // Fallback to a simpler spell check if dictionary files aren't available
    nodehun = null;
  }
}

initializeSpellChecker();

// Add common words set for plagiarism detection
const commonWords = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
  'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us'
]);

// Helper function to count words
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// Helper function to split text into sentences
function splitIntoSentences(text) {
  return text.match(/[^.!?]+[.!?]+/g) || [];
}

// Helper function to get first word of a sentence
function getFirstWord(sentence) {
  const words = sentence.trim().split(/\s+/);
  return words[0].toLowerCase();
}

// Helper function to check if sentence ends with preposition
function endsWithPreposition(sentence) {
  const prepositions = ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'under', 'over', 'into', 'onto', 'upon', 'within', 'without'];
  const words = sentence.trim().split(/\s+/);
  const lastWord = words[words.length - 1].toLowerCase();
  return prepositions.includes(lastWord);
}

// Helper function to check spelling using Nodehun
async function checkSpelling(text) {
  const words = text.toLowerCase().split(/\s+/);
  let misspelledCount = 0;
  const misspelledWords = [];
  
  if (!nodehun) {
    console.warn('Spell checker not initialized, skipping spell check');
    return { count: 0, words: [] };
  }

  for (const word of words) {
    // Skip numbers and empty words
    if (/^\d+$/.test(word) || !word) continue;

    // Remove punctuation except apostrophes
    const cleanWord = word.replace(/[.,!?;:"()\[\]{}]/g, '');
    
    // Check if word is spelled correctly
    const isCorrect = await nodehun.spell(cleanWord);
    if (!isCorrect) {
      misspelledCount++;
      misspelledWords.push(cleanWord);
    }
  }
  
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
  const countedPairs = new Set(); // To avoid double counting pairs
  const usedSentences = new Set(); // To avoid double counting sentences
  
  // Check each sentence against subsequent sentences within 3 positions
  for (let i = 0; i < sentences.length; i++) {
    if (usedSentences.has(i)) continue; // Skip if sentence already counted
    
    const currentStarter = starters[i];
    let foundViolation = false;
    
    // Only check up to 3 sentences ahead
    for (let j = i + 1; j < Math.min(i + 4, sentences.length); j++) {
      if (currentStarter === starters[j]) {
        // Create a unique key for this pair to avoid double counting
        const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (!countedPairs.has(pairKey)) {
          countedPairs.add(pairKey);
          usedSentences.add(i);
          usedSentences.add(j);
          totalDeductions += 3; // 3% per pair
          foundViolation = true;
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
    // Initialize plagiarism result at the very top
    let plagiarismResult = {
      isPlagiarized: false,
      similarity: 0
    };

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length;
    console.log('Content received, length:', wordCount);

    // Initialize deductions object
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
    const spellingResult = await checkSpelling(content);
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

    // Calculate final grade (100 - total deductions)
    let grade = 100 - deductions.totalDeductions;
    
    // Cap minimum grade at -200%
    grade = Math.max(-200, grade);

    console.log('Grade calculated:', grade);
    console.log('Deductions:', deductions);

    // Check for plagiarism
    try {
      plagiarismResult = await checkPlagiarism(content);
      console.log('Plagiarism check result:', plagiarismResult);
      
      if (plagiarismResult.isPlagiarized) {
        grade = 0;
        console.log('Essay detected as plagiarized, grade set to 0');
      }
    } catch (plagiarismError) {
      console.error('Error in plagiarism check:', plagiarismError);
      // Continue with grading even if plagiarism check fails
    }

    // Generate feedback
    let feedback = '';
    
    if (plagiarismResult.isPlagiarized) {
      feedback = '⚠️ PLAGIARISM DETECTED ⚠️\n\n';
      feedback += 'Grade: 0%\n\n';
      feedback += `This essay has been marked as plagiarized. The content is ${Math.round(plagiarismResult.similarity)}% similar to a previously submitted essay.\n`;
      feedback += 'Plagiarism is a serious academic offense. Please submit original work only.\n';
    } else {
      feedback = `Grade: ${grade}%\n\n`;
      feedback += 'Issues found:\n';

      if (deductions.wordCountDeduction > 0) {
        feedback += `Word count issue: Essay should be between 500-1000 words. Current count: ${wordCount}\n`;
      }

      if (deductions.spellingDeductions > 0) {
        feedback += `Spelling: ${spellingResult.count} misspelled words found\n`;
      }

      if (deductions.wordDeductions > 0) {
        feedback += 'Rule 1 - Nasty no-nos:\n';
        if (nastyNoNos.veryCount > 0) feedback += `- "very" used ${nastyNoNos.veryCount} times\n`;
        if (nastyNoNos.reallyCount > 0) feedback += `- "really" used ${nastyNoNos.reallyCount} times\n`;
        if (nastyNoNos.getCount > 0) feedback += `- Forms of "get" used ${nastyNoNos.getCount} times\n`;
      }

      if (deductions.starterDeductions > 0) {
        feedback += `Rule 2 - Repeated sentence starters: ${deductions.starterDeductions / 3} instances found\n`;
      }

      if (deductions.prepositionDeductions > 0) {
        feedback += `Rule 3 - Sentences ending in prepositions: ${deductions.prepositionDeductions / 5} instances found\n`;
      }

      feedback += '\nTotal deductions: ' + deductions.totalDeductions + '%';
    }

    return {
      grade,
      feedback,
      misspelledWords: spellingResult.words,
      deductions
    };
  } catch (error) {
    console.error('Error in gradeEssay:', error);
    throw error;
  }
}

// Grade essay endpoint
app.post('/api/grade', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }

    console.log('Content received, length:', content.length);

    const result = await gradeEssay(content);

    // Save essay to database
    const essay = new Essay({
      content,
      grade: result.grade,
      feedback: result.feedback
    });
    await essay.save();
    console.log('Essay saved to database');

    res.json(result);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Error grading essay', 
      details: error.message 
    });
  }
});

// Clear database endpoint
app.post('/api/clear-database', async (req, res) => {
  try {
    await Essay.deleteMany({});
    res.json({ message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ error: 'Error clearing database' });
  }
});

// Start server
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