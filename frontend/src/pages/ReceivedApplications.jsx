import React, { useState, useEffect } from 'react';
import { applicationApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const ReceivedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    try {
      const res = await applicationApi.getReceivedApplications();
      if (res.data?.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load received applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this lease application? This will commit the requested acreage and create a binding lease record.')) return;

    try {
      const res = await applicationApi.approveApplication(id);
      if (res.data?.success) {
        setAlert({ type: 'success', text: 'Application approved! Lease Agreement successfully established.' });
        fetchApplications();
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Failed to approve application.' });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Specify a reason for rejecting this proposal (optional):');
    if (reason === null) return;

    try {
      const res = await applicationApi.rejectApplication(id, reason);
      if (res.data?.success) {
        setAlert({ type: 'info', text: 'Application rejected.' });
        fetchApplications();
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Failed to reject application.' });
    }
  };

  if (loading) return <LoadingSpinner text="Fetching received farmer applications..." />;

  const filteredApps = filterStatus === 'ALL'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  return (
    <div className="container page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">📥 Received Lease Applications</h1>
          <p className="page-subtitle">Review proposals from prospective cultivating farmers for your listed farmlands.</p>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {alert.text && (
        <AlertMessage
          type={alert.type}
          message={alert.text}
          onClose={() => setAlert({ type: '', text: '' })}
        />
      )}

      {filteredApps.length > 0 ? (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cultivator</th>
                    <th>Property</th>
                    <th>Requested Acres</th>
                    <th>Duration</th>
                    <th>Intended Crop</th>
                    <th>Offered Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.farmerName}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          📞 {app.farmerPhone || 'N/A'} • {app.farmerEmail}
                        </div>
                      </td>
                      <td>
                        <strong>{app.landTitle}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {app.landVillage}, {app.landDistrict}
                        </div>
                      </td>
                      <td><strong>{app.requestedAcreage}</strong> Acres</td>
                      <td>{app.proposedDurationMonths} Months</td>
                      <td>
                        <span style={{ fontWeight: '600' }}>{app.intendedCrop}</span>
                        {app.message && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '200px' }}>
                            "{app.message}"
                          </div>
                        )}
                      </td>
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
                        {app.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
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
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Decision recorded</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state card">
          <div className="empty-state-icon">📥</div>
          <h3 className="empty-state-title">No applications found</h3>
          <p className="empty-state-text">No farmer applications match the current filter.</p>
        </div>
      )}
    </div>
  );
};

export default ReceivedApplications;

