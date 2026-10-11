import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { landApi } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isFarmer } = useAuth();

  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ reason: 'Inaccurate Information', details: '' });
  const [reportSuccess, setReportSuccess] = useState('');

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await landApi.getLandById(id);
        if (res.data?.success) {
          setLand(res.data.data);
        }
      } catch (err) {
        setError('Failed to load land details.');
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await landApi.reportLand(id, reportData);
      if (res.data?.success) {
        setReportSuccess('Report submitted for administrator review.');
        setShowReportModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching land details..." />;
  if (error || !land) return (
    <div className="container page-container">
      <AlertMessage type="error" message={error || 'Property not found.'} />
      <Link to="/lands" className="btn btn-outline">← Back to Farmlands</Link>
    </div>
  );

  const isOwner = user && land.ownerId === user.id;
  const canApply = isFarmer && !isOwner && (land.status === 'AVAILABLE' || land.status === 'PARTIALLY_LEASED');
  const defaultImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="container page-container">
      <div style={{ marginBottom: '16px' }}>
        <Link to="/lands" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          ← Back to All Farmland Listings
        </Link>
      </div>

      {reportSuccess && <AlertMessage type="success" message={reportSuccess} onClose={() => setReportSuccess('')} />}

      {/* Hero Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`badge ${
              land.status === 'AVAILABLE' ? 'badge-success' :
              land.status === 'PARTIALLY_LEASED' ? 'badge-warning' : 'badge-danger'
            }`}>
              {land.status}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Listed on {new Date(land.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: '32px' }}>{land.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px' }}>
            <span>📍</span>
            <span>{land.address}, {land.village}, {land.district}, {land.state}</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          textAlign: 'right',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>
            ₹{Number(land.rentPerAcrePerYear).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>per acre / year</div>
          <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '4px' }}>
            Total Annual Value: ₹{Number(land.totalExpectedRent).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Image Banner */}
      <div style={{
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '36px',
        backgroundColor: '#e2e8f0',
        boxShadow: 'var(--shadow-md)'
      }}>
        <img
          src={land.imageUrl || defaultImage}
          alt={land.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Two Column Details Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Specifications */}
        <div>
          {/* Description */}
          <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '14px' }}>
              Farmland Overview & Cultivation Scope
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-body)', whiteSpace: 'pre-line' }}>
              {land.description || 'No additional description provided by landowner.'}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '20px' }}>
              Agricultural Specifications
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <span className="spec-label">Available Land</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                  {land.availableAcreage} Acres
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total: {land.totalAcreage} Acres</div>
              </div>

              <div>
                <span className="spec-label">Soil Classification</span>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{land.soilType || 'Not Specified'}</div>
              </div>

              <div>
                <span className="spec-label">Water Source & Irrigation</span>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{land.waterAvailability || 'Natural Rainfed'}</div>
              </div>

              <div>
                <span className="spec-label">Electricity Infrastructure</span>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                  {land.electricityAvailability ? '⚡ Yes (Active 3-Phase)' : '❌ Not Available'}
                </div>
              </div>

              <div>
                <span className="spec-label">Lease Duration Range</span>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                  {land.minLeaseDurationMonths} to {land.maxLeaseDurationMonths} Months
                </div>
              </div>

              <div>
                <span className="spec-label">Facilities & Infrastructure</span>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                  {land.availableFacilities || 'Standard farm boundary'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Action Card & Contact */}
        <div>
          {/* Action Card */}
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '16px' }}>
              Lease Proposal
            </h3>

            {canApply && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Interested in cultivating this land? Submit your proposal detailing your requested acreage, duration, and crop plan.
                </p>
                <Link to={`/apply/${land.id}`} className="btn btn-primary btn-block btn-lg">
                  🌾 Apply to Lease This Farmland
                </Link>
              </div>
            )}

            {isOwner && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  You are the verified owner of this farmland listing.
                </p>
                <Link to={`/edit-land/${land.id}`} className="btn btn-secondary btn-block">
                  ✏️ Edit Land Details
                </Link>
              </div>
            )}

            {!isAuthenticated && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Log in as a registered farmer to submit a lease application for this property.
                </p>
                <Link to="/login" className="btn btn-primary btn-block">
                  Sign In to Apply
                </Link>
              </div>
            )}

            {isAuthenticated && !isFarmer && !isOwner && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                You are logged in as a <strong>{user?.role.replace('ROLE_', '')}</strong>. Only cultivating farmers can submit lease applications.
              </div>
            )}
          </div>

          {/* Landowner Contact Card */}
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--primary-dark)', marginBottom: '14px', fontWeight: '700' }}>
              Landowner Information
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-pale)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {land.ownerName?.charAt(0) || 'O'}
              </span>
              <div>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{land.ownerName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Farmland Owner</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>📞 <strong>Phone:</strong> {land.contactPhone || 'Available upon application approval'}</div>
              <div>✉️ <strong>Email:</strong> {land.contactEmail || 'Available upon application approval'}</div>
            </div>
          </div>

          {/* Report Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                width: '100%'
              }}
            >
              🚩 Report this Farmland Listing
            </button>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="card-header">
              <h3 className="card-title">Report Farmland Listing</h3>
              <button
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Reason for Flagging</label>
                  <select
                    value={reportData.reason}
                    onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                    className="form-select"
                  >
                    <option value="Inaccurate Information">Inaccurate Soil or Water Information</option>
                    <option value="Duplicate Listing">Duplicate Listing</option>
                    <option value="Fraudulent Land Claim">Suspected Fraudulent Land Ownership</option>
                    <option value="Unreachable Owner">Unreachable Landowner</option>
                    <option value="Other">Other Policy Violation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Details / Explanation</label>
                  <textarea
                    rows={4}
                    value={reportData.details}
                    onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                    className="form-control"
                    placeholder="Provide specific details to help administrators review..."
                    required
                  />
                </div>
              </div>
              <div className="card-footer">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandDetails;

