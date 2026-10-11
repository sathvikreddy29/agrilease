import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_FARMER',
    address: '',
    state: '',
    district: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'LANDOWNER') {
      setFormData(prev => ({ ...prev, role: 'ROLE_LANDOWNER' }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register(formData);
      if (user.role === 'ROLE_LANDOWNER') {
        navigate('/landowner-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '640px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌱</div>
          <h2 className="page-title" style={{ fontSize: '24px' }}>Create Your Account</h2>
          <p className="page-subtitle">Join the agricultural land lease ecosystem</p>
        </div>

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        {/* Role Toggle Switch */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">Select Your Role</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_FARMER' })}
              style={{
                padding: '14px',
                border: formData.role === 'ROLE_FARMER' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: formData.role === 'ROLE_FARMER' ? 'var(--primary-pale)' : '#ffffff',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: formData.role === 'ROLE_FARMER' ? '700' : '500',
                color: formData.role === 'ROLE_FARMER' ? 'var(--primary-dark)' : 'var(--text-body)'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌾</div>
              <div>Farmer / Cultivator</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>I want to rent land</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_LANDOWNER' })}
              style={{
                padding: '14px',
                border: formData.role === 'ROLE_LANDOWNER' ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: formData.role === 'ROLE_LANDOWNER' ? 'var(--primary-pale)' : '#ffffff',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: formData.role === 'ROLE_LANDOWNER' ? '700' : '500',
                color: formData.role === 'ROLE_LANDOWNER' ? 'var(--primary-dark)' : 'var(--text-body)'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🚜</div>
              <div>Farmland Owner</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>I want to lease land</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Ramesh Patel"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password * (Min 6 chars)</label>
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

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Gujarat"
              />
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Anand"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Village, Post, Taluka / Street"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary)' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

