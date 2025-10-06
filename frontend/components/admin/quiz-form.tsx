'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface QuizFormProps {
  onClose: () => void
  onSave: (quizData: any) => void
}

export function QuizForm({ onClose, onSave }: QuizFormProps) {
  const [formData, setFormData] = useState({
    question: '',
    type: 'multiple-choice',
    level: 'Beginner',
    category: 'colors',
    difficulty: 'Easy',
    points: 10,
    timeLimit: 30,
    options: [{ text: '', value: '', isCorrect: false }],
    correctAnswer: '',
    explanation: '',
    tags: []
  })

  const [newOption, setNewOption] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { text: newOption, value: newOption, isCorrect: false }]
      }))
      setNewOption('')
    }
  }

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question.trim()) {
      toast.error('Question is required')
      return
    }

    if (formData.options.length < 2) {
      toast.error('At least 2 options are required')
      return
    }

    if (formData.type === 'multiple-choice' && !formData.correctAnswer) {
      toast.error('Correct answer is required')
      return
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Add New Quiz Question</CardTitle>
            <CardDescription>Create a new quiz question for students</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium mb-2">Question *</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Enter the quiz question..."
                required
              />
            </div>

            {/* Type and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="color-guess">Color Guess</option>
                  <option value="hex-to-rgb">HEX to RGB</option>
                  <option value="rgb-to-hex">RGB to HEX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="colors">Colors</option>
                  <option value="css-basics">CSS Basics</option>
                  <option value="layout">Layout</option>
                  <option value="animations">Animations</option>
                  <option value="responsive">Responsive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Points and Time Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Points</label>
                <Input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time Limit (seconds)</label>
                <Input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  min="10"
                  max="300"
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium mb-2">Answer Options</label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option.value}
                      checked={formData.correctAnswer === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="text-primary-600"
                    />
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      disabled={formData.options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  />
                  <Button type="button" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                className="w-full p-3 border rounded-lg resize-none"
                rows={2}
                placeholder="Explain why this answer is correct..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1">
                Create Quiz Question
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
