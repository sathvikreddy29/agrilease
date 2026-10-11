import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { landApi, applicationApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const ApplyLease = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    requestedAcreage: '',
    proposedDurationMonths: 12,
    intendedCrop: '',
    proposedStartDate: '',
    offeredRentPerAcre: '',
    message: ''
  });

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await landApi.getLandById(id);
        if (res.data?.success) {
          const l = res.data.data;
          setLand(l);
          setFormData(prev => ({
            ...prev,
            requestedAcreage: l.availableAcreage,
            proposedDurationMonths: l.minLeaseDurationMonths || 12,
            offeredRentPerAcre: l.rentPerAcrePerYear,
            proposedStartDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
          }));
        }
      } catch (err) {
        setError('Failed to load farmland details.');
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.requestedAcreage) <= 0 || Number(formData.requestedAcreage) > land.availableAcreage) {
      setError(`Requested acreage must be between 0.1 and ${land.availableAcreage} acres.`);
      return;
    }

    if (Number(formData.proposedDurationMonths) < land.minLeaseDurationMonths ||
        Number(formData.proposedDurationMonths) > land.maxLeaseDurationMonths) {
      setError(`Duration must be between ${land.minLeaseDurationMonths} and ${land.maxLeaseDurationMonths} months.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        landListingId: Number(id),
        requestedAcreage: Number(formData.requestedAcreage),
        proposedDurationMonths: Number(formData.proposedDurationMonths),
        intendedCrop: formData.intendedCrop.trim(),
        proposedStartDate: formData.proposedStartDate,
        offeredRentPerAcre: formData.offeredRentPerAcre ? Number(formData.offeredRentPerAcre) : land.rentPerAcrePerYear,
        message: formData.message
      };

      const res = await applicationApi.applyForLease(payload);
      if (res.data?.success) {
        navigate('/my-applications?submitted=true');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing lease proposal form..." />;
  if (!land) return <AlertMessage type="error" message={error || 'Property not found.'} />;

  const estimatedTotal = (Number(formData.requestedAcreage) || 0) * (Number(formData.offeredRentPerAcre) || 0);

  return (
    <div className="container page-container" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link to={`/lands/${id}`} style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          ← Back to Property Details
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 className="page-title">🌾 Submit Farmland Lease Proposal</h1>
          <p className="page-subtitle">
            Propose your cultivation terms directly to the farmland owner.
          </p>
        </div>

        {/* Selected Land Summary Banner */}
        <div style={{
          backgroundColor: '#f7faf7',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <div>
            <strong style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>{land.title}</strong>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              📍 {land.village}, {land.district}, {land.state} • Owner: {land.ownerName}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success">Available: {land.availableAcreage} Acres</span>
            <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', marginTop: '4px' }}>
              Base: ₹{Number(land.rentPerAcrePerYear).toLocaleString('en-IN')}/acre/yr
            </div>
          </div>
        </div>

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Requested Acreage * (Max: {land.availableAcreage})</label>
              <input
                type="number"
                step="0.1"
                name="requestedAcreage"
                value={formData.requestedAcreage}
                onChange={handleChange}
                max={land.availableAcreage}
                className="form-control"
                placeholder={`Max ${land.availableAcreage} acres`}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Proposed Duration (Months) * ({land.minLeaseDurationMonths} - {land.maxLeaseDurationMonths})
              </label>
              <input
                type="number"
                name="proposedDurationMonths"
                value={formData.proposedDurationMonths}
                onChange={handleChange}
                min={land.minLeaseDurationMonths}
                max={land.maxLeaseDurationMonths}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Intended Crop(s) *</label>
              <input
                type="text"
                name="intendedCrop"
                value={formData.intendedCrop}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Organic Cotton, Groundnut, Wheat, Paddy"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Proposed Lease Start Date *</label>
              <input
                type="date"
                name="proposedStartDate"
                value={formData.proposedStartDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Offered Rent per Acre / Year (₹)</label>
            <input
              type="number"
              name="offeredRentPerAcre"
              value={formData.offeredRentPerAcre}
              onChange={handleChange}
              className="form-control"
              placeholder={`Base is ₹${land.rentPerAcrePerYear}`}
            />
          </div>

          {/* Dynamic Commercial Calculation */}
          <div style={{
            backgroundColor: 'var(--primary-pale)',
            border: '1px solid var(--primary-mint)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: '600' }}>
                Estimated Annual Lease Consideration:
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {formData.requestedAcreage || 0} Acres × ₹{Number(formData.offeredRentPerAcre || 0).toLocaleString('en-IN')}/acre
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>
              ₹{Number(estimatedTotal).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Proposal Message / Farming Background</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              placeholder="Introduce your farming experience, soil treatment practices, machinery access, and any requests for the landowner..."
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '30px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ flex: 1 }}
            >
              {submitting ? 'Submitting Proposal...' : 'Submit Lease Proposal'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLease;

