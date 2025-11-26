import React, { useState } from 'react';

export function LoginPage({ onLogin, onNavigate, isModal = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

   try {
  const res = await fetch('http://localhost:8084/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Login failed');
  }

  const data = await res.json(); // or .text() if backend sends plain string
  onLogin({ email, username: data.username || email.split('@')[0] });
} catch (err) {
  setError(err.message);
} finally {
  setIsLoading(false);
}
  }

  return (
    <div className={`${isModal ? 'modal-auth' : 'auth-container'}`}>
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className={`text-center mb-8 ${isModal ? 'modal-auth-header' : ''}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span style={{ fontSize: '48px' }}>🧠</span>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isModal ? 'text-gray-800' : 'text-white'}`}>
            {isModal ? 'Login' : 'QuizMaster Pro'}
          </h1>
          <p className={`opacity-90 ${isModal ? 'text-gray-600' : 'text-white'}`}>
            Sign in to create and manage your quizzes
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-center">Welcome Back</h2>
            <p className="card-description text-center">
              Enter your credentials to access your account
            </p>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fecaca', color: '#991b1b', border: '1px solid #fca5a5' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div className="card-content pt-0">
            <div className="text-center">
              <div className="separator mb-4"></div>
              <p className="text-sm text-muted mb-4">
                Don't have an account?
              </p>
              <button
                onClick={() => onNavigate()}
                className="btn btn-outline w-full"
                disabled={isLoading}
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>

        {!isModal && (
          <>
            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg text-center text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
              <p className="mb-2">🔍 <strong>Demo Credentials</strong></p>
              <p>Email: demo@example.com</p>
              <p>Password: Any password will work</p>
            </div>

            {/* Features Preview */}
            <div className="mt-8 text-center">
              <div className="grid grid-cols-2 gap-4 text-white text-sm">
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>Confidence Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>Smart Hints</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>Live Leaderboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📊</span>
                  <span>Detailed Analytics</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}