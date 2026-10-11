import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landApi, applicationApi, leaseApi } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const LandownerDashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [receivedApps, setReceivedApps] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [landsRes, appsRes, leasesRes] = await Promise.all([
        landApi.getMyListings(),
        applicationApi.getReceivedApplications(),
        leaseApi.getMyLeases()
      ]);
      if (landsRes.data?.success) setMyListings(landsRes.data.data);
      if (appsRes.data?.success) setReceivedApps(appsRes.data.data);
      if (leasesRes.data?.success) setLeases(leasesRes.data.data);
    } catch (err) {
      console.error('Error fetching landowner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (appId) => {
    if (!window.confirm('Approve this application? This will deduct the requested acreage and create a binding lease agreement record.')) return;
    try {
      const res = await applicationApi.approveApplication(appId);
      if (res.data?.success) {
        setAlert({ type: 'success', text: 'Application approved! Lease Agreement successfully generated.' });
        fetchData();
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Approval failed.' });
    }
  };

  const handleReject = async (appId) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return;
    try {
      const res = await applicationApi.rejectApplication(appId, reason);
      if (res.data?.success) {
        setAlert({ type: 'info', text: 'Application rejected.' });
        fetchData();
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Rejection failed.' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading landowner dashboard..." />;

  const pendingApps = receivedApps.filter(a => a.status === 'PENDING');
  const totalAcreage = myListings.reduce((sum, l) => sum + (l.totalAcreage || 0), 0);
  const availableAcreage = myListings.reduce((sum, l) => sum + (l.availableAcreage || 0), 0);

  return (
    <div className="container page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">🚜 Landowner Dashboard</h1>
          <p className="page-subtitle">Welcome, {user?.fullName}! Manage your agricultural properties and cultivate lease partnerships.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/add-land" className="btn btn-primary">
            + Add Land Listing
          </Link>
          <Link to="/my-listings" className="btn btn-outline">
            Manage Listings
          </Link>
        </div>
      </div>

      {alert.text && (
        <AlertMessage
          type={alert.type}
          message={alert.text}
          onClose={() => setAlert({ type: '', text: '' })}
        />
      )}

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon">🏡</div>
          <div>
            <div className="stat-value">{myListings.length}</div>
            <div className="stat-label">Listed Properties</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)' }}>🌾</div>
          <div>
            <div className="stat-value">{availableAcreage} / {totalAcreage}</div>
            <div className="stat-label">Avail / Total Acres</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>📥</div>
          <div>
            <div className="stat-value">{pendingApps.length}</div>
            <div className="stat-label">Applications Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>📑</div>
          <div>
            <div className="stat-value">{leases.length}</div>
            <div className="stat-label">Active Lease Records</div>
          </div>
        </div>
      </div>

      {/* Action Required: Pending Applications */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Pending Farmer Proposals</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Proposals awaiting your approval or rejection</span>
          </div>
          <Link to="/received-applications" className="btn btn-outline btn-sm">
            All Received ({receivedApps.length})
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {pendingApps.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Property</th>
                    <th>Requested Acres</th>
                    <th>Proposed Duration</th>
                    <th>Intended Crop</th>
                    <th>Offered Rent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.farmerName}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.farmerPhone || app.farmerEmail}</div>
                      </td>
                      <td>{app.landTitle}</td>
                      <td><strong>{app.requestedAcreage}</strong> Acres</td>
                      <td>{app.proposedDurationMonths} Months</td>
                      <td>{app.intendedCrop}</td>
                      <td>₹{Number(app.totalOfferedRent).toLocaleString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h4 className="empty-state-title">No pending applications</h4>
              <p className="empty-state-text">You are caught up! New lease proposals from interested farmers will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandownerDashboard;

