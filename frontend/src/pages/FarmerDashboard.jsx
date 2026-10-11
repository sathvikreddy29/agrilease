import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi, leaseApi } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, leaseRes] = await Promise.all([
          applicationApi.getMyApplications(),
          leaseApi.getMyLeases()
        ]);
        if (appRes.data?.success) setApplications(appRes.data.data);
        if (leaseRes.data?.success) setLeases(leaseRes.data.data);
      } catch (err) {
        console.error('Failed to load farmer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelApp = async (appId) => {
    if (!window.confirm('Are you sure you want to cancel this pending application?')) return;
    try {
      const res = await applicationApi.cancelApplication(appId);
      if (res.data?.success) {
        setMessage('Application cancelled successfully.');
        setApplications(applications.map(a => a.id === appId ? { ...a, status: 'CANCELLED' } : a));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel application');
    }
  };

  if (loading) return <LoadingSpinner text="Loading your farmer portal..." />;

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const activeLeaseCount = leases.filter(l => l.status === 'ACTIVE').length;

  return (
    <div className="container page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">🌾 Farmer Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.fullName}! Track your land applications and active cultivations.</p>
        </div>
        <Link to="/lands" className="btn btn-primary">
          🔍 Search Available Farmlands
        </Link>
      </div>

      {message && <AlertMessage type="success" message={message} onClose={() => setMessage('')} />}

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon">📑</div>
          <div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>⏳</div>
          <div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending Decision</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>✅</div>
          <div>
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-label">Approved Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)' }}>🌱</div>
          <div>
            <div className="stat-value">{activeLeaseCount}</div>
            <div className="stat-label">Active Farmland Leases</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Lease Applications</h3>
          <Link to="/my-applications" className="btn btn-outline btn-sm">
            View All ({applications.length})
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Farmland Listing</th>
                    <th>Location</th>
                    <th>Acreage</th>
                    <th>Crop Intended</th>
                    <th>Proposed Rent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map(app => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.landTitle}</strong>
                      </td>
                      <td>{app.landVillage}, {app.landDistrict}</td>
                      <td>{app.requestedAcreage} Acres</td>
                      <td>{app.intendedCrop}</td>
                      <td>₹{Number(app.totalOfferedRent).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'APPROVED' ? 'badge-success' :
                          app.status === 'PENDING' ? 'badge-warning' :
                          app.status === 'REJECTED' ? 'badge-danger' : 'badge-info'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelApp(app.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
                        )}
                        {app.status === 'APPROVED' && (
                          <Link to="/my-leases" className="btn btn-outline btn-sm">
                            View Lease
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h4 className="empty-state-title">No applications submitted yet</h4>
              <p className="empty-state-text">Browse fertile farmlands and submit a proposal to start cultivating.</p>
              <Link to="/lands" className="btn btn-primary btn-sm">Browse Lands</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

