const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with detailed statistics
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with populated data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent submissions for statistics
    const recentSubmissions = await Submission.find({
      userId,
      isCompleted: true
    })
    .sort({ submittedAt: -1 })
    .limit(10);

    // Calculate additional statistics
    const totalSubmissions = await Submission.countDocuments({
      userId,
      isCompleted: true
    });

    const quizSubmissions = await Submission.countDocuments({
      userId,
      type: 'quiz',
      isCompleted: true
    });

    const cssSubmissions = await Submission.countDocuments({
      userId,
      type: 'css-exam',
      isCompleted: true
    });

    // Calculate average scores
    const avgScores = await Submission.aggregate([
      { $match: { userId, isCompleted: true } },
      {
        $group: {
          _id: '$type',
          averageScore: { $avg: '$result.score' },
          totalScore: { $sum: '$result.score' }
        }
      }
    ]);

    const stats = {
      totalSubmissions,
      quizSubmissions,
      cssSubmissions,
      averageScores: avgScores.reduce((acc, item) => {
        acc[item._id] = {
          averageScore: Math.round(item.averageScore || 0),
          totalScore: item.totalScore || 0
        };
        return acc;
      }, {}),
      recentActivity: recentSubmissions.map(sub => ({
        id: sub._id,
        type: sub.type,
        score: sub.result.score,
        submittedAt: sub.submittedAt
      }))
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          totalScore: user.totalScore,
          badges: user.badges,
          achievements: user.achievements,
          progress: user.progress,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
});

// @route   GET /api/users/progress
// @desc    Get user progress across all levels
// @access  Private
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get detailed progress for each level
    const levelProgress = await Submission.aggregate([
      { $match: { userId, isCompleted: true } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $lookup: {
          from: 'cssexams',
          localField: 'cssExamId',
          foreignField: '_id',
          as: 'exam'
        }
      },
      {
        $addFields: {
          level: {
            $cond: {
              if: { $gt: [{ $size: '$quiz' }, 0] },
              then: { $arrayElemAt: ['$quiz.level', 0] },
              else: { $arrayElemAt: ['$exam.level', 0] }
            }
          }
        }
      },
      {
        $group: {
          _id: '$level',
          totalSubmissions: { $sum: 1 },
          averageScore: { $avg: '$result.score' },
          totalScore: { $sum: '$result.score' },
          quizCount: {
            $sum: { $cond: [{ $eq: ['$type', 'quiz'] }, 1, 0] }
          },
          cssExamCount: {
            $sum: { $cond: [{ $eq: ['$type', 'css-exam'] }, 1, 0] }
          }
        }
      }
    ]);

    // Format progress data
    const progress = {
      Beginner: {
        totalSubmissions: 0,
        averageScore: 0,
        totalScore: 0,
        quizCount: 0,
        cssExamCount: 0
      },
      Intermediate: {
        totalSubmissions: 0,
        averageScore: 0,
        totalScore: 0,
        quizCount: 0,
        cssExamCount: 0
      },
      Pro: {
        totalSubmissions: 0,
        averageScore: 0,
        totalScore: 0,
        quizCount: 0,
        cssExamCount: 0
      }
    };

    levelProgress.forEach(level => {
      if (progress[level._id]) {
        progress[level._id] = {
          totalSubmissions: level.totalSubmissions,
          averageScore: Math.round(level.averageScore || 0),
          totalScore: level.totalScore || 0,
          quizCount: level.quizCount,
          cssExamCount: level.cssExamCount
        };
      }
    });

    res.json({
      success: true,
      data: {
        progress,
        userLevel: req.user.level,
        totalScore: req.user.totalScore
      }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user progress'
    });
  }
});

// @route   GET /api/users/achievements
// @desc    Get user achievements and badges
// @access  Private
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Define all possible achievements
    const allAchievements = [
      {
        id: 'first-quiz',
        name: 'First Quiz',
        description: 'Complete your first quiz',
        icon: '🎯',
        earned: user.badges.includes('First Quiz')
      },
      {
        id: 'css-master',
        name: 'CSS Master',
        description: 'Complete 10 CSS exams',
        icon: '🎨',
        earned: user.badges.includes('CSS Master')
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete a quiz in under 30 seconds',
        icon: '⚡',
        earned: user.badges.includes('Speed Demon')
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Get a perfect score on any quiz or exam',
        icon: '💯',
        earned: user.badges.includes('Perfectionist')
      },
      {
        id: 'level-up',
        name: 'Level Up',
        description: 'Advance to the next level',
        icon: '⬆️',
        earned: user.badges.includes('Level Up')
      },
      {
        id: 'quiz-champion',
        name: 'Quiz Champion',
        description: 'Complete 50 quizzes',
        icon: '🏆',
        earned: user.badges.includes('Quiz Champion')
      }
    ];

    // Calculate progress towards achievements
    const achievements = allAchievements.map(achievement => {
      let progress = 0;
      let maxProgress = 1;

      switch (achievement.id) {
        case 'first-quiz':
          progress = user.achievements.quizzesCompleted > 0 ? 1 : 0;
          break;
        case 'css-master':
          progress = Math.min(user.achievements.cssExamsCompleted, 10);
          maxProgress = 10;
          break;
        case 'perfectionist':
          progress = user.achievements.perfectScores > 0 ? 1 : 0;
          break;
        case 'quiz-champion':
          progress = Math.min(user.achievements.quizzesCompleted, 50);
          maxProgress = 50;
          break;
        default:
          progress = achievement.earned ? 1 : 0;
      }

      return {
        ...achievement,
        progress,
        maxProgress,
        percentage: Math.round((progress / maxProgress) * 100)
      };
    });

    res.json({
      success: true,
      data: {
        achievements,
        totalBadges: user.badges.length,
        totalAchievements: achievements.filter(a => a.earned).length
      }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user achievements'
    });
  }
});

module.exports = router;
