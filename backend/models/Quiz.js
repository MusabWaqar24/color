const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['color-guess', 'multiple-choice', 'drag-drop', 'hex-to-rgb', 'rgb-to-hex'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Pro'],
    required: true
  },
  category: {
    type: String,
    enum: ['colors', 'css-basics', 'layout', 'animations', 'responsive'],
    required: true
  },
  // For color-based questions
  colorData: {
    hex: String,
    rgb: {
      r: Number,
      g: Number,
      b: Number
    },
    hsl: {
      h: Number,
      s: Number,
      l: Number
    },
    colorName: String
  },
  // For multiple choice questions
  options: [{
    text: String,
    value: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, number, or object
    required: true
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 10,
    min: 1,
    max: 50
  },
  timeLimit: {
    type: Number, // in seconds
    default: 30
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
quizSchema.index({ level: 1, category: 1, isActive: 1 });
quizSchema.index({ type: 1, level: 1 });

// Static method to get random quiz questions
quizSchema.statics.getRandomQuestions = function(level, category = null, limit = 10) {
  const query = { level, isActive: true };
  if (category) {
    query.category = category;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: limit } }
  ]);
};

// Static method to get quiz by difficulty
quizSchema.statics.getQuestionsByDifficulty = function(level, difficulty, limit = 10) {
  return this.find({
    level,
    difficulty,
    isActive: true
  }).limit(limit);
};

module.exports = mongoose.model('Quiz', quizSchema);
