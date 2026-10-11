import React, { useState, useEffect } from 'react';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    state: '',
    district: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getMe();
        if (res.data?.success) {
          const p = res.data.data;
          setProfile(p);
          setFormData({
            fullName: p.fullName || '',
            phone: p.phone || '',
            address: p.address || '',
            state: p.state || '',
            district: p.district || ''
          });
        }
      } catch (err) {
        setAlert({ type: 'error', text: 'Failed to load profile details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateProfile(formData);
      if (res.data?.success) {
        const updated = res.data.data;
        setProfile(updated);
        updateUser({ ...user, ...updated });
        setAlert({ type: 'success', text: 'Profile updated successfully.' });
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="container page-container" style={{ maxWidth: '680px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px', marginBottom: '4px' }}>
              {profile?.fullName}
            </h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-primary">
                {profile?.role?.replace('ROLE_', '')}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {profile?.email}
              </span>
            </div>
          </div>
        </div>

        {alert.text && (
          <AlertMessage
            type={alert.type}
            message={alert.text}
            onClose={() => setAlert({ type: '', text: '' })}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              value={profile?.email || ''}
              className="form-control"
              disabled
              style={{ backgroundColor: '#f1f5f2' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="+91 98765 43210"
            />
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={saving}
            style={{ marginTop: '16px' }}
          >
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

