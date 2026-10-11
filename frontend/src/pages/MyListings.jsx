import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchMyListings = async () => {
    try {
      const res = await landApi.getMyListings();
      if (res.data?.success) {
        setListings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this listing? It will no longer be visible to farmers.')) return;

    try {
      const res = await landApi.deleteLand(id);
      if (res.data?.success) {
        setAlert({ type: 'success', text: 'Listing marked as INACTIVE.' });
        fetchMyListings();
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to deactivate listing.' });
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your listed properties..." />;

  return (
    <div className="container page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">🏡 My Listed Farmlands</h1>
          <p className="page-subtitle">Manage all your agricultural properties, rental rates, and availability statuses.</p>
        </div>
        <Link to="/add-land" className="btn btn-primary">
          + Add New Land
        </Link>
      </div>

      {alert.text && (
        <AlertMessage
          type={alert.type}
          message={alert.text}
          onClose={() => setAlert({ type: '', text: '' })}
        />
      )}

      {listings.length > 0 ? (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Property Title</th>
                    <th>Location</th>
                    <th>Available / Total</th>
                    <th>Rent / Acre / Yr</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((land) => (
                    <tr key={land.id}>
                      <td>
                        <strong>{land.title}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Soil: {land.soilType || 'Standard'} • Water: {land.waterAvailability || 'Available'}
                        </div>
                      </td>
                      <td>{land.village}, {land.district}, {land.state}</td>
                      <td>
                        <strong>{land.availableAcreage}</strong> / {land.totalAcreage} Acres
                      </td>
                      <td>₹{Number(land.rentPerAcrePerYear).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          land.status === 'AVAILABLE' ? 'badge-success' :
                          land.status === 'PARTIALLY_LEASED' ? 'badge-warning' :
                          land.status === 'FULLY_LEASED' ? 'badge-info' : 'badge-danger'
                        }`}>
                          {land.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/lands/${land.id}`} className="btn btn-outline btn-sm">
                            View
                          </Link>
                          <Link to={`/edit-land/${land.id}`} className="btn btn-secondary btn-sm">
                            Edit
                          </Link>
                          {land.status !== 'INACTIVE' && (
                            <button
                              onClick={() => handleDelete(land.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Deactivate
                            </button>
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
          <div className="empty-state-icon">🚜</div>
          <h3 className="empty-state-title">You haven't listed any farmland yet</h3>
          <p className="empty-state-text">Publish your agricultural land to connect with verified cultivating farmers.</p>
          <Link to="/add-land" className="btn btn-primary">
            + List Your First Farmland
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListings;

