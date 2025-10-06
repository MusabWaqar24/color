const express = require('express');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get global leaderboard
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', level = 'all', limit = 50 } = req.query;

    let matchStage = { isCompleted: true };
    
    // Filter by type if specified
    if (type !== 'all') {
      matchStage.type = type;
    }

    // Get leaderboard data
    const leaderboard = await Submission.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$result.score' },
          submissionsCount: { $sum: 1 },
          averageScore: { $avg: '$result.score' },
          lastSubmission: { $max: '$submittedAt' },
          quizCount: {
            $sum: { $cond: [{ $eq: ['$type', 'quiz'] }, 1, 0] }
          },
          cssExamCount: {
            $sum: { $cond: [{ $eq: ['$type', 'css-exam'] }, 1, 0] }
          }
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
      // Filter by level if specified
      ...(level !== 'all' ? [{ $match: { 'user.level': level } }] : []),
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          level: '$user.level',
          avatar: '$user.avatar',
          totalScore: 1,
          submissionsCount: 1,
          averageScore: 1,
          lastSubmission: 1,
          quizCount: 1,
          cssExamCount: 1,
          badges: '$user.badges',
          achievements: '$user.achievements'
        }
      },
      { $sort: { totalScore: -1, averageScore: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Find current user's position
    const currentUserRank = rankedLeaderboard.findIndex(
      user => user.userId.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        currentUserRank: currentUserRank >= 0 ? currentUserRank + 1 : null,
        totalUsers: rankedLeaderboard.length,
        filters: {
          type,
          level,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @route   GET /api/leaderboard/level/:level
// @desc    Get leaderboard for specific level
// @access  Private
router.get('/level/:level', authenticateToken, async (req, res) => {
  try {
    const { level } = req.params;
    const { type = 'all', limit = 50 } = req.query;

    if (!['Beginner', 'Intermediate', 'Pro'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be Beginner, Intermediate, or Pro'
      });
    }

    let matchStage = { isCompleted: true };
    
    if (type !== 'all') {
      matchStage.type = type;
    }

    const leaderboard = await Submission.aggregate([
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
      { $match: { 'user.level': level } },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          level: '$user.level',
          avatar: '$user.avatar',
          totalScore: 1,
          submissionsCount: 1,
          averageScore: 1,
          lastSubmission: 1,
          badges: '$user.badges'
        }
      },
      { $sort: { totalScore: -1, averageScore: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    // Find current user's position
    const currentUserRank = rankedLeaderboard.findIndex(
      user => user.userId.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      data: {
        leaderboard: rankedLeaderboard,
        currentUserRank: currentUserRank >= 0 ? currentUserRank + 1 : null,
        totalUsers: rankedLeaderboard.length,
        level,
        filters: {
          type,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get level leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching level leaderboard'
    });
  }
});

// @route   GET /api/leaderboard/around-user
// @desc    Get leaderboard around current user's position
// @access  Private
router.get('/around-user', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', range = 5 } = req.query;
    const userId = req.user._id;

    let matchStage = { isCompleted: true };
    
    if (type !== 'all') {
      matchStage.type = type;
    }

    // Get all users sorted by score
    const allUsers = await Submission.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$result.score' },
          averageScore: { $avg: '$result.score' }
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
          level: '$user.level',
          avatar: '$user.avatar',
          totalScore: 1,
          averageScore: 1
        }
      },
      { $sort: { totalScore: -1, averageScore: -1 } }
    ]);

    // Find current user's position
    const userIndex = allUsers.findIndex(
      user => user.userId.toString() === userId.toString()
    );

    if (userIndex === -1) {
      return res.json({
        success: true,
        data: {
          message: 'User not found in leaderboard',
          leaderboard: [],
          currentUserRank: null
        }
      });
    }

    // Get users around current user
    const start = Math.max(0, userIndex - parseInt(range));
    const end = Math.min(allUsers.length, userIndex + parseInt(range) + 1);
    
    const aroundUsers = allUsers.slice(start, end).map((user, index) => ({
      ...user,
      rank: start + index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard: aroundUsers,
        currentUserRank: userIndex + 1,
        totalUsers: allUsers.length,
        filters: {
          type,
          range: parseInt(range)
        }
      }
    });
  } catch (error) {
    console.error('Get around-user leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching around-user leaderboard'
    });
  }
});

// @route   GET /api/leaderboard/stats
// @desc    Get leaderboard statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get total submissions
    const totalSubmissions = await Submission.countDocuments({ isCompleted: true });

    // Get top scores by type
    const topQuizScore = await Submission.aggregate([
      { $match: { type: 'quiz', isCompleted: true } },
      { $group: { _id: '$userId', totalScore: { $sum: '$result.score' } } },
      { $sort: { totalScore: -1 } },
      { $limit: 1 }
    ]);

    const topCSSScore = await Submission.aggregate([
      { $match: { type: 'css-exam', isCompleted: true } },
      { $group: { _id: '$userId', totalScore: { $sum: '$result.score' } } },
      { $sort: { totalScore: -1 } },
      { $limit: 1 }
    ]);

    // Get level distribution
    const levelDistribution = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSubmissions,
        topQuizScore: topQuizScore[0]?.totalScore || 0,
        topCSSScore: topCSSScore[0]?.totalScore || 0,
        levelDistribution: levelDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get leaderboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard statistics'
    });
  }
});

module.exports = router;
