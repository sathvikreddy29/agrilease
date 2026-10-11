import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { landApi } from '../api';
import AlertMessage from '../components/AlertMessage';

export const AddLand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    state: '',
    district: '',
    village: '',
    address: '',
    totalAcreage: '',
    soilType: 'Black Cotton Soil',
    waterAvailability: 'Borewell (Deep)',
    electricityAvailability: true,
    availableFacilities: '',
    rentPerAcrePerYear: '',
    minLeaseDurationMonths: 12,
    maxLeaseDurationMonths: 36,
    imageUrl: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (Number(formData.totalAcreage) <= 0) {
      setError('Total acreage must be greater than 0.');
      return;
    }
    if (Number(formData.rentPerAcrePerYear) <= 0) {
      setError('Rent per acre must be greater than 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalAcreage: Number(formData.totalAcreage),
        rentPerAcrePerYear: Number(formData.rentPerAcrePerYear),
        minLeaseDurationMonths: Number(formData.minLeaseDurationMonths),
        maxLeaseDurationMonths: Number(formData.maxLeaseDurationMonths)
      };

      const res = await landApi.createLand(payload);
      if (res.data?.success) {
        navigate('/my-listings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list agricultural land.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '820px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 className="page-title">🚜 List New Agricultural Farmland</h1>
          <p className="page-subtitle">Publish your farmland details for prospective cultivators across India.</p>
        </div>

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          {/* Section: Title & Description */}
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 15-Acre Fertile Black Cotton Farmland with 2 Borewells"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Describe soil depth, past crops grown, boundary fencing, road accessibility..."
            />
          </div>

          {/* Section: Location */}
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', margin: '24px 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            📍 Location Details
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Gujarat"
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
                placeholder="e.g. Anand"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village / Town *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Mogar"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Survey No. / Detailed Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Survey No. 142/A, Near Vasad Highway"
              required
            />
          </div>

          {/* Section: Agricultural Attributes */}
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', margin: '24px 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            🌾 Farmland Features & Capacity
          </h3>

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
                placeholder="e.g. 15.0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Alluvial Soil">Alluvial Fertile Soil</option>
                <option value="Red Loamy Soil">Red Loamy Soil</option>
                <option value="Clay Soil">Clay Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Water Availability</label>
              <select
                name="waterAvailability"
                value={formData.waterAvailability}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Borewell (Deep)">Borewell (Deep with Pump)</option>
                <option value="Canal Irrigation">Canal Network Lift</option>
                <option value="River / Natural Stream">River / Stream</option>
                <option value="Open Farm Pond">Farm Pond / Storage Reservoir</option>
                <option value="Open Well">Traditional Open Well</option>
                <option value="Rainfed Only">Monsoon Rainfed Only</option>
              </select>
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
              ⚡ Active 3-Phase Agricultural Electricity Connection Available
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Available Facilities / Assets</label>
            <input
              type="text"
              name="availableFacilities"
              value={formData.availableFacilities}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Solar fencing, Drip irrigation lines, Storage shed, Tractor trailer path"
            />
          </div>

          {/* Section: Commercials & Duration */}
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', margin: '24px 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            💰 Commercials & Lease Terms
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expected Rent (₹ / Acre / Year) *</label>
              <input
                type="number"
                name="rentPerAcrePerYear"
                value={formData.rentPerAcrePerYear}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 28000"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Lease Duration (Months)</label>
              <input
                type="number"
                name="minLeaseDurationMonths"
                value={formData.minLeaseDurationMonths}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 12"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Lease Duration (Months)</label>
              <input
                type="number"
                name="maxLeaseDurationMonths"
                value={formData.maxLeaseDurationMonths}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 36"
              />
            </div>
          </div>

          {/* Section: Image & Contacts */}
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', margin: '24px 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            📷 Photos & Direct Contact
          </h3>

          <div className="form-group">
            <label className="form-label">Farmland Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="https://images.unsplash.com/... (optional photo link)"
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
                placeholder="+91 98251 23456"
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
                placeholder="owner@gmail.com"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '32px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Publishing Farmland...' : 'Publish Farmland Listing'}
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

export default AddLand;

