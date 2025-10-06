const express = require('express');
const Quiz = require('../models/Quiz');
const CSSExam = require('../models/CSSExam');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // For now, we'll check if the user email is admin@colorplatee.com
    // In production, you should add a role field to the User model
    if (req.user.email !== 'admin@colorplatee.com') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin check'
    });
  }
};

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalQuizzes = await Quiz.countDocuments({ isActive: true });
    const totalCSSExams = await CSSExam.countDocuments({ isActive: true });
    const totalSubmissions = await Submission.countDocuments({ isCompleted: true });

    // Get recent activity
    const recentSubmissions = await Submission.find({ isCompleted: true })
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('quizId', 'question')
      .populate('cssExamId', 'title');

    // Get user level distribution
    const levelDistribution = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuizzes,
        totalCSSExams,
        totalSubmissions,
        recentActivity: recentSubmissions,
        levelDistribution: levelDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin statistics'
    });
  }
});

// @route   GET /api/admin/quizzes
// @desc    Get all quizzes for admin management
// @access  Private (Admin only)
router.get('/quizzes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        quizzes: quizzes.map(quiz => ({
          id: quiz._id,
          question: quiz.question,
          type: quiz.type,
          level: quiz.level,
          category: quiz.category,
          difficulty: quiz.difficulty,
          points: quiz.points,
          timeLimit: quiz.timeLimit,
          isActive: quiz.isActive,
          createdAt: quiz.createdAt,
          updatedAt: quiz.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get admin quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quizzes'
    });
  }
});

// @route   POST /api/admin/quizzes
// @desc    Create a new quiz
// @access  Private (Admin only)
router.post('/quizzes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const quizData = req.body;

    // Validate required fields
    if (!quizData.question || !quizData.type || !quizData.level) {
      return res.status(400).json({
        success: false,
        message: 'Question, type, and level are required'
      });
    }

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: {
        quiz: {
          id: quiz._id,
          question: quiz.question,
          type: quiz.type,
          level: quiz.level,
          category: quiz.category,
          difficulty: quiz.difficulty,
          points: quiz.points,
          timeLimit: quiz.timeLimit,
          isActive: quiz.isActive
        }
      }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quiz'
    });
  }
});

// @route   PUT /api/admin/quizzes/:id
// @desc    Update a quiz
// @access  Private (Admin only)
router.put('/quizzes/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: {
        quiz: {
          id: quiz._id,
          question: quiz.question,
          type: quiz.type,
          level: quiz.level,
          category: quiz.category,
          difficulty: quiz.difficulty,
          points: quiz.points,
          timeLimit: quiz.timeLimit,
          isActive: quiz.isActive
        }
      }
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating quiz'
    });
  }
});

// @route   DELETE /api/admin/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Admin only)
router.delete('/quizzes/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting quiz'
    });
  }
});

// @route   GET /api/admin/css-exams
// @desc    Get all CSS exams for admin management
// @access  Private (Admin only)
router.get('/css-exams', authenticateToken, isAdmin, async (req, res) => {
  try {
    const exams = await CSSExam.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        exams: exams.map(exam => ({
          id: exam._id,
          title: exam.title,
          description: exam.description,
          level: exam.level,
          category: exam.category,
          difficulty: exam.difficulty,
          points: exam.points,
          timeLimit: exam.timeLimit,
          isActive: exam.isActive,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get admin CSS exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching CSS exams'
    });
  }
});

// @route   POST /api/admin/css-exams
// @desc    Create a new CSS exam
// @access  Private (Admin only)
router.post('/css-exams', authenticateToken, isAdmin, async (req, res) => {
  try {
    const examData = req.body;

    // Validate required fields
    if (!examData.title || !examData.description || !examData.level) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and level are required'
      });
    }

    const exam = new CSSExam(examData);
    await exam.save();

    res.status(201).json({
      success: true,
      message: 'CSS exam created successfully',
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          description: exam.description,
          level: exam.level,
          category: exam.category,
          difficulty: exam.difficulty,
          points: exam.points,
          timeLimit: exam.timeLimit,
          isActive: exam.isActive
        }
      }
    });
  } catch (error) {
    console.error('Create CSS exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating CSS exam'
    });
  }
});

// @route   PUT /api/admin/css-exams/:id
// @desc    Update a CSS exam
// @access  Private (Admin only)
router.put('/css-exams/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exam = await CSSExam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'CSS exam not found'
      });
    }

    res.json({
      success: true,
      message: 'CSS exam updated successfully',
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          description: exam.description,
          level: exam.level,
          category: exam.category,
          difficulty: exam.difficulty,
          points: exam.points,
          timeLimit: exam.timeLimit,
          isActive: exam.isActive
        }
      }
    });
  } catch (error) {
    console.error('Update CSS exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating CSS exam'
    });
  }
});

// @route   DELETE /api/admin/css-exams/:id
// @desc    Delete a CSS exam
// @access  Private (Admin only)
router.delete('/css-exams/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await CSSExam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'CSS exam not found'
      });
    }

    res.json({
      success: true,
      message: 'CSS exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete CSS exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting CSS exam'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private (Admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          totalScore: user.totalScore,
          badges: user.badges,
          achievements: user.achievements,
          isActive: user.isActive,
          createdAt: user.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

module.exports = router;
