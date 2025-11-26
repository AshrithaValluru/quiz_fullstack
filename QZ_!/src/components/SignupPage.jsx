import React, { useState } from 'react';

export function SignupPage({ onSignup, onNavigate, isModal = false }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-generate username from email
      if (field === 'email') {
        updated.username = value.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      
      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }

    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (!acceptTerms) {
      return 'Please accept the terms and conditions';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
  const res = await fetch('http://localhost:8084/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Signup failed');
  }

  const data = await res.json(); // or .text() depending on backend
  onSignup({ 
    username: formData.username, 
    email: formData.email, 
    firstName: formData.firstName, 
    lastName: formData.lastName 
  });
} catch (err) {
  setError(err.message);
} finally {
  setIsLoading(false);
}

  };

  return (
    <div className={`${isModal ? 'modal-auth py-8' : 'min-h-screen flex items-center justify-center py-8'}`} style={!isModal ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } : {}}>
      <div className="w-full max-w-lg">
        {/* Logo and Header */}
        <div className={`text-center mb-8 ${isModal ? 'modal-auth-header' : ''}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span style={{ fontSize: '48px' }}>🧠</span>
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isModal ? 'text-gray-800' : 'text-white'}`}>
            {isModal ? 'Sign Up' : 'Join QuizMaster Pro'}
          </h1>
          <p className={`opacity-90 ${isModal ? 'text-gray-600' : 'text-white'}`}>
            Create your account and start building amazing quizzes
          </p>
        </div>

        {/* Signup Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-center">Create Your Account</h2>
            <p className="card-description text-center">
              Fill in your details to get started
            </p>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fecaca', color: '#991b1b', border: '1px solid #fca5a5' }}>
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="input"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="input"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="input"
                  placeholder="Auto-generated from email"
                  value={formData.username}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                />
                <p className="text-xs text-muted">
                  Username is automatically generated from your email address
                </p>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="input"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="input"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <label className="text-sm cursor-pointer">
                  I agree to the{' '}
                  <button type="button" className="text-primary hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <div className="card-content pt-0">
            <div className="text-center">
              <div className="separator mb-4"></div>
              <p className="text-sm text-muted mb-4">
                Already have an account?
              </p>
              <button
                onClick={() => onNavigate()}
                className="btn btn-outline w-full"
                disabled={isLoading}
              >
                Sign In Instead
              </button>
            </div>
          </div>
        </div>

        {!isModal && (
          /* Benefits */
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-3 text-white text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <div>
                  <div className="font-medium">Interactive Quiz Creation</div>
                  <div className="opacity-90">Build engaging quizzes with multiple question types</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <div>
                  <div className="font-medium">Advanced Analytics</div>
                  <div className="opacity-90">Track performance with detailed reports and insights</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '20px' }}>🏆</span>
                <div>
                  <div className="font-medium">Real-time Competition</div>
                  <div className="opacity-90">Live leaderboards and confidence scoring</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}