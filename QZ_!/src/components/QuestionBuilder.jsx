import React from 'react';

export function QuestionBuilder({ question, index, onUpdate, onRemove }) {
  const updateQuestion = (field, value) => {
    onUpdate({ ...question, [field]: value });
  };

  const updateOption = (optionIndex, value) => {
    if (question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      onUpdate({ ...question, options: newOptions });
    }
  };

  const renderQuestionTypeSpecific = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="label">Answer Options</label>
            <div className="radio-group">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className={`radio-item ${optionIndex === question.correctAnswer ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    className="radio-input"
                    name={`correct-${question.id}`}
                    checked={optionIndex === question.correctAnswer}
                    onChange={() => updateQuestion('correctAnswer', optionIndex)}
                  />
                  <input
                    className="input flex-1"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                  />
                  <label className="text-sm text-muted">
                    {optionIndex === question.correctAnswer ? '✓ Correct' : ''}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="label">Correct Answer</label>
            <div className="radio-group">
              <div className={`radio-item ${question.correctAnswer === 'true' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  className="radio-input"
                  name={`tf-${question.id}`}
                  checked={question.correctAnswer === 'true'}
                  onChange={() => updateQuestion('correctAnswer', 'true')}
                />
                <span className="flex-1">True</span>
                <label className="text-sm text-muted">
                  {question.correctAnswer === 'true' ? '✓ Correct' : ''}
                </label>
              </div>
              <div className={`radio-item ${question.correctAnswer === 'false' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  className="radio-input"
                  name={`tf-${question.id}`}
                  checked={question.correctAnswer === 'false'}
                  onChange={() => updateQuestion('correctAnswer', 'false')}
                />
                <span className="flex-1">False</span>
                <label className="text-sm text-muted">
                  {question.correctAnswer === 'false' ? '✓ Correct' : ''}
                </label>
              </div>
            </div>
          </div>
        );

      case 'open-ended':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label">Sample Answer (for reference)</label>
            <textarea
              className="textarea"
              placeholder="Provide a sample correct answer or key points..."
              value={question.correctAnswer}
              onChange={(e) => updateQuestion('correctAnswer', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title">Question {index + 1}</h3>
            <p className="card-description">
              {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Question
            </p>
          </div>
          <button
            onClick={onRemove}
            className="btn btn-outline btn-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="card-content space-y-6">
        {/* Question Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="label">Question Type</label>
          <select
            className="select"
            value={question.type}
            onChange={(e) => {
              const newType = e.target.value;
              let newQuestion = { ...question, type: newType };
              
              // Reset question-specific fields when type changes
              if (newType === 'multiple-choice') {
                newQuestion.options = ['', '', '', ''];
                newQuestion.correctAnswer = 0;
              } else if (newType === 'true-false') {
                newQuestion.options = undefined;
                newQuestion.correctAnswer = 'true';
              } else if (newType === 'open-ended') {
                newQuestion.options = undefined;
                newQuestion.correctAnswer = '';
              }
              
              onUpdate(newQuestion);
            }}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="open-ended">Open Ended</option>
          </select>
        </div>

        {/* Question Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="label">Question *</label>
          <textarea
            className="textarea"
            placeholder="Enter your question here..."
            value={question.question}
            onChange={(e) => updateQuestion('question', e.target.value)}
          />
        </div>

        {/* Type-specific content */}
        {renderQuestionTypeSpecific()}

        {/* Advanced Settings */}
        <div className="grid md:grid-cols-3 gap-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label">Difficulty</label>
            <select
              className="select"
              value={question.difficulty}
              onChange={(e) => updateQuestion('difficulty', e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label">Time Limit (seconds)</label>
            <input
              type="number"
              className="input"
              min="10"
              max="300"
              value={question.timeLimit}
              onChange={(e) => updateQuestion('timeLimit', parseInt(e.target.value) || 30)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label">Points</label>
            <input
              type="number"
              className="input"
              min="1"
              max="100"
              value={question.points || 10}
              onChange={(e) => updateQuestion('points', parseInt(e.target.value) || 10)}
            />
          </div>
        </div>

        {/* Hint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="label">Hint (Optional)</label>
          <input
            className="input"
            placeholder="Provide a helpful hint for participants..."
            value={question.hint || ''}
            onChange={(e) => updateQuestion('hint', e.target.value)}
          />
          <p className="text-xs text-muted">
            Hints will cost participants 25% of the question's points
          </p>
        </div>
      </div>
    </div>
  );
}