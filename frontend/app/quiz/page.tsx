'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { quizApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Target, Trophy } from 'lucide-react'
import { QuizQuestion, QuizAnswer } from '@/types'
import toast from 'react-hot-toast'

export default function QuizPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft, quizStarted])

  const loadQuestions = async (level: string = 'Beginner') => {
    try {
      const response = await quizApi.getQuestions(level, undefined, 5)
      if (response.success && response.data) {
        setQuestions(response.data.questions)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      toast.error('Failed to load questions')
    }
  }

  const startQuiz = () => {
    if (user) {
      loadQuestions(user.level)
      setQuizStarted(true)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = currentQuestion.timeLimit - timeLeft

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      timeSpent,
    }

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 30)
    } else {
      // Quiz completed
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers: QuizAnswer[]) => {
    setIsSubmitting(true)
    try {
      const totalTimeSpent = finalAnswers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0)
      
      const response = await quizApi.submitAnswers({
        answers: finalAnswers,
        timeSpent: totalTimeSpent,
      })

      if (response.success && response.data) {
        setResult(response.data.result)
        setQuizCompleted(true)
        toast.success('Quiz submitted successfully!')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const restartQuiz = () => {
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer('')
    setTimeLeft(30)
    setQuizStarted(false)
    setQuizCompleted(false)
    setResult(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (quizCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>
                Great job on completing the quiz. Here are your results:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.score}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Points Earned
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.correctAnswers}/{result.totalQuestions}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Correct Answers
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Accuracy
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {result.badges.map((badge: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    🏅 {badge}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={restartQuiz} variant="outline">
                  Take Another Quiz
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">CSS Quiz Challenge</CardTitle>
              <CardDescription className="text-lg">
                Test your CSS knowledge with our interactive quiz!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Quiz Rules:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Each question has a time limit</li>
                  <li>• Choose the best answer from the options</li>
                  <li>• Points are awarded based on correctness and speed</li>
                  <li>• Complete all questions to see your final score</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={startQuiz}
                  size="lg"
                  className="px-8"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CSS Quiz
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
            <CardDescription>
              {currentQuestion.category} • {currentQuestion.difficulty} • {currentQuestion.points} points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer Options */}
            {currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <span className="font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer || isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  'Finish Quiz'
                ) : (
                  'Next Question'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
