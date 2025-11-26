import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage.jsx';
import { QuizCreation } from './components/QuizCreation.jsx';
import { QuizParticipation } from './components/QuizParticipation.jsx';
import { ReportsPage } from './components/ReportsPage.jsx';
import { QuizPreview } from './components/QuizPreview.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { SignupPage } from './components/SignupPage.jsx';
import './styles/quiz-styles.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // ✅ NEW: track selected quizId
  const [selectedQuizId, setSelectedQuizId] = useState(null);


  useEffect(() => {
  fetch("http://localhost:8084/api/attempts")
    .then((res) => res.json())
    .then((data) => setAttempts(data))
    .catch((err) => console.error("Failed to load attempts:", err));
}, []);

useEffect(() => {
  fetch("http://localhost:8084/api/quizzes")
    .then((res) => res.json())
    .then((data) => setQuizzes(data))
    .catch((err) => console.error("Failed to load quizzes:", err));
}, []);


  const addQuiz = (quiz) => {
    setQuizzes(prev => [...prev, quiz]);
  };

 const addAttempt = async (attempt) => {
  try {
    const response = await fetch("http://localhost:8084/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  quizId: attempt.quizId,
  participantName: attempt.participantName,
  totalScore: attempt.totalScore,
  answersJson: JSON.stringify(attempt.answers)
}),

    });

    const saved = await response.json();
    setAttempts((prev) => [...prev, saved]);
  } catch (err) {
    console.error("Failed to save attempt:", err);
  }
};


   // ✅ Updated navigateTo to accept options (e.g. quizId)
  const navigateTo = (page, options = {}) => {
    if ((page === 'create' || page === 'ai-create') && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (options.quizId) {
      setSelectedQuizId(options.quizId);
    }

    setCurrentPage(page);
  };

  const handleLogin = (user) => {
    console.log('handleLogin called with user:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setShowSignupModal(false);
    if (currentPage === 'home') {
      setCurrentPage('create');
    }
  };

  const handleSignup = (user) => {
    console.log('handleSignup called with user:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setShowSignupModal(false);
    if (currentPage === 'home') {
      setCurrentPage('create');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handlePreviewQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentPage('preview');
  };

  const showLogin = () => {
    console.log('showLogin called');
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const showSignup = () => {
    console.log('showSignup called');
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    console.log('closeModals called');
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
      case 'create':
        return isAuthenticated ? (
          <QuizCreation 
            onSave={addQuiz} 
            onNavigate={navigateTo}
            onPreview={handlePreviewQuiz}
            onLogout={handleLogout}
            currentUser={currentUser}
            initialMode="manual"
          />
        ) : (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
      case 'ai-create':
        return isAuthenticated ? (
          <QuizCreation 
            onSave={addQuiz} 
            onNavigate={navigateTo}
            onPreview={handlePreviewQuiz}
            onLogout={handleLogout}
            currentUser={currentUser}
            initialMode="ai"
          />
        ) : (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
            case 'participate':
        return (
          <QuizParticipation 
            quizzes={quizzes}
            quizId={selectedQuizId}   
            onNavigate={navigateTo}
            onComplete={addAttempt}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        );

      case 'reports':
        return isAuthenticated ? (
          <ReportsPage 
            quizzes={quizzes}
            attempts={attempts}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        ) : (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
      case 'preview':
        return currentQuiz ? (
          <QuizPreview 
            quiz={currentQuiz}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        ) : (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
      default:
        return (
          <HomePage 
            onNavigate={navigateTo} 
            onLogout={handleLogout} 
            onShowLogin={showLogin}
            onShowSignup={showSignup}
            currentUser={currentUser} 
            quizzes={quizzes}
            isAuthenticated={isAuthenticated}
          />
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {renderCurrentPage()}
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <LoginPage 
              onLogin={handleLogin} 
              onNavigate={(page) => {
                if (page === 'signup') {
                  showSignup();
                }
              }}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <SignupPage 
              onSignup={handleSignup} 
              onNavigate={(page) => {
                if (page === 'login') {
                  showLogin();
                }
              }}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
