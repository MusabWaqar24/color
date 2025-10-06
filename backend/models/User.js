const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not using Google OAuth
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  googleId: {
    type: String,
    sparse: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Pro'],
    default: 'Beginner'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['First Quiz', 'CSS Master', 'Speed Demon', 'Perfectionist', 'Level Up', 'Quiz Champion']
  }],
  achievements: {
    quizzesCompleted: {
      type: Number,
      default: 0
    },
    cssExamsCompleted: {
      type: Number,
      default: 0
    },
    perfectScores: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: Date,
      default: Date.now
    }
  },
  progress: {
    beginner: {
      quizzesCompleted: { type: Number, default: 0 },
      cssExamsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    intermediate: {
      quizzesCompleted: { type: Number, default: 0 },
      cssExamsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    pro: {
      quizzesCompleted: { type: Number, default: 0 },
      cssExamsCompleted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Initialize progress object if not present
userSchema.pre('save', function(next) {
  if (!this.progress) {
    this.progress = {
      beginner: {
        quizzesCompleted: 0,
        cssExamsCompleted: 0,
        averageScore: 0
      },
      intermediate: {
        quizzesCompleted: 0,
        cssExamsCompleted: 0,
        averageScore: 0
      },
      pro: {
        quizzesCompleted: 0,
        cssExamsCompleted: 0,
        averageScore: 0
      }
    };
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last activity and streak
userSchema.methods.updateActivity = function() {
  const today = new Date();
  const lastActivity = new Date(this.achievements.lastActivityDate);
  
  // Check if last activity was yesterday (maintain streak)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActivity.toDateString() === yesterday.toDateString()) {
    this.achievements.streak += 1;
  } else if (lastActivity.toDateString() !== today.toDateString()) {
    this.achievements.streak = 1;
  }
  
  this.achievements.lastActivityDate = today;
  return this.save();
};

// Add score method
userSchema.methods.addScore = function(points, level, type) {
  this.totalScore += points;
  
  // Update level progress
  if (type === 'quiz') {
    this.progress[level.toLowerCase()].quizzesCompleted += 1;
  } else if (type === 'css') {
    this.progress[level.toLowerCase()].cssExamsCompleted += 1;
  }
  
  // Update achievements
  if (type === 'quiz') {
    this.achievements.quizzesCompleted += 1;
  } else if (type === 'css') {
    this.achievements.cssExamsCompleted += 1;
  }
  
  // Check for level advancement
  if (this.level === 'Beginner' && this.totalScore >= 500) {
    this.level = 'Intermediate';
    this.badges.push('Level Up');
  } else if (this.level === 'Intermediate' && this.totalScore >= 1500) {
    this.level = 'Pro';
    this.badges.push('Level Up');
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
