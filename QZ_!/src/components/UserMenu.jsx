import React, { useState } from 'react';

export function UserMenu({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <div className="user-menu">
      <button 
        className="user-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="user-avatar">
          {user.firstName?.charAt(0) || 'U'}
        </div>
        <span className="font-medium">{user.firstName || 'User'}</span>
        <span style={{ fontSize: '12px' }}>▼</span>
      </button>
      
      {showMenu && (
        <div className="user-dropdown">
          <div className="user-dropdown-item">
            <span>👤</span>
            <div>
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-muted">{user.email}</div>
            </div>
          </div>
          <div className="user-dropdown-divider"></div>
          <button className="user-dropdown-item">
            <span>⚙️</span>
            Settings
          </button>
          <button className="user-dropdown-item">
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
  );
}