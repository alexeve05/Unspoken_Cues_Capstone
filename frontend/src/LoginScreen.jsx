import React, { useState } from 'react';
import { loginStaff } from './authService';
import './LoginScreen.css';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await loginStaff(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Unable to log in');
    } finally {
      setSubmitting(false);
    }
  };

  const quickFill = (roleUsername) => {
    setUsername(roleUsername);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="frame-badge">Frame: Opening / Log In</span>
          <h1 className="login-title">Unspoken Cues</h1>
          <p className="login-subtitle">Resort / Event Staff Management Portal</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or staff"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Verifying...' : 'Log In'}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-credentials-title">Quick Demo Credentials:</div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="demo-fill-btn"
              onClick={() => quickFill('admin')}
            >
              Fill Admin (All Tabs)
            </button>
            <button
              type="button"
              className="demo-fill-btn"
              onClick={() => quickFill('staff')}
            >
              Fill Staff (Limited)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
