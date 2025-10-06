const express = require('express');
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/quiz/:level
// @desc    Get quiz questions by level
// @access  Private
router.get('/:level', authenticateToken, async (req, res) => {
  try {
    const { level } = req.params;
    const { category, limit = 10 } = req.query;

    if (!['Beginner', 'Intermediate', 'Pro'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be Beginner, Intermediate, or Pro'
      });
    }

    const questions = await Quiz.getRandomQuestions(level, category, parseInt(limit));

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for the specified level and category'
      });
    }

    // Remove correct answers from response
    const questionsWithoutAnswers = questions.map(q => ({
      id: q._id,
      question: q.question,
      type: q.type,
      level: q.level,
      category: q.category,
      colorData: q.colorData,
      options: q.options?.map(opt => ({
        text: opt.text,
        value: opt.value
      })),
      points: q.points,
      timeLimit: q.timeLimit,
      difficulty: q.difficulty,
      tags: q.tags
    }));

    res.json({
      success: true,
      data: {
        questions: questionsWithoutAnswers,
        totalQuestions: questions.length,
        level,
        category: category || 'all'
      }
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz questions'
    });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, timeSpent, quizId } = req.body;
    const userId = req.user._id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required'
      });
    }

    // Get quiz questions to verify answers
    const questions = await Quiz.find({
      _id: { $in: answers.map(a => a.questionId) }
    });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz questions not found'
      });
    }

    // Check answers and calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    const checkedAnswers = [];

    answers.forEach(userAnswer => {
      const question = questions.find(q => q._id.toString() === userAnswer.questionId);
      if (!question) return;

      let isCorrect = false;
      let points = 0;

      // Check answer based on question type
      switch (question.type) {
        case 'multiple-choice':
          isCorrect = question.correctAnswer === userAnswer.answer;
          break;
        case 'color-guess':
        case 'hex-to-rgb':
        case 'rgb-to-hex':
          isCorrect = question.correctAnswer.toLowerCase() === userAnswer.answer.toLowerCase();
          break;
        case 'drag-drop':
          isCorrect = JSON.stringify(question.correctAnswer) === JSON.stringify(userAnswer.answer);
          break;
        default:
          isCorrect = question.correctAnswer === userAnswer.answer;
      }

      if (isCorrect) {
        correctAnswers++;
        points = question.points;
        totalPoints += points;
      }

      checkedAnswers.push({
        questionId: userAnswer.questionId,
        answer: userAnswer.answer,
        isCorrect,
        timeSpent: userAnswer.timeSpent || 0
      });
    });

    // Create submission record
    const submission = new Submission({
      userId,
      type: 'quiz',
      quizId: quizId || null,
      answers: checkedAnswers,
      result: {
        score: totalPoints,
        totalQuestions: answers.length,
        correctAnswers,
        timeSpent: timeSpent || 0
      },
      isCompleted: true
    });

    await submission.save();

    // Update user score and achievements
    const user = await User.findById(userId);
    const questionLevel = questions[0]?.level || 'Beginner';
    await user.addScore(totalPoints, questionLevel, 'quiz');

    // Check for perfect score badge
    if (correctAnswers === answers.length && !user.badges.includes('Perfectionist')) {
      user.badges.push('Perfectionist');
      await user.save();
    }

    // Check for first quiz badge
    if (user.achievements.quizzesCompleted === 1 && !user.badges.includes('First Quiz')) {
      user.badges.push('First Quiz');
      await user.save();
    }

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        result: {
          score: totalPoints,
          totalQuestions: answers.length,
          correctAnswers,
          percentage: Math.round((correctAnswers / answers.length) * 100),
          timeSpent,
          level: questionLevel
        },
        answers: checkedAnswers,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quiz'
    });
  }
});

// @route   GET /api/quiz/categories/:level
// @desc    Get available categories for a level
// @access  Private
router.get('/categories/:level', authenticateToken, async (req, res) => {
  try {
    const { level } = req.params;

    if (!['Beginner', 'Intermediate', 'Pro'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be Beginner, Intermediate, or Pro'
      });
    }

    const categories = await Quiz.distinct('category', {
      level,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        categories,
        level
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/quiz/history
// @desc    Get user's quiz history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const userId = req.user._id;

    const submissions = await Submission.getUserSubmissions(userId, 'quiz', parseInt(limit));

    res.json({
      success: true,
      data: {
        submissions: submissions.map(sub => ({
          id: sub._id,
          score: sub.result.score,
          totalQuestions: sub.result.totalQuestions,
          correctAnswers: sub.result.correctAnswers,
          percentage: Math.round((sub.result.correctAnswers / sub.result.totalQuestions) * 100),
          timeSpent: sub.result.timeSpent,
          submittedAt: sub.submittedAt,
          quiz: sub.quizId ? {
            id: sub.quizId._id,
            question: sub.quizId.question,
            type: sub.quizId.type,
            level: sub.quizId.level
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz history'
    });
  }
});

module.exports = router;
