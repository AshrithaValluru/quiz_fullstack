import React, { useState } from 'react';

export function HelpSupportPage({ onNavigate, onLogout, currentUser, isAuthenticated }) {
  const [activeTab, setActiveTab] = useState('faq');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: currentUser?.firstName + ' ' + currentUser?.lastName || '',
    email: currentUser?.email || '',
    issue: '',
    description: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'feature',
    title: '',
    description: '',
    rating: 5
  });

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my first quiz?',
          answer: 'To create a quiz, click on the "Create Quiz" button from the home page. Fill in the quiz details like title and description, then start adding questions. You can choose from multiple choice, true/false, or open-ended questions.'
        },
        {
          question: 'How do I join a quiz with a code?',
          answer: 'Enter the 6-character quiz code in the "Quick Join" section on the home page, or navigate to "Join Quiz" and enter the code there. Make sure the code is correct and the quiz is currently active.'
        },
        {
          question: 'Do I need an account to participate in quizzes?',
          answer: 'No, you can participate in quizzes without creating an account. However, creating an account allows you to create your own quizzes, view detailed reports, and track your progress over time.'
        }
      ]
    },
    {
      category: 'Quiz Features',
      questions: [
        {
          question: 'How does confidence scoring work?',
          answer: 'Confidence scoring allows you to bet points on how confident you are in your answer. Choose a confidence level from 1-5 stars. If you\'re correct, you gain points based on your confidence. If wrong, you lose points. Higher confidence = higher risk and reward.'
        },
        {
          question: 'What are hints and how do they work?',
          answer: 'Hints are clues that can help you answer questions. Using a hint will reduce your maximum possible score for that question. Hints are optional and can be enabled/disabled by the quiz creator.'
        },
        {
          question: 'How does adaptive difficulty work?',
          answer: 'Adaptive difficulty adjusts the questions based on your performance. If you\'re answering correctly, you\'ll get harder questions worth more points. If you\'re struggling, you\'ll get easier questions to help build confidence.'
        },
        {
          question: 'Can I randomize questions and answers?',
          answer: 'Yes! Quiz creators can enable question randomization (different order for each participant) and answer randomization (shuffled answer choices for multiple choice questions). This helps prevent cheating and makes each attempt unique.'
        }
      ]
    },
    {
      category: 'Reports & Analytics',
      questions: [
        {
          question: 'How do I view quiz results?',
          answer: 'Go to the Reports section to view detailed analytics for your quizzes. You can see participant scores, question-by-question breakdowns, difficulty analysis, and export data to CSV or PDF.'
        },
        {
          question: 'What analytics are available?',
          answer: 'You can view completion rates, average scores, time spent per question, confidence levels, hint usage, and difficulty progression. Premium users get additional insights like participant demographics and advanced filtering.'
        },
        {
          question: 'Can I export quiz data?',
          answer: 'Yes, you can export quiz results as CSV files for further analysis, or generate PDF reports for sharing. This feature is available for all users.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          question: 'Quiz not loading properly?',
          answer: 'Try refreshing the page first. If the issue persists, check your internet connection and try clearing your browser cache. Make sure you\'re using a supported browser (Chrome, Firefox, Safari, Edge).'
        },
        {
          question: 'Didn\'t receive verification email?',
          answer: 'Check your spam/junk folder first. If still not found, try requesting a new verification email from your account settings. Make sure the email address is correct.'
        },
        {
          question: 'Quiz code not working?',
          answer: 'Double-check that you\'ve entered the code correctly (it\'s case-sensitive). The quiz might have ended or been deactivated. Contact the quiz creator if you continue having issues.'
        },
        {
          question: 'Performance issues or slow loading?',
          answer: 'Close other browser tabs and applications to free up memory. Check your internet speed - quizzes work best with a stable connection. Try using an incognito/private browser window.'
        }
      ]
    }
  ];

  const guides = [
    {
      title: 'Creating Your First Quiz',
      description: 'Step-by-step guide to building engaging quizzes',
      steps: [
        'Click "Create Quiz" from the dashboard',
        'Add quiz title, description, and tags',
        'Choose your quiz settings (timer, hints, etc.)',
        'Add questions using the question builder',
        'Preview your quiz before publishing',
        'Share the quiz code with participants'
      ],
      icon: '📝'
    },
    {
      title: 'Using Confidence Scoring',
      description: 'Maximize your points with strategic confidence betting',
      steps: [
        'Read the question carefully',
        'Choose your answer',
        'Select confidence level (1-5 stars)',
        'Higher confidence = more points if correct',
        'Lower confidence = safer but fewer points',
        'Build confidence gradually over time'
      ],
      icon: '⭐'
    },
    {
      title: 'Analyzing Quiz Results',
      description: 'Make the most of your quiz analytics',
      steps: [
        'Navigate to the Reports section',
        'Select the quiz you want to analyze',
        'Review overall performance metrics',
        'Check question-by-question breakdown',
        'Identify difficult questions for improvement',
        'Export data for further analysis'
      ],
      icon: '📊'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Support request submitted! We\'ll get back to you within 24 hours.');
    setContactForm({
      name: currentUser?.firstName + ' ' + currentUser?.lastName || '',
      email: currentUser?.email || '',
      issue: '',
      description: ''
    });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackForm({
      type: 'feature',
      title: '',
      description: '',
      rating: 5
    });
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'faq':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              
              <div className="mb-6">
                <input
                  type="text"
                  className="input"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-6">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="font-medium text-primary mb-3">{category.category}</h4>
                    <div className="space-y-3">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border rounded-lg">
                          <details className="group">
                            <summary className="p-4 cursor-pointer hover-bg-muted transition">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{faq.question}</span>
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                              </div>
                            </summary>
                            <div className="px-4 pb-4 text-muted">
                              {faq.answer}
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-muted">
                    <div className="text-4xl mb-2">🔍</div>
                    <div>No FAQs found matching "{searchQuery}"</div>
                    <div className="text-sm">Try a different search term or contact support</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'guides':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Guides & Tutorials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <div key={index} className="card hover-shadow transition">
                    <div className="card-header text-center">
                      <div className="text-4xl mb-2">{guide.icon}</div>
                      <h4 className="card-title">{guide.title}</h4>
                      <p className="card-description">{guide.description}</p>
                    </div>
                    <div className="card-content">
                      <div className="space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient rounded-lg text-center">
                <div className="text-3xl mb-3">🎥</div>
                <h4 className="font-semibold mb-2">Video Tutorials</h4>
                <p className="text-muted mb-4">Watch detailed video guides on our YouTube channel</p>
                <button className="btn btn-primary">
                  Watch Tutorials
                </button>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="form-group">
                      <label className="label">Your Name</label>
                      <input
                        type="text"
                        className="input"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Email Address</label>
                      <input
                        type="email"
                        className="input"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Issue Type</label>
                      <select
                        className="select"
                        value={contactForm.issue}
                        onChange={(e) => setContactForm(prev => ({ ...prev, issue: e.target.value }))}
                        required
                      >
                        <option value="">Select an issue type</option>
                        <option value="technical">Technical Problem</option>
                        <option value="account">Account Issue</option>
                        <option value="billing">Billing Question</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Description</label>
                      <textarea
                        className="textarea"
                        rows="5"
                        placeholder="Please describe your issue in detail..."
                        value={contactForm.description}
                        onChange={(e) => setContactForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full">
                      Send Message
                    </button>
                  </form>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📧</span>
                      <div>
                        <div className="font-medium">Email Support</div>
                        <div className="text-sm text-muted">support@quizmaster.com</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted">Response time: 24-48 hours</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💬</span>
                      <div>
                        <div className="font-medium">Live Chat</div>
                        <div className="text-sm text-muted">Available 9AM-5PM EST</div>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Start Chat</button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👥</span>
                      <div>
                        <div className="font-medium">Community Forum</div>
                        <div className="text-sm text-muted">Get help from other users</div>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Visit Forum</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Feedback & Feature Requests</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="form-group">
                      <label className="label">Feedback Type</label>
                      <select
                        className="select"
                        value={feedbackForm.type}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="improvement">Improvement Suggestion</option>
                        <option value="general">General Feedback</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Title</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Brief description of your feedback"
                        value={feedbackForm.title}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Detailed Description</label>
                      <textarea
                        className="textarea"
                        rows="5"
                        placeholder="Please provide detailed feedback..."
                        value={feedbackForm.description}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label className="label">Overall Experience Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={`text-2xl ${rating <= feedbackForm.rating ? 'text-yellow' : 'text-muted'}`}
                            onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                          >
                            ⭐
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted">
                          {feedbackForm.rating}/5 stars
                        </span>
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full">
                      Submit Feedback
                    </button>
                  </form>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient rounded-lg">
                    <h4 className="font-medium mb-2">💡 Popular Feature Requests</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>• Mobile app</span>
                        <span className="badge badge-secondary">127 votes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Question banks</span>
                        <span className="badge badge-secondary">94 votes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Team collaboration</span>
                        <span className="badge badge-secondary">78 votes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Advanced theming</span>
                        <span className="badge badge-secondary">65 votes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🚀 Recently Released</h4>
                    <div className="space-y-2 text-sm text-muted">
                      <div>• Confidence scoring system</div>
                      <div>• Adaptive difficulty</div>
                      <div>• Export to PDF</div>
                      <div>• Custom quiz themes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">All Systems Operational</h4>
                    <span className="badge badge-green">✓ Operational</span>
                  </div>
                  <p className="text-sm text-muted">All services are running normally</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green rounded-full"></span>
                      <span>Quiz Creation Service</span>
                    </div>
                    <span className="text-sm text-muted">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green rounded-full"></span>
                      <span>Quiz Participation</span>
                    </div>
                    <span className="text-sm text-muted">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green rounded-full"></span>
                      <span>Analytics & Reports</span>
                    </div>
                    <span className="text-sm text-muted">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green rounded-full"></span>
                      <span>User Authentication</span>
                    </div>
                    <span className="text-sm text-muted">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-yellow rounded-full"></span>
                      <span>Email Notifications</span>
                    </div>
                    <span className="text-sm text-muted">Performance Issues</span>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Recent Incidents</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolved: Slow quiz loading times</span>
                      <span className="text-muted">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolved: Email delivery delays</span>
                      <span className="text-muted">1 day ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button className="btn btn-outline">
                    View Detailed Status Page
                  </button>
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
            {isAuthenticated && (
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
                    <button className="user-dropdown-item" onClick={() => onNavigate('settings')}>
                      <span>⚙️</span>
                      Settings
                    </button>
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item" onClick={onLogout}>
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted">Get help, find answers, and connect with our support team</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="card-content p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'faq' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>❓</span>
                        <span>FAQs</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('guides')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'guides' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>📚</span>
                        <span>Guides</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'contact' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>📞</span>
                        <span>Contact</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('feedback')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'feedback' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>💡</span>
                        <span>Feedback</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('status')}
                      className={`w-full text-left px-4 py-3 hover-bg-muted transition ${
                        activeTab === 'status' ? 'bg-primary-light border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>🟢</span>
                        <span>Status</span>
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