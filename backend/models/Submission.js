const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'css-exam'],
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  cssExamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSSExam'
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  code: {
    html: String,
    css: String,
    javascript: String
  },
  result: {
    score: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    },
    requirements: [{
      requirement: String,
      passed: Boolean,
      message: String
    }]
  },
  feedback: {
    type: String,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ userId: 1, type: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ type: 1, 'result.score': -1 });

// Static method to get user submissions
submissionSchema.statics.getUserSubmissions = function(userId, type = null, limit = 20) {
  const query = { userId };
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .populate('quizId', 'question type level')
    .populate('cssExamId', 'title level category')
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get leaderboard data
submissionSchema.statics.getLeaderboard = function(type = null, limit = 100) {
  const matchStage = { isCompleted: true };
  if (type) {
    matchStage.type = type;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$result.score' },
        submissionsCount: { $sum: 1 },
        averageScore: { $avg: '$result.score' },
        lastSubmission: { $max: '$submittedAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        name: '$user.name',
        email: '$user.email',
        level: '$user.level',
        totalScore: 1,
        submissionsCount: 1,
        averageScore: 1,
        lastSubmission: 1,
        badges: '$user.badges'
      }
    },
    { $sort: { totalScore: -1, averageScore: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('Submission', submissionSchema);
