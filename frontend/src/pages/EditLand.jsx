import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await landApi.getLandById(id);
        if (res.data?.success) {
          const l = res.data.data;
          setFormData({
            title: l.title || '',
            description: l.description || '',
            state: l.state || '',
            district: l.district || '',
            village: l.village || '',
            address: l.address || '',
            totalAcreage: l.totalAcreage || '',
            soilType: l.soilType || 'Black Cotton Soil',
            waterAvailability: l.waterAvailability || 'Borewell (Deep)',
            electricityAvailability: l.electricityAvailability ?? true,
            availableFacilities: l.availableFacilities || '',
            rentPerAcrePerYear: l.rentPerAcrePerYear || '',
            minLeaseDurationMonths: l.minLeaseDurationMonths || 12,
            maxLeaseDurationMonths: l.maxLeaseDurationMonths || 36,
            imageUrl: l.imageUrl || '',
            contactPhone: l.contactPhone || '',
            contactEmail: l.contactEmail || ''
          });
        }
      } catch (err) {
        setError('Failed to fetch land details for editing.');
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalAcreage: Number(formData.totalAcreage),
        rentPerAcrePerYear: Number(formData.rentPerAcrePerYear),
        minLeaseDurationMonths: Number(formData.minLeaseDurationMonths),
        maxLeaseDurationMonths: Number(formData.maxLeaseDurationMonths)
      };

      const res = await landApi.updateLand(id, payload);
      if (res.data?.success) {
        navigate(`/lands/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update land listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading property details..." />;
  if (!formData) return <AlertMessage type="error" message={error || 'Property not found.'} />;

  return (
    <div className="container page-container" style={{ maxWidth: '820px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 className="page-title">✏️ Edit Farmland Listing</h1>
          <p className="page-subtitle">Update land specifications, infrastructure, or rental rates.</p>
        </div>

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address / Survey No. *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Acreage *</label>
              <input
                type="number"
                step="0.1"
                name="totalAcreage"
                value={formData.totalAcreage}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type</label>
              <input
                type="text"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Water Source</label>
              <input
                type="text"
                name="waterAvailability"
                value={formData.waterAvailability}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              <input
                type="checkbox"
                name="electricityAvailability"
                checked={formData.electricityAvailability}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              ⚡ Active Agricultural Electricity Available
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Available Facilities</label>
            <input
              type="text"
              name="availableFacilities"
              value={formData.availableFacilities}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expected Rent (₹ / Acre / Year) *</label>
              <input
                type="number"
                name="rentPerAcrePerYear"
                value={formData.rentPerAcrePerYear}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Duration (Months)</label>
              <input
                type="number"
                name="minLeaseDurationMonths"
                value={formData.minLeaseDurationMonths}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Duration (Months)</label>
              <input
                type="number"
                name="maxLeaseDurationMonths"
                value={formData.maxLeaseDurationMonths}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Farmland Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '32px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
              style={{ flex: 1 }}
            >
              {saving ? 'Saving Changes...' : 'Save Updates'}
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

export default EditLand;

