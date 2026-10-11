import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { applicationApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const MyApplications = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    try {
      const res = await applicationApi.getMyApplications();
      if (res.data?.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    if (location.search.includes('submitted=true')) {
      setAlert({ type: 'success', text: 'Your lease proposal was submitted successfully!' });
    }
  }, [location.search]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending application?')) return;

    try {
      const res = await applicationApi.cancelApplication(id);
      if (res.data?.success) {
        setAlert({ type: 'info', text: 'Application cancelled.' });
        fetchApplications();
      }
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Failed to cancel application.' });
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your submitted applications..." />;

  return (
    <div className="container page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">📑 My Submitted Lease Applications</h1>
          <p className="page-subtitle">Track status updates, landowner decisions, and active proposals.</p>
        </div>
        <Link to="/lands" className="btn btn-primary">
          + Explore More Farmlands
        </Link>
      </div>

      {alert.text && (
        <AlertMessage
          type={alert.type}
          message={alert.text}
          onClose={() => setAlert({ type: '', text: '' })}
        />
      )}

      {applications.length > 0 ? (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Farmland Listing</th>
                    <th>Location</th>
                    <th>Acreage</th>
                    <th>Duration</th>
                    <th>Crop</th>
                    <th>Proposed Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.landTitle}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Owner: {app.ownerName}
                        </div>
                      </td>
                      <td>{app.landVillage}, {app.landDistrict}</td>
                      <td><strong>{app.requestedAcreage}</strong> Acres</td>
                      <td>{app.proposedDurationMonths} Months</td>
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
                        {app.status === 'REJECTED' && app.rejectionReason && (
                          <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>
                            Reason: {app.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/lands/${app.landListingId}`} className="btn btn-outline btn-sm">
                            View Land
                          </Link>
                          {app.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancel(app.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel
                            </button>
                          )}
                          {app.status === 'APPROVED' && (
                            <Link to="/my-leases" className="btn btn-primary btn-sm">
                              View Agreement
                            </Link>
                          )}
                        </div>
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
          <div className="empty-state-icon">🌾</div>
          <h3 className="empty-state-title">No applications submitted yet</h3>
          <p className="empty-state-text">Browse our curated agricultural listings and apply to lease farmland.</p>
          <Link to="/lands" className="btn btn-primary">
            Browse Available Lands
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;

