import React, { useState } from 'react';
import { QuestionBuilder } from './QuestionBuilder.jsx';
import { UserMenu } from './UserMenu.jsx';
import { AIQuizGenerator } from './AIQuizGenerator.jsx';

export function QuizCreation({ onSave, onNavigate, onPreview, onLogout, currentUser, initialMode = 'manual' }) {
  const [mode, setMode] = useState(initialMode);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [questions, setQuestions] = useState([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: '#030213',
    backgroundColor: '#ffffff',
    fontStyle: 'modern'
  });
  const [activeTab, setActiveTab] = useState('basic');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      hint: '',
      difficulty: 'medium',
      timeLimit: 30
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const generateQuizCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

const handleSave = async () => {
  if (!title.trim() || questions.length === 0) {
    alert('Please provide a title and at least one question to save the quiz.');
    return;
  }

  // ✅ Transform frontend structure into backend-compatible format
  const formattedQuiz = {
    title: title.trim(),
    description: description.trim(),
    questions: questions.map((q) => ({
      text: q.question,  // backend expects "text"
      options: q.options.map((opt, idx) => ({
        text: opt,
        correct: idx === q.correctAnswer // backend expects boolean
      }))
    }))
  };

  try {
    const res = await fetch("http://localhost:8084/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedQuiz), // ✅ send transformed object
    });

    if (!res.ok) throw new Error("Failed to save quiz");

    const savedQuiz = await res.json();
    onSave(savedQuiz);
    onNavigate("home");
  } catch (err) {
    console.error("Error saving quiz:", err);
    alert("Error saving quiz: " + err.message);
  }
};



  const handlePreview = () => {
    if (!title.trim() || questions.length === 0) {
      alert('Please provide a title and at least one question to preview.');
      return;
    }

    const quiz = {
      id: 'PREVIEW',
      title: title.trim(),
      description: description.trim(),
      tags,
      questions: questions.filter(q => q.question.trim()),
      randomizeQuestions,
      theme,
      createdAt: new Date()
    };

    onPreview(quiz);
  };

  const handleAIQuizGenerated = (generatedQuiz) => {
    setTitle(generatedQuiz.title || '');
    setDescription(generatedQuiz.description || '');
    setTags(generatedQuiz.tags || []);
    setQuestions(generatedQuiz.questions || []);
    if (generatedQuiz.theme) {
      setTheme(generatedQuiz.theme);
    }
    setMode('manual'); // Switch to manual mode for editing
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
  };

  // If in AI mode, show the AI Quiz Generator
  if (mode === 'ai') {
    return (
      <div className="container py-8 max-w-6xl">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '24px' }}>🧠</span>
            <span className="font-bold text-lg">QuizMaster Pro</span>
          </div>
          <UserMenu user={currentUser} onLogout={onLogout} />
        </div>

        <AIQuizGenerator 
          onQuizGenerated={handleAIQuizGenerated}
          onCancel={() => setMode('manual')}
        />
      </div>
    );
  }

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
          onClick={() => onNavigate('home')} 
          className="btn btn-outline gap-2"
        >
          <span>←</span>
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
          <p className="text-muted">Build an engaging quiz with custom features</p>
        </div>
        <button 
          onClick={() => setMode('ai')} 
          className="btn btn-secondary gap-2"
          title="Switch to AI Quiz Generator"
        >
          <span>🤖</span>
          Generate with AI
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tabs-list">
          <button 
            className={`tabs-trigger ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`tabs-trigger ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
          <button 
            className={`tabs-trigger ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button 
            className={`tabs-trigger ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quiz Information</h2>
                <p className="card-description">
                  Set up the basic details for your quiz
                </p>
              </div>
              <div className="card-content space-y-6">
                <div>
                  <label className="label" htmlFor="title">
                    Quiz Title *
                  </label>
                  <input
                    id="title"
                    className="input"
                    placeholder="Enter an engaging quiz title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="textarea"
                    placeholder="Describe what this quiz covers"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="input"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button onClick={addTag} className="btn btn-outline">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="badge badge-secondary gap-2">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="tabs-content space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              <button onClick={addQuestion} className="btn btn-primary gap-2">
                <span>+</span>
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="card">
                <div className="card-content text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="font-semibold mb-2">No questions yet</h3>
                  <p className="text-muted mb-4">
                    Start building your quiz by adding your first question
                  </p>
                  <button onClick={addQuestion} className="btn btn-primary">
                    Add First Question
                  </button>
                </div>
              </div>
            ) : (
              questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                  onRemove={() => removeQuestion(index)}
                />
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quiz Settings</h2>
                <p className="card-description">
                  Configure how your quiz behaves
                </p>
              </div>
              <div className="card-content space-y-6">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Randomize Questions</h3>
                    <p className="setting-description">
                      Present questions in a random order for each participant
                    </p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={randomizeQuestions}
                      onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Adaptive Difficulty</h3>
                    <p className="setting-description">
                      Adjust question difficulty based on participant performance
                    </p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Show Leaderboard</h3>
                    <p className="setting-description">
                      Display real-time rankings during the quiz
                    </p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Allow Hints</h3>
                    <p className="setting-description">
                      Let participants use hints with point penalties
                    </p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Custom Theme</h2>
                <p className="card-description">
                  Personalize the look and feel of your quiz
                </p>
              </div>
              <div className="card-content space-y-6">
                <div>
                  <label className="label">Primary Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                      className="w-12 h-12 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                      className="input font-mono"
                      placeholder="#030213"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Background Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                      className="w-12 h-12 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({...theme, backgroundColor: e.target.value})}
                      className="input font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Font Style</label>
                  <select
                    value={theme.fontStyle}
                    onChange={(e) => setTheme({...theme, fontStyle: e.target.value})}
                    className="select"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="playful">Playful</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div className="p-4 border rounded-lg" style={{
                  backgroundColor: theme.backgroundColor,
                  color: theme.primaryColor,
                  fontFamily: theme.fontStyle === 'modern' ? 'system-ui' : 
                             theme.fontStyle === 'classic' ? 'serif' :
                             theme.fontStyle === 'playful' ? 'comic-sans-ms' : 'sans-serif'
                }}>
                  <h3 className="font-semibold mb-2">Theme Preview</h3>
                  <p>This is how your quiz will look with the selected theme.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('home')} 
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={handlePreview}
            className="btn btn-secondary"
            disabled={!title.trim() || questions.length === 0}
          >
            Preview Quiz
          </button>
        </div>
        <button 
          onClick={handleSave}
          className="btn btn-primary btn-lg"
          disabled={!title.trim() || questions.length === 0}
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}