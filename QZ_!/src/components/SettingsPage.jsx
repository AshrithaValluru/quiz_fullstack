import React, { useState } from 'react';

export function SettingsPage({ onNavigate, onLogout, currentUser, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true
  });
  const [quizSettings, setQuizSettings] = useState({
    defaultTimer: 30,
    hintsEnabled: true,
    randomizeQuestions: false,
    randomizeAnswers: true,
    scoringMethod: 'confidence'
  });
  const [privacy, setPrivacy] = useState({
    shareQuizzes: true,
    twoFactorAuth: false
  });

  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Validate passwords if changing
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Update user data
    const updatedUser = {
      ...currentUser,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      username: profileData.username
    };
    
    onUpdateUser(updatedUser);
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. Please contact support to complete this process.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="label">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-muted mt-1">This will be auto-generated from your email if left blank</p>
                </div>
                
                <div className="separator"></div>
                
                <h4 className="font-medium">Change Password</h4>
                <div className="form-group">
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    className="input"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">New Password</label>
                    <input
                      type="password"
                      className="input"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Confirm New Password</label>
                    <input
                      type="password"
                      className="input"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted">Switch between light and dark themes</div>
                  </div>
                  <div 
                    className={`switch ${isDarkMode ? 'checked' : ''}`}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Default Dashboard View</div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="defaultView" className="mr-2" defaultChecked />
                      Create Quiz
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="defaultView" className="mr-2" />
                      Join Quiz
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="defaultView" className="mr-2" />
                      Reports
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Notification Preferences</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email notifications</span>
                      <div 
                        className={`switch ${notifications.email ? 'checked' : ''}`}
                        onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                      >
                        <div className="switch-thumb"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push notifications</span>
                      <div 
                        className={`switch ${notifications.push ? 'checked' : ''}`}
                        onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                      >
                        <div className="switch-thumb"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quiz reminders</span>
                      <div 
                        className={`switch ${notifications.reminders ? 'checked' : ''}`}
                        onClick={() => setNotifications(prev => ({ ...prev, reminders: !prev.reminders }))}
                      >
                        <div className="switch-thumb"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Language & Region</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Language</label>
                      <select className="select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Time Zone</label>
                      <select className="select">
                        <option>UTC-8 (Pacific)</option>
                        <option>UTC-5 (Eastern)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (CET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz-settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quiz Defaults</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <label className="label">Default Question Timer (seconds)</label>
                  <input
                    type="number"
                    className="input"
                    value={quizSettings.defaultTimer}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, defaultTimer: parseInt(e.target.value) }))}
                    min="10"
                    max="300"
                  />
                  <p className="text-xs text-muted mt-1">Time limit per question (10-300 seconds)</p>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Hints by Default</div>
                    <div className="text-sm text-muted">Allow quiz takers to use hints</div>
                  </div>
                  <div 
                    className={`switch ${quizSettings.hintsEnabled ? 'checked' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, hintsEnabled: !prev.hintsEnabled }))}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Randomize Questions</div>
                    <div className="text-sm text-muted">Shuffle question order for each attempt</div>
                  </div>
                  <div 
                    className={`switch ${quizSettings.randomizeQuestions ? 'checked' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, randomizeQuestions: !prev.randomizeQuestions }))}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Randomize Answer Options</div>
                    <div className="text-sm text-muted">Shuffle answer choices for multiple choice questions</div>
                  </div>
                  <div 
                    className={`switch ${quizSettings.randomizeAnswers ? 'checked' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, randomizeAnswers: !prev.randomizeAnswers }))}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Default Scoring Method</div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="scoring" 
                        className="mr-2" 
                        checked={quizSettings.scoringMethod === 'standard'}
                        onChange={() => setQuizSettings(prev => ({ ...prev, scoringMethod: 'standard' }))}
                      />
                      Standard Points (Correct = 1 point, Incorrect = 0 points)
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="scoring" 
                        className="mr-2"
                        checked={quizSettings.scoringMethod === 'confidence'}
                        onChange={() => setQuizSettings(prev => ({ ...prev, scoringMethod: 'confidence' }))}
                      />
                      Confidence Scoring (Points based on confidence level)
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="scoring" 
                        className="mr-2"
                        checked={quizSettings.scoringMethod === 'adaptive'}
                        onChange={() => setQuizSettings(prev => ({ ...prev, scoringMethod: 'adaptive' }))}
                      />
                      Adaptive Scoring (Difficulty-based points)
                    </label>
                  </div>
                </div>
                
                <button className="btn btn-primary">
                  Save Quiz Settings
                </button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Share Created Quizzes</div>
                    <div className="text-sm text-muted">Allow others to discover and use your public quizzes</div>
                  </div>
                  <div 
                    className={`switch ${privacy.shareQuizzes ? 'checked' : ''}`}
                    onClick={() => setPrivacy(prev => ({ ...prev, shareQuizzes: !prev.shareQuizzes }))}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted">Add an extra layer of security to your account</div>
                  </div>
                  <div 
                    className={`switch ${privacy.twoFactorAuth ? 'checked' : ''}`}
                    onClick={() => setPrivacy(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                  >
                    <div className="switch-thumb"></div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Connected Devices</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="font-medium text-sm">💻 Chrome on Windows</div>
                        <div className="text-xs text-muted">Last active: 2 minutes ago • Current session</div>
                      </div>
                      <span className="badge badge-green text-xs">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="font-medium text-sm">📱 iPhone Safari</div>
                        <div className="text-xs text-muted">Last active: 2 days ago</div>
                      </div>
                      <button className="btn btn-sm btn-outline text-xs">Revoke</button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Data Management</div>
                  <div className="space-y-2">
                    <button className="btn btn-outline w-full">
                      📥 Download Account Data
                    </button>
                    <button className="btn btn-outline w-full">
                      📊 View Data Usage Report
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border border-red rounded-lg">
                  <div className="font-medium mb-3 text-destructive">Danger Zone</div>
                  <button 
                    className="btn btn-destructive w-full"
                    onClick={handleDeleteAccount}
                  >
                    🗑️ Delete Account
                  </button>
                  <p className="text-xs text-muted mt-2">This action is permanent and cannot be undone</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscription & Billing</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Free Plan</div>
                      <div className="text-sm text-muted">Current plan</div>
                    </div>
                    <span className="badge badge-secondary">Active</span>
                  </div>
                  <div className="text-sm text-muted mb-3">
                    • Create up to 5 quizzes<br/>
                    • 50 participants per quiz<br/>
                    • Basic analytics<br/>
                    • Standard support
                  </div>
                  <button className="btn btn-primary">Upgrade to Pro</button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Available Plans</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded">
                      <div className="font-medium">Pro Plan</div>
                      <div className="text-2xl font-bold">$9.99<span className="text-sm font-normal">/month</span></div>
                      <div className="text-sm text-muted mt-2">
                        • Unlimited quizzes<br/>
                        • 500 participants per quiz<br/>
                        • Advanced analytics<br/>
                        • Priority support<br/>
                        • Custom themes
                      </div>
                      <button className="btn btn-primary w-full mt-3">Select Plan</button>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Enterprise</div>
                      <div className="text-2xl font-bold">$29.99<span className="text-sm font-normal">/month</span></div>
                      <div className="text-sm text-muted mt-2">
                        • Everything in Pro<br/>
                        • Unlimited participants<br/>
                        • White-label options<br/>
                        • API access<br/>
                        • Dedicated support
                      </div>
                      <button className="btn btn-primary w-full mt-3">Contact Sales</button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-3">Billing History</div>
                  <div className="text-center text-muted py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <div>No billing history yet</div>
                    <div className="text-sm">Upgrade to a paid plan to see invoices here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 hover-bg-muted p-2 rounded transition"
              >
                <span style={{ fontSize: '24px' }}>🧠</span>
                <span className="font-bold text-lg">QuizMaster Pro</span>
              </button>
            </div>
            
            {/* User Menu */}
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
                  <button className="user-dropdown-item" onClick={() => onNavigate('home')}>
                    <span>🏠</span>
                    Home
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
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted">Manage your account preferences and quiz settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="card-content p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'profile' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>👤</span>
                        <span>Profile Settings</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'preferences' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>⚙️</span>
                        <span>Preferences</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz-settings')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'quiz-settings' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>🎯</span>
                        <span>Quiz Settings</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'privacy' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>🔒</span>
                        <span>Privacy & Security</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'billing' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>💳</span>
                        <span>Billing</span>
                      </div>
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card">
                <div className="card-content">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}