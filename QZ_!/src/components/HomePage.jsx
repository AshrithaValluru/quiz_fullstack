import React, { useState } from 'react';

export function HomePage({ onNavigate, onLogout, currentUser, quizzes, isAuthenticated, onShowLogin, onShowSignup }) {
  const [quizCode, setQuizCode] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleJoinQuiz = () => {
    if (!quizCode.trim()) return;

    // Try to find quiz by id or code
    const quiz = quizzes.find(
      (q) =>
        q.id?.toString().toUpperCase() === quizCode.toUpperCase() ||
        q.code?.toUpperCase() === quizCode.toUpperCase()
    );

    if (quiz) {
      onNavigate('participate', { quizId: quiz.id });
    } else {
      alert('Quiz not found!');
    }
  };

  return (
    <div className="container py-8">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '24px' }}>🧠</span>
          <span className="font-bold text-lg">QuizMaster Pro</span>
        </div>
        
        {/* User Menu or Login/Signup */}
        {isAuthenticated ? (
          <div className="user-menu">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {currentUser?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="font-medium">{currentUser?.firstName || 'User'}</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-item">
                  <span>👤</span>
                  <div>
                    <div className="font-medium">{currentUser?.firstName} {currentUser?.lastName}</div>
                    <div className="text-xs text-muted">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item" onClick={() => onNavigate('settings')}>
                  <span>⚙️</span>
                  Settings
                </button>
                <button className="user-dropdown-item" onClick={() => onNavigate('help')}>
                  <span>❓</span>
                  Help & Support
                </button>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item" onClick={onLogout}>
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button 
              className="btn btn-outline px-6"
              onClick={onShowLogin}
            >
              Login
            </button>
            <button 
              className="btn btn-primary px-6"
              onClick={onShowSignup}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-primary">
            {isAuthenticated ? `Welcome back, ${currentUser?.firstName}!` : 'Welcome to QuizMaster Pro!'}
          </h1>
        </div>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Create, share, and participate in interactive quizzes with real-time features, 
          confidence scoring, and adaptive difficulty.
          {!isAuthenticated && (
            <span className="block mt-2 font-medium">
              Login or sign up to create your own quizzes!
            </span>
          )}
        </p>
      </div>

      {/* Quick Join Section */}
      <div className="card mb-8 bg-gradient border-primary">
        <div className="card-header text-center">
          <h2 className="card-title flex items-center justify-center gap-2">
            <span style={{ fontSize: '20px' }}>⚡</span>
            Quick Join Quiz
          </h2>
          <p className="card-description">
            Enter a quiz code to jump straight into the action
          </p>
        </div>
        <div className="card-content">
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              className="input text-center text-lg"
              style={{ letterSpacing: '0.1em' }}
              placeholder="Enter quiz code (e.g., ABC123)"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button onClick={handleJoinQuiz} className="btn btn-primary px-8">
              <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div 
          className="card hover-shadow transition cursor-pointer group" 
          onClick={() => onNavigate('create')}
        >
          <div className="card-header text-center">
            <div className="mx-auto mb-2 p-3 bg-primary-light rounded-full w-fit group-hover-bg transition">
              <span style={{ fontSize: '32px' }}>➕</span>
            </div>
            <h3 className="card-title">Create Quiz</h3>
            <p className="card-description">
              Build engaging quizzes with multiple question types, hints, and custom themes
            </p>
          </div>
        </div>

        <div 
          className="card hover-shadow transition cursor-pointer group" 
          onClick={() => onNavigate('ai-create')}
        >
          <div className="card-header text-center">
            <div className="mx-auto mb-2 p-3 bg-primary-light rounded-full w-fit group-hover-bg transition">
              <span style={{ fontSize: '32px' }}>🤖</span>
            </div>
            <h3 className="card-title">AI Quiz Generator</h3>
            <p className="card-description">
              Generate quizzes automatically using AI - just describe your topic
            </p>
          </div>
        </div>

        <div 
          className="card hover-shadow transition cursor-pointer group" 
          onClick={() => {
            if (quizzes.length > 0) {
              onNavigate('participate', { quizId: quizzes[0].id });
            } else {
              alert("No quizzes available yet!");
            }
          }}
        >
          <div className="card-header text-center">
            <div className="mx-auto mb-2 p-3 bg-primary-light rounded-full w-fit group-hover-bg transition">
              <span style={{ fontSize: '32px' }}>▶️</span>
            </div>
            <h3 className="card-title">Join Quiz</h3>
            <p className="card-description">
              Participate in live quizzes with confidence scoring and real-time leaderboards
            </p>
          </div>
        </div>

        <div 
          className="card hover-shadow transition cursor-pointer group" 
          onClick={() => onNavigate('reports')}
        >
          <div className="card-header text-center">
            <div className="mx-auto mb-2 p-3 bg-primary-light rounded-full w-fit group-hover-bg transition">
              <span style={{ fontSize: '32px' }}>📊</span>
            </div>
            <h3 className="card-title">View Reports</h3>
            <p className="card-description">
              Analyze performance with detailed score breakdowns and export options
            </p>
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span style={{ fontSize: '24px' }}>🎯</span>
            Available Quizzes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.slice(0, 6).map((quiz) => (
              <div key={quiz.id} className="card hover-shadow transition">
                <div className="card-header">
                  <h3 className="card-title line-clamp-1">{quiz.title}</h3>
                  <p className="card-description line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
                <div className="card-content">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(quiz.tags || []).slice(0, 3).map((tag, index) => (
                      <span key={index} className="badge badge-secondary text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted">
                    <span>{quiz.questions ? quiz.questions.length : 0} questions</span>
                    <span>ID: {quiz.id}</span>
                  </div>
                  {/* ✅ Start Quiz Button */}
                  <button 
                    className="btn btn-outline w-full mt-3"
                    onClick={() => onNavigate('participate', { quizId: quiz.id })}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Highlight */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-6">Unique Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl mb-2">⭐</div>
            <div className="font-medium">Confidence Points</div>
            <div className="text-muted">Bet on your answers for bonus scoring</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-medium">Smart Hints</div>
            <div className="text-muted">Get help when you need it</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Adaptive Difficulty</div>
            <div className="text-muted">Questions adjust to your skill level</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-medium">Custom Themes</div>
            <div className="text-muted">Personalize your quiz experience</div>
          </div>
        </div>
      </div>
    </div>
  );
}
