const express = require('express');
const CSSExam = require('../models/CSSExam');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/css-exams/:level
// @desc    Get CSS exams by level
// @access  Private
router.get('/:level', authenticateToken, async (req, res) => {
  try {
    const { level } = req.params;
    const { category } = req.query;

    if (!['Beginner', 'Intermediate', 'Pro'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be Beginner, Intermediate, or Pro'
      });
    }

    const exams = await CSSExam.getExamsByLevel(level, category);

    if (exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No CSS exams found for the specified level'
      });
    }

    // Remove sensitive information from response
    const examsWithoutAnswers = exams.map(exam => ({
      id: exam._id,
      title: exam.title,
      description: exam.description,
      level: exam.level,
      category: exam.category,
      requirements: exam.requirements.map(req => ({
        type: req.type,
        description: req.description,
        points: req.points
      })),
      starterCode: exam.starterCode,
      hints: exam.hints,
      difficulty: exam.difficulty,
      timeLimit: exam.timeLimit,
      points: exam.points,
      tags: exam.tags
    }));

    res.json({
      success: true,
      data: {
        exams: examsWithoutAnswers,
        totalExams: exams.length,
        level,
        category: category || 'all'
      }
    });
  } catch (error) {
    console.error('Get CSS exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching CSS exams'
    });
  }
});

// @route   GET /api/css-exams/:level/:id
// @desc    Get specific CSS exam
// @access  Private
router.get('/:level/:id', authenticateToken, async (req, res) => {
  try {
    const { level, id } = req.params;

    const exam = await CSSExam.findOne({
      _id: id,
      level,
      isActive: true
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'CSS exam not found'
      });
    }

    // Remove expected output from response
    const examData = {
      id: exam._id,
      title: exam.title,
      description: exam.description,
      level: exam.level,
      category: exam.category,
      requirements: exam.requirements,
      starterCode: exam.starterCode,
      hints: exam.hints,
      difficulty: exam.difficulty,
      timeLimit: exam.timeLimit,
      points: exam.points,
      tags: exam.tags
    };

    res.json({
      success: true,
      data: {
        exam: examData
      }
    });
  } catch (error) {
    console.error('Get CSS exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching CSS exam'
    });
  }
});

// @route   POST /api/css-exams/submit
// @desc    Submit CSS exam solution
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { examId, code, timeSpent } = req.body;
    const userId = req.user._id;

    if (!examId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Exam ID and code are required'
      });
    }

    // Get the exam details
    const exam = await CSSExam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'CSS exam not found'
      });
    }

    // Validate code against requirements
    const validationResults = validateCodeRequirements(code, exam.requirements);
    
    let totalScore = 0;
    let passedRequirements = 0;

    validationResults.forEach(result => {
      if (result.passed) {
        totalScore += result.points;
        passedRequirements++;
      }
    });

    // Create submission record
    const submission = new Submission({
      userId,
      type: 'css-exam',
      cssExamId: examId,
      code,
      result: {
        score: totalScore,
        totalQuestions: exam.requirements.length,
        correctAnswers: passedRequirements,
        timeSpent: timeSpent || 0,
        requirements: validationResults
      },
      isCompleted: true
    });

    await submission.save();

    // Update user score and achievements
    const user = await User.findById(userId);
    await user.addScore(totalScore, exam.level, 'css');

    // Check for CSS Master badge
    if (user.achievements.cssExamsCompleted >= 10 && !user.badges.includes('CSS Master')) {
      user.badges.push('CSS Master');
      await user.save();
    }

    // Check for perfect score badge
    if (passedRequirements === exam.requirements.length && !user.badges.includes('Perfectionist')) {
      user.badges.push('Perfectionist');
      await user.save();
    }

    res.json({
      success: true,
      message: 'CSS exam submitted successfully',
      data: {
        result: {
          score: totalScore,
          totalRequirements: exam.requirements.length,
          passedRequirements,
          percentage: Math.round((passedRequirements / exam.requirements.length) * 100),
          timeSpent,
          level: exam.level
        },
        requirements: validationResults,
        badges: user.badges,
        feedback: generateFeedback(validationResults, exam.level)
      }
    });
  } catch (error) {
    console.error('CSS exam submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting CSS exam'
    });
  }
});

// Helper function to validate code against requirements
function validateCodeRequirements(code, requirements) {
  const results = [];

  requirements.forEach(req => {
    let passed = false;
    let message = '';

    switch (req.type) {
      case 'selector':
        passed = code.includes(req.selector);
        message = passed ? `Selector '${req.selector}' found` : `Missing selector '${req.selector}'`;
        break;

      case 'property':
        passed = code.includes(req.property);
        message = passed ? `Property '${req.property}' found` : `Missing property '${req.property}'`;
        break;

      case 'value':
        if (req.expectedValue) {
          passed = code.includes(req.expectedValue);
          message = passed ? `Value '${req.expectedValue}' found` : `Expected value '${req.expectedValue}' not found`;
        }
        break;

      case 'effect':
        // Check for common CSS effects
        const effects = ['hover', 'transition', 'transform', 'animation', 'box-shadow'];
        passed = effects.some(effect => code.includes(effect));
        message = passed ? 'CSS effect detected' : 'No CSS effects detected';
        break;

      case 'layout':
        // Check for layout properties
        const layoutProps = ['display', 'flex', 'grid', 'position', 'float'];
        passed = layoutProps.some(prop => code.includes(prop));
        message = passed ? 'Layout property detected' : 'No layout properties detected';
        break;

      default:
        message = 'Unknown requirement type';
    }

    results.push({
      requirement: req.description,
      passed,
      message,
      points: passed ? req.points : 0
    });
  });

  return results;
}

// Helper function to generate feedback
function generateFeedback(results, level) {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  let feedback = `You completed ${passed} out of ${total} requirements (${percentage}%). `;

  if (percentage === 100) {
    feedback += "Excellent work! You've mastered this challenge.";
  } else if (percentage >= 80) {
    feedback += "Great job! You're very close to perfection.";
  } else if (percentage >= 60) {
    feedback += "Good effort! Review the feedback and try to improve.";
  } else {
    feedback += "Keep practicing! Focus on the basic requirements first.";
  }

  return feedback;
}

// @route   GET /api/css-exams/history
// @desc    Get user's CSS exam history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const userId = req.user._id;

    const submissions = await Submission.getUserSubmissions(userId, 'css-exam', parseInt(limit));

    res.json({
      success: true,
      data: {
        submissions: submissions.map(sub => ({
          id: sub._id,
          score: sub.result.score,
          totalRequirements: sub.result.totalQuestions,
          passedRequirements: sub.result.correctAnswers,
          percentage: Math.round((sub.result.correctAnswers / sub.result.totalQuestions) * 100),
          timeSpent: sub.result.timeSpent,
          submittedAt: sub.submittedAt,
          exam: sub.cssExamId ? {
            id: sub.cssExamId._id,
            title: sub.cssExamId.title,
            level: sub.cssExamId.level,
            category: sub.cssExamId.category
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Get CSS exam history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching CSS exam history'
    });
  }
});

module.exports = router;
