import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      const [statsRes, usersRes, listingsRes, reportsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getListings(),
        adminApi.getReports()
      ]);
      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (usersRes.data?.success) setUsers(usersRes.data.data);
      if (listingsRes.data?.success) setListings(listingsRes.data.data);
      if (reportsRes.data?.success) setReports(reportsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await adminApi.updateUserStatus(userId, !currentStatus);
      if (res.data?.success) {
        setAlert({ type: 'success', text: `User account ${!currentStatus ? 'activated' : 'suspended'} successfully.` });
        setUsers(users.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update user status.' });
    }
  };

  const handleToggleListingStatus = async (listingId, currentStatus) => {
    const newStatus = currentStatus === 'INACTIVE' ? 'AVAILABLE' : 'INACTIVE';
    try {
      const res = await adminApi.updateListingStatus(listingId, newStatus);
      if (res.data?.success) {
        setAlert({ type: 'success', text: `Listing marked as ${newStatus}.` });
        setListings(listings.map(l => l.id === listingId ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update listing status.' });
    }
  };

  const handleReportAction = async (reportId, newStatus) => {
    try {
      const res = await adminApi.updateReportStatus(reportId, newStatus);
      if (res.data?.success) {
        setAlert({ type: 'success', text: `Report marked as ${newStatus}.` });
        setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update report.' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Admin Management Console..." />;

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="page-title">🛡️ System Administration Console</h1>
        <p className="page-subtitle">Platform-wide moderation, user authorization controls, and compliance oversight.</p>
      </div>

      {alert.text && (
        <AlertMessage
          type={alert.type}
          message={alert.text}
          onClose={() => setAlert({ type: '', text: '' })}
        />
      )}

      {/* Metrics Grid */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '36px' }}>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users ({stats.totalLandowners} Owners, {stats.totalFarmers} Farmers)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏡</div>
            <div>
              <div className="stat-value">{stats.totalListings}</div>
              <div className="stat-label">Farmland Listings ({stats.availableListings} Avail)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📑</div>
            <div>
              <div className="stat-value">{stats.activeLeases}</div>
              <div className="stat-label">Active Digital Leases</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>🚩</div>
            <div>
              <div className="stat-value">{stats.pendingReports}</div>
              <div className="stat-label">Unresolved Reports</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          Listing Moderation ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          Reported Farmlands ({reports.length})
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Account Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.fullName}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{u.role.replace('ROLE_', '')}</span>
                      </td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>{u.district || '-'}, {u.state || '-'}</td>
                      <td>
                        <span className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}>
                          {u.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.active)}
                            className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-secondary'}`}
                          >
                            {u.active ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Listing Moderation */}
      {activeTab === 'listings' && (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Property Title</th>
                    <th>Location</th>
                    <th>Acreage</th>
                    <th>Rent/Acre</th>
                    <th>Status</th>
                    <th>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id}>
                      <td>
                        <strong>{l.title}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Owner: {l.ownerName}</div>
                      </td>
                      <td>{l.village}, {l.district}, {l.state}</td>
                      <td>{l.availableAcreage} / {l.totalAcreage} Acres</td>
                      <td>₹{Number(l.rentPerAcrePerYear).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          l.status === 'AVAILABLE' ? 'badge-success' :
                          l.status === 'PARTIALLY_LEASED' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleListingStatus(l.id, l.status)}
                          className={`btn btn-sm ${l.status === 'INACTIVE' ? 'btn-secondary' : 'btn-danger'}`}
                        >
                          {l.status === 'INACTIVE' ? 'Restore Active' : 'Deactivate Listing'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {reports.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reported Property</th>
                      <th>Reported By</th>
                      <th>Reason</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.landTitle}</strong></td>
                        <td>{r.reportedByName}</td>
                        <td><span className="badge badge-warning">{r.reason}</span></td>
                        <td>{r.details || 'No additional details'}</td>
                        <td>
                          <span className={`badge ${r.status === 'PENDING' ? 'badge-danger' : 'badge-info'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleReportAction(r.id, 'ACTIONED')}
                                className="btn btn-danger btn-sm"
                              >
                                Actioned
                              </button>
                              <button
                                onClick={() => handleReportAction(r.id, 'DISMISSED')}
                                className="btn btn-secondary btn-sm"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🛡️</div>
                <h4 className="empty-state-title">No pending reports</h4>
                <p className="empty-state-text">No community flags or listing violations reported.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

