import React, { useState } from 'react';
import { UserMenu } from './UserMenu.jsx';

export function QuizPreview({ quiz, onNavigate, onLogout, currentUser }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswers(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswers(false);
    }
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={`answer-option ${showAnswers && index === question.correctAnswer ? 'correct' : ''} ${showAnswers && index !== question.correctAnswer ? 'disabled' : ''}`}
              >
                <div className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
                {showAnswers && index === question.correctAnswer && (
                  <span className="ml-auto text-green-600 font-medium">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            <div className={`answer-option ${showAnswers && question.correctAnswer === 'true' ? 'correct' : ''} ${showAnswers && question.correctAnswer !== 'true' ? 'disabled' : ''}`}>
              <div className="answer-letter">T</div>
              <span>True</span>
              {showAnswers && question.correctAnswer === 'true' && (
                <span className="ml-auto text-green-600 font-medium">✓ Correct</span>
              )}
            </div>
            <div className={`answer-option ${showAnswers && question.correctAnswer === 'false' ? 'correct' : ''} ${showAnswers && question.correctAnswer !== 'false' ? 'disabled' : ''}`}>
              <div className="answer-letter">F</div>
              <span>False</span>
              {showAnswers && question.correctAnswer === 'false' && (
                <span className="ml-auto text-green-600 font-medium">✓ Correct</span>
              )}
            </div>
          </div>
        );

      case 'open-ended':
        return (
          <div className="space-y-4">
            <div className="p-3 border rounded-lg bg-muted">
              <p className="text-sm text-muted mb-2">Participants will type their answer here...</p>
              <textarea
                className="textarea"
                placeholder="Open-ended response area"
                disabled
                rows={3}
              />
            </div>
            {showAnswers && question.correctAnswer && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-medium text-green-800 mb-2">Sample Answer:</div>
                <div className="text-green-700">{question.correctAnswer}</div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '24px' }}>🧠</span>
          <span className="font-bold text-lg">QuizMaster Pro</span>
        </div>
        <UserMenu user={currentUser} onLogout={onLogout} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('create')} 
          className="btn btn-outline gap-2"
        >
          <span>←</span>
          Back to Editor
        </button>
        <div>
          <h1 className="text-3xl font-bold">Quiz Preview</h1>
          <p className="text-muted">Preview how your quiz will look to participants</p>
        </div>
      </div>

      {/* Quiz Info */}
      <div className="card mb-8">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title">{quiz.title}</h2>
              <p className="card-description">{quiz.description}</p>
            </div>
            <span className="badge badge-primary">PREVIEW MODE</span>
          </div>
        </div>
        <div className="card-content">
          <div className="flex flex-wrap gap-2 mb-4">
            {quiz.tags.map((tag, index) => (
              <span key={index} className="badge badge-secondary">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted">Questions</div>
              <div className="font-medium">{quiz.questions.length}</div>
            </div>
            <div>
              <div className="text-muted">Quiz Code</div>
              <div className="font-medium">{quiz.id}</div>
            </div>
            <div>
              <div className="text-muted">Randomized</div>
              <div className="font-medium">{quiz.randomizeQuestions ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div className="text-muted">Theme</div>
              <div className="font-medium capitalize">{quiz.theme.fontStyle}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
          <p className="text-sm text-muted">
            {currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
            {currentQuestion.difficulty} • 
            {currentQuestion.timeLimit}s • 
            {currentQuestion.points || 10} points
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline btn-sm"
          >
            ← Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className="btn btn-outline btn-sm"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar mb-8">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Current Question */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <h2 className="card-title">Question {currentQuestionIndex + 1}</h2>
            <div className="flex gap-2">
              <span className={`badge badge-${currentQuestion.difficulty === 'easy' ? 'secondary' : currentQuestion.difficulty === 'medium' ? 'primary' : 'destructive'}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="badge badge-outline">
                {currentQuestion.points || 10} pts
              </span>
            </div>
          </div>
        </div>
        <div className="card-content">
          <p className="text-lg mb-6">{currentQuestion.question}</p>

          {/* Answer Options */}
          {renderQuestionPreview(currentQuestion)}

          {/* Hint Section */}
          {currentQuestion.hint && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <span>💡</span>
                <div>
                  <div className="font-medium mb-1">Available Hint:</div>
                  <div className="text-sm">{currentQuestion.hint}</div>
                  <div className="text-xs text-muted mt-1">
                    (Costs 25% of question points)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="btn btn-secondary"
        >
          {showAnswers ? 'Hide' : 'Show'} Correct Answers
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('create')} 
            className="btn btn-outline"
          >
            Edit Quiz
          </button>
          <button 
            onClick={() => onNavigate('home')} 
            className="btn btn-primary"
          >
            Save & Exit
          </button>
        </div>
      </div>

      {/* Question Overview */}
      <div className="mt-12">
        <h3 className="font-semibold mb-4">Question Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                index === currentQuestionIndex ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Q{index + 1}</span>
                <span className={`badge badge-sm badge-${question.difficulty === 'easy' ? 'secondary' : question.difficulty === 'medium' ? 'primary' : 'destructive'}`}>
                  {question.difficulty}
                </span>
              </div>
              <p className="text-sm line-clamp-2 mb-2">{question.question}</p>
              <div className="flex justify-between text-xs text-muted">
                <span>{question.type.replace('-', ' ')}</span>
                <span>{question.timeLimit}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}