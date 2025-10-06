const mongoose = require('mongoose');

const cssExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Pro'],
    required: true
  },
  category: {
    type: String,
    enum: ['layout', 'styling', 'animations', 'responsive', 'advanced'],
    required: true
  },
  requirements: [{
    type: {
      type: String,
      enum: ['selector', 'property', 'value', 'effect', 'layout'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    selector: String, // CSS selector to check
    property: String, // CSS property to check
    expectedValue: String, // Expected value or pattern
    points: {
      type: Number,
      default: 10
    }
  }],
  starterCode: {
    html: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    }
  },
  expectedOutput: {
    type: String, // Description or image URL of expected result
    required: true
  },
  hints: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  points: {
    type: Number,
    default: 50,
    min: 10,
    max: 100
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
cssExamSchema.index({ level: 1, category: 1, isActive: 1 });
cssExamSchema.index({ difficulty: 1, level: 1 });

// Static method to get exams by level
cssExamSchema.statics.getExamsByLevel = function(level, category = null) {
  const query = { level, isActive: true };
  if (category) {
    query.category = category;
  }
  
  return this.find(query).sort({ difficulty: 1, createdAt: 1 });
};

// Static method to get random exam
cssExamSchema.statics.getRandomExam = function(level, category = null) {
  const query = { level, isActive: true };
  if (category) {
    query.category = category;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

module.exports = mongoose.model('CSSExam', cssExamSchema);
