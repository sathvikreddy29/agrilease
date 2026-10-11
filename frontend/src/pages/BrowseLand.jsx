import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { landApi } from '../api';
import LandCard from '../components/LandCard';
import LoadingSpinner from '../components/LoadingSpinner';

export const BrowseLand = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    state: searchParams.get('state') || '',
    district: searchParams.get('district') || '',
    soilType: searchParams.get('soilType') || '',
    waterAvailability: searchParams.get('waterAvailability') || '',
    minAcreage: searchParams.get('minAcreage') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortDir: searchParams.get('sortDir') || 'desc',
    page: 0,
    size: 9
  });

  const [lands, setLands] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const params = {
        state: filters.state || undefined,
        district: filters.district || undefined,
        soilType: filters.soilType || undefined,
        waterAvailability: filters.waterAvailability || undefined,
        minAcreage: filters.minAcreage ? Number(filters.minAcreage) : undefined,
        maxBudget: filters.maxBudget ? Number(filters.maxBudget) : undefined,
        status: 'AVAILABLE',
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir
      };

      const res = await landApi.getLands(params);
      if (res.data?.success && res.data.data) {
        setLands(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to fetch lands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [filters.page, filters.sortBy, filters.sortDir]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 0 }));
    fetchLands();
  };

  const handleReset = () => {
    setFilters({
      state: '',
      district: '',
      soilType: '',
      waterAvailability: '',
      minAcreage: '',
      maxBudget: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
      page: 0,
      size: 9
    });
    setSearchParams({});
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="page-title">🌾 Browse Agricultural Lands for Lease</h1>
        <p className="page-subtitle">
          Filter verified farmlands by acreage, soil quality, water sources, and lease rates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Filter Sidebar */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-dark)' }}>
              Filter Farmland
            </h3>
            <button
              onClick={handleReset}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit}>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                placeholder="e.g. Gujarat, Maharashtra"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                placeholder="e.g. Anand, Guntur"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type</label>
              <select
                value={filters.soilType}
                onChange={(e) => setFilters({ ...filters, soilType: e.target.value })}
                className="form-select"
              >
                <option value="">All Soil Types</option>
                <option value="Black Cotton">Black Cotton Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red Loamy">Red Loamy Soil</option>
                <option value="Clay">Clay Soil</option>
                <option value="Sandy">Sandy Loam</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Water Source</label>
              <select
                value={filters.waterAvailability}
                onChange={(e) => setFilters({ ...filters, waterAvailability: e.target.value })}
                className="form-select"
              >
                <option value="">Any Source</option>
                <option value="Borewell">Borewell</option>
                <option value="Canal">Canal Irrigation</option>
                <option value="River">River / Stream</option>
                <option value="Pond">Farm Pond</option>
                <option value="Well">Open Well</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Min Available Acreage</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={filters.minAcreage}
                onChange={(e) => setFilters({ ...filters, minAcreage: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Budget (₹ / acre / yr)</label>
              <input
                type="number"
                placeholder="e.g. 35000"
                value={filters.maxBudget}
                onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Listings Display Area */}
        <div>
          {/* Top Sort & Count Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: '#ffffff',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Showing <strong>{lands.length}</strong> of <strong>{totalElements}</strong> available properties
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort By:</span>
              <select
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy: field, sortDir: dir });
                }}
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="rentPerAcrePerYear-asc">Rent: Low to High</option>
                <option value="rentPerAcrePerYear-desc">Rent: High to Low</option>
                <option value="totalAcreage-desc">Acreage: Largest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching farmlands..." />
          ) : lands.length > 0 ? (
            <>
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                {lands.map((land) => (
                  <LandCard key={land.id} land={land} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button
                    disabled={filters.page === 0}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="btn btn-outline btn-sm"
                  >
                    ← Previous
                  </button>
                  <span style={{ alignSelf: 'center', fontSize: '14px', padding: '0 8px' }}>
                    Page {filters.page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={filters.page >= totalPages - 1}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="btn btn-outline btn-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state card">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No matching farmlands found</h3>
              <p className="empty-state-text">Try adjusting your filters or search criteria.</p>
              <button onClick={handleReset} className="btn btn-outline">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseLand;

