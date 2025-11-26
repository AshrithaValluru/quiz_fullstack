import React, { useState } from 'react';
import { UserMenu } from './UserMenu.jsx';

export function ReportsPage({ quizzes, attempts, onNavigate, onLogout, currentUser }) {
  const [selectedQuiz, setSelectedQuiz] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [filterDays, setFilterDays] = useState(30);

  // New: state for modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const getFilteredAttempts = () => {
    let filtered = attempts;

    if (selectedQuiz !== 'all') {
      filtered = filtered.filter(attempt => attempt.quizId === selectedQuiz);
    }

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - filterDays);
    filtered = filtered.filter(attempt => new Date(attempt.completedAt) >= dateThreshold);

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.totalScore - a.totalScore;
        case 'date':
          return new Date(b.completedAt) - new Date(a.completedAt);
        case 'participant':
          return a.participantName.localeCompare(b.participantName);
        default:
          return 0;
      }
    });
  };

  const getQuizAnalytics = () => {
    const filtered = getFilteredAttempts();
    const analytics = {};

    quizzes.forEach(quiz => {
      const quizAttempts = filtered.filter(attempt => attempt.quizId === quiz.id);

      if (quizAttempts.length > 0) {
        const scores = quizAttempts.map(attempt => attempt.totalScore);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);

        const fullyCompleted = quizAttempts.filter(
          attempt => attempt.answers.length === quiz.questions.length
        ).length;

        analytics[quiz.id] = {
          quiz,
          attempts: quizAttempts.length,
          averageScore: Math.round(averageScore),
          highestScore,
          lowestScore,
          completionRate: ((fullyCompleted / quizAttempts.length) * 100).toFixed(1)
        };
      }
    });

    return analytics;
  };

  const getOverallStats = () => {
    const filtered = getFilteredAttempts();

    if (filtered.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        topPerformer: 'N/A',
        topScore: 'N/A',
        mostPopularQuiz: 'N/A'
      };
    }

    const totalScore = filtered.reduce((sum, attempt) => sum + attempt.totalScore, 0);
    const averageScore = Math.round(totalScore / filtered.length);

    const topPerformer = filtered.reduce((top, attempt) =>
      attempt.totalScore > top.totalScore ? attempt : top
    );

    const quizPopularity = {};
    filtered.forEach(attempt => {
      quizPopularity[attempt.quizId] = (quizPopularity[attempt.quizId] || 0) + 1;
    });

    const mostPopularQuizId = Object.keys(quizPopularity).reduce((a, b) =>
      quizPopularity[a] > quizPopularity[b] ? a : b
    );

    const mostPopularQuiz = quizzes.find(quiz => quiz.id === mostPopularQuizId);

    return {
      totalAttempts: filtered.length,
      averageScore,
      topPerformer: topPerformer.participantName,
      topScore: topPerformer.totalScore,
      mostPopularQuiz: mostPopularQuiz?.title || 'N/A'
    };
  };

  const exportData = () => {
    const filtered = getFilteredAttempts();
    const csvContent = [
      ['Participant', 'Quiz', 'Score', 'Completed At', 'Questions Answered'].join(','),
      ...filtered.map(attempt => [
        attempt.participantName,
        quizzes.find(q => q.id === attempt.quizId)?.title || attempt.quizId,
        attempt.totalScore,
        new Date(attempt.completedAt).toLocaleString(),
        attempt.answers.length
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getOverallStats();
  const analytics = getQuizAnalytics();
  const filteredAttempts = getFilteredAttempts();

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

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="btn btn-outline gap-2"
        >
          <span>←</span>
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted">Analyze quiz performance and participant insights</p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold mb-2">No data available</h3>
            <p className="text-muted mb-4">
              Complete some quizzes to see detailed analytics and reports here.
            </p>
            <button
              onClick={() => onNavigate('participate')}
              className="btn btn-primary"
            >
              Take a Quiz
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="card-title">Filters</h2>
            </div>
            <div className="card-content">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Quiz</label>
                  <select
                    className="select"
                    value={selectedQuiz}
                    onChange={(e) => setSelectedQuiz(e.target.value)}
                  >
                    <option value="all">All Quizzes</option>
                    {quizzes.map(quiz => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Sort By</label>
                  <select
                    className="select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="score">Highest Score</option>
                    <option value="date">Most Recent</option>
                    <option value="participant">Participant Name</option>
                  </select>
                </div>

                <div>
                  <label className="label">Time Period</label>
                  <select
                    className="select"
                    value={filterDays}
                    onChange={(e) => setFilterDays(parseInt(e.target.value))}
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 3 months</option>
                    <option value={365}>Last year</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button onClick={exportData} className="btn btn-outline w-full">
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="card-content">
                <div className="text-2xl font-bold text-primary">{stats.totalAttempts}</div>
                <div className="text-sm text-muted">Total Attempts</div>
              </div>
            </div>

            <div className="card text-center">
              <div className="card-content">
                <div className="text-2xl font-bold text-secondary">{stats.averageScore}</div>
                <div className="text-sm text-muted">Average Score</div>
              </div>
            </div>

            <div className="card text-center">
              <div className="card-content">
                <div className="text-2xl font-bold text-accent">{stats.topScore || 'N/A'}</div>
                <div className="text-sm text-muted">Highest Score</div>
                {stats.topPerformer !== 'N/A' && (
                  <div className="text-xs text-muted mt-1">{stats.topPerformer}</div>
                )}
              </div>
            </div>

            <div className="card text-center">
              <div className="card-content">
                <div className="text-lg font-bold text-muted line-clamp-2">{stats.mostPopularQuiz}</div>
                <div className="text-sm text-muted">Most Popular Quiz</div>
              </div>
            </div>
          </div>

          {/* Quiz Analytics */}
          {Object.keys(analytics).length > 0 && (
            <div className="card mb-8">
              <div className="card-header">
                <h2 className="card-title">Quiz Performance</h2>
                <p className="card-description">Detailed analytics for each quiz</p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {Object.values(analytics).map((data) => (
                    <div key={data.quiz.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{data.quiz.title}</h3>
                        <span className="badge badge-secondary">{data.attempts} attempts</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-muted">Average Score</div>
                          <div className="font-medium">{data.averageScore}</div>
                        </div>
                        <div>
                          <div className="text-muted">Highest Score</div>
                          <div className="font-medium">{data.highestScore}</div>
                        </div>
                        <div>
                          <div className="text-muted">Lowest Score</div>
                          <div className="font-medium">{data.lowestScore}</div>
                        </div>
                        <div>
                          <div className="text-muted">Questions</div>
                          <div className="font-medium">{data.quiz.questions.length}</div>
                        </div>
                        <div>
                          <div className="text-muted">Completion Rate</div>
                          <div className="font-medium">{data.completionRate}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Attempts */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Attempts</h2>
              <p className="card-description">{filteredAttempts.length} results found</p>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Participant</th>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Completed</th>
                      <th>Questions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttempts.slice(0, 50).map(attempt => {
                      const quiz = quizzes.find(q => q.id === attempt.quizId);

                      const correctAnswers = attempt.answers.filter((answer, index) => {
                        const question = quiz?.questions[index];
                        if (!question) return false;

                        if (question.type === 'multiple-choice' || question.type === 'true-false') {
                          return answer.answer === question.correctAnswer;
                        }
                        return answer.isCorrect === true;
                      }).length;

                      return (
                        <tr key={attempt.id}>
                          <td className="font-medium">{attempt.participantName}</td>
                          <td>{quiz?.title || attempt.quizId}</td>
                          <td>
                            <span className="font-bold">{attempt.totalScore}</span>
                            <span className="text-muted text-sm ml-1">
                              ({correctAnswers}/{attempt.answers.length})
                            </span>
                          </td>
                          <td className="text-sm">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </td>
                          <td>{attempt.answers.length}</td>
                          <td>
                            <button
                              onClick={() => setSelectedAttempt(attempt)}
                              className="btn btn-outline btn-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setSelectedAttempt(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Attempt Details</h2>
            <p><strong>Participant:</strong> {selectedAttempt.participantName}</p>
            <p>
              <strong>Quiz:</strong>{' '}
              {quizzes.find(q => q.id === selectedAttempt.quizId)?.title || selectedAttempt.quizId}
            </p>
            <p><strong>Date:</strong> {new Date(selectedAttempt.completedAt).toLocaleString()}</p>
            <p><strong>Score:</strong> {selectedAttempt.totalScore}</p>

            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {selectedAttempt.answers.map((answer, idx) => {
                const question = quizzes.find(q => q.id === selectedAttempt.quizId)?.questions[idx];
                const isCorrect =
                  question?.correctAnswer === answer.answer || answer.isCorrect === true;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${
                      isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                    }`}
                  >
                    <p className="font-medium">
                      Q{idx + 1}: {question?.text || 'Unknown question'}
                    </p>
                    <p className="text-sm">
                      <strong>Your Answer:</strong> {answer.answer ?? '—'}
                    </p>
                    {question?.correctAnswer && (
                      <p className="text-sm">
                        <strong>Correct Answer:</strong> {question.correctAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
