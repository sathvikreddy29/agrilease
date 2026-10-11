import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else if (user.role === 'ROLE_LANDOWNER') {
        navigate('/landowner-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing demo accounts
  const fillDemo = (email, pass) => {
    setFormData({ email, password: pass });
    setError('');
  };

  return (
    <div className="container page-container" style={{ maxWidth: '480px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌱</div>
          <h2 className="page-title" style={{ fontSize: '24px' }}>Welcome Back</h2>
          <p className="page-subtitle">Sign in to your AgriLease account</p>
        </div>

        {location.search.includes('expired=true') && (
          <AlertMessage type="error" message="Your session has expired. Please log in again." />
        )}

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. farmer@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
            ⚡ Quick Demo Accounts:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('ramesh.patel@gmail.com', 'Ramesh@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px' }}
            >
              Landowner (Ramesh)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('kavitha.farmer@gmail.com', 'Farmer@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px' }}
            >
              Farmer (Kavitha)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@agrilease.com', 'Admin@123')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px' }}
            >
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary)' }}>
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

