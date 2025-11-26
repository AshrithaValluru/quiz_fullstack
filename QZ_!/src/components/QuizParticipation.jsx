import React, { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu.jsx';

export function QuizParticipation({ quizzes, quizId, onNavigate, onComplete, onLogout, currentUser }) {

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('join'); // 'join', 'quiz', 'completed'
  const [showHint, setShowHint] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);


  // Timer effect
  useEffect(() => {
    if (phase === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'quiz' && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, phase]);

    useEffect(() => {
    if (!selectedQuiz && quizzes && quizzes.length > 0 && quizId) {
      // Try to find the quiz in the passed list
      const quizFromList = quizzes.find(q => q.id === quizId);
      if (quizFromList) {
        handleJoinQuiz(quizFromList);
        return;
      }
    }

    // If not found in quizzes list, fetch from backend
    if (!selectedQuiz && quizId) {
     fetch(`http://localhost:8084/api/quizzes/${quizId}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch quiz");
          return res.json();
        })
        .then(data => {
          handleJoinQuiz(data);
        })
        .catch(err => console.error("Error fetching quiz:", err));
    }
  }, [quizId, quizzes]);


  const handleJoinQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setParticipantName(currentUser?.username || 'Anonymous');
    setPhase('quiz');
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz.questions[0]?.timeLimit || 30);
    setStartTime(Date.now());
    setAnswers([]);
    setCurrentAnswer('');
    setShowHint(false);
    setConfidenceLevel(3);
  };

  const handleAnswer = (answer) => {
    setCurrentAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const questionStartTime = startTime || Date.now();
    const timeSpent = Math.max(0, (currentQuestion.timeLimit || 30) - timeLeft);

    const answerData = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      confidenceLevel: confidenceLevel,
      usedHint: showHint,
      timeSpent: timeSpent
    };

    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(selectedQuiz.questions[currentQuestionIndex + 1]?.timeLimit || 30);
      setCurrentAnswer('');
      setShowHint(false);
      setConfidenceLevel(3);
      setStartTime(Date.now());
    } else {
      handleQuizComplete(newAnswers);
    }
  };

  const handleQuizComplete = (finalAnswers) => {
    const totalScore = calculateScore(finalAnswers);
    
    const attempt = {
      id: Date.now().toString(),
      quizId: selectedQuiz.id,
      participantName: participantName,
      answers: finalAnswers,
      totalScore: totalScore,
      completedAt: new Date()
    };

    onComplete(attempt);
    setPhase('completed');
  };

  const calculateScore = (answers) => {
    let totalScore = 0;
    
    answers.forEach((answer, index) => {
      const question = selectedQuiz.questions[index];
      const basePoints = question.points || 10;
      let questionScore = 0;

      // Check if answer is correct
      const isCorrect = 
        question.type === 'multiple-choice' ? answer.answer === question.correctAnswer :
        question.type === 'true-false' ? answer.answer === question.correctAnswer :
        answer.answer.toLowerCase().includes(question.correctAnswer.toLowerCase());

      if (isCorrect) {
        questionScore = basePoints;
        
        // Apply confidence multiplier
        const confidenceMultiplier = answer.confidenceLevel / 3;
        questionScore *= confidenceMultiplier;
        
        // Apply hint penalty
        if (answer.usedHint) {
          questionScore *= 0.75;
        }
        
        // Apply time bonus (up to 20% bonus for quick answers)
        const timeBonus = Math.max(0, (question.timeLimit - answer.timeSpent) / question.timeLimit * 0.2);
        questionScore *= (1 + timeBonus);
      }

      totalScore += Math.round(questionScore);
    });

    return totalScore;
  };

  const getCurrentQuestion = () => {
    return selectedQuiz?.questions[currentQuestionIndex];
  };

  const renderJoinPhase = () => (
    <div className="container py-8 max-w-2xl">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '24px' }}>🧠</span>
          <span className="font-bold text-lg">QuizMaster Pro</span>
        </div>
        <UserMenu user={currentUser} onLogout={onLogout} />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('home')} 
          className="btn btn-outline gap-2"
        >
          <span>←</span>
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">Join a Quiz</h1>
          <p className="text-muted">Select a quiz to participate in</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-semibold mb-2">No quizzes available</h3>
            <p className="text-muted mb-4">
              No quizzes have been created yet. Create one to get started!
            </p>
            <button 
              onClick={() => onNavigate('create')} 
              className="btn btn-primary"
            >
              Create Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card hover-shadow transition">
              <div className="card-header">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="card-title">{quiz.title}</h3>
                    <p className="card-description">{quiz.description}</p>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <div>Code: {quiz.id}</div>
                    <div>{quiz.questions.length} questions</div>
                  </div>
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
                <button
  onClick={() => onNavigate('participate', { quizId: quiz.id })}
  className="btn btn-primary w-full"
>
  Join Quiz
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuizPhase = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    return (
      <div className="container py-8 max-w-3xl">
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{selectedQuiz.title}</h1>
            <p className="text-muted">Participant: {participantName}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive' : 'text-primary'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-muted">
              {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-8">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <h2 className="card-title">Question {currentQuestionIndex + 1}</h2>
              <div className="flex gap-2">
                <span className={`badge badge-${question.difficulty === 'easy' ? 'secondary' : question.difficulty === 'medium' ? 'primary' : 'destructive'}`}>
                  {question.difficulty}
                </span>
                <span className="badge badge-outline">
                  {question.points || 10} pts
                </span>
              </div>
            </div>
          </div>
          <div className="card-content">
            <p className="text-lg mb-6">{question.question}</p>

            {/* Answer Options */}
            {question.type === 'multiple-choice' && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`answer-option ${currentAnswer === index ? 'selected' : ''}`}
                  >
                    <div className="answer-letter">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            )}

            {question.type === 'true-false' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('true')}
                  className={`answer-option ${currentAnswer === 'true' ? 'selected' : ''}`}
                >
                  <div className="answer-letter">T</div>
                  <span>True</span>
                </button>
                <button
                  onClick={() => handleAnswer('false')}
                  className={`answer-option ${currentAnswer === 'false' ? 'selected' : ''}`}
                >
                  <div className="answer-letter">F</div>
                  <span>False</span>
                </button>
              </div>
            )}

            {question.type === 'open-ended' && (
              <textarea
                className="textarea"
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {/* Hint Section */}
            {question.hint && (
              <div className="mt-6">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <span>💡</span>
                    Show Hint (-25% points)
                  </button>
                ) : (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <span>💡</span>
                      <div>
                        <div className="font-medium mb-1">Hint:</div>
                        <div className="text-sm">{question.hint}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Confidence Level */}
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Confidence Level</h3>
            <p className="card-description">
              How confident are you in your answer? Higher confidence = more points if correct!
            </p>
          </div>
          <div className="card-content">
            <div className="confidence-slider">
              <input
                type="range"
                min="1"
                max="5"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="slider w-full"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>Not Sure</span>
                <span className="font-medium">Confidence: {confidenceLevel}/5</span>
                <span>Very Sure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleNextQuestion}
          disabled={!currentAnswer && question.type !== 'open-ended'}
          className="btn btn-primary btn-lg w-full"
        >
          {currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </button>
      </div>
    );
  };

  const renderCompletedPhase = () => (
    <div className="container py-8 max-w-2xl">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
        <p className="text-lg text-muted mb-8">
          Great job, {participantName}! You've finished the quiz.
        </p>

        <div className="card mb-8">
          <div className="card-header">
            <h2 className="card-title">Your Results</h2>
          </div>
          <div className="card-content">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {answers.reduce((total, answer, index) => {
                  const question = selectedQuiz.questions[index];
                  const isCorrect = 
                    question.type === 'multiple-choice' ? answer.answer === question.correctAnswer :
                    question.type === 'true-false' ? answer.answer === question.correctAnswer :
                    true; // For open-ended, assume correct for now
                  return total + (isCorrect ? 1 : 0);
                }, 0)}/{selectedQuiz.questions.length}
              </div>
              <div className="text-lg text-muted mb-4">Correct Answers</div>
              <div className="text-2xl font-bold text-secondary">
                {calculateScore(answers)} points
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => onNavigate('reports')} 
            className="btn btn-secondary"
          >
            View Detailed Results
          </button>
          <button 
            onClick={() => onNavigate('home')} 
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  switch (phase) {
    case 'join':
      return renderJoinPhase();
    case 'quiz':
      return renderQuizPhase();
    case 'completed':
      return renderCompletedPhase();
    default:
      return renderJoinPhase();
  }
}
