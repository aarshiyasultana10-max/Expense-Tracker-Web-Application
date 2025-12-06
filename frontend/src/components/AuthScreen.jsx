import React, { useState } from 'react';
import { login, registerUser } from '../api';

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        onLogin(user);
      } else {
        const user = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        onLogin(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Expense Tracker</h1>
      <p className="muted">Login or register to manage your expenses.</p>

      <div className="auth-toggle">
        <button
          className={mode === 'login' ? 'active' : ''}
          type="button"
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          type="button"
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required={mode === 'register'}
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register & Login'}
        </button>

        <p className="muted small">
          Demo user: <strong>demo@example.com</strong> / <strong>password</strong>
        </p>
      </form>
    </div>
  );
}

export default AuthScreen;
