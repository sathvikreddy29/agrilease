import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { landApi } from '../api';
import LandCard from '../components/LandCard';
import LoadingSpinner from '../components/LoadingSpinner';

export const Home = () => {
  const navigate = useNavigate();
  const [featuredLands, setFeaturedLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickState, setQuickState] = useState('');
  const [quickAcreage, setQuickAcreage] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await landApi.getLands({ size: 3, sortBy: 'createdAt', sortDir: 'desc' });
        if (res.data?.success && res.data.data?.content) {
          setFeaturedLands(res.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load featured lands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickState) params.append('state', quickState);
    if (quickAcreage) params.append('minAcreage', quickAcreage);
    navigate(`/lands?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#1b4332',
        color: '#ffffff',
        padding: '70px 0 80px 0',
        position: 'relative',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(82, 183, 136, 0.25)',
            border: '1px solid #52b788',
            color: '#d8f3dc',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            🌱 Direct Landowner to Cultivator Farmland Network
          </div>

          <h1 style={{
            fontSize: '44px',
            fontFamily: 'var(--font-serif)',
            fontWeight: '700',
            marginBottom: '18px',
            lineHeight: '1.2'
          }}>
            Lease Fertile Agricultural Land with Confidence & Transparency
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#d8f3dc',
            marginBottom: '36px',
            lineHeight: '1.6'
          }}>
            Connecting verified farmland owners with progressive cultivators. Inspect soil types, water sources, and lease terms with transparent digital agreements.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleQuickSearch} style={{
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '28px'
          }}>
            <div style={{ flex: '1 1 200px' }}>
              <input
                type="text"
                placeholder="Enter State or District..."
                value={quickState}
                onChange={(e) => setQuickState(e.target.value)}
                className="form-control"
                style={{ border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ flex: '1 1 160px' }}>
              <select
                value={quickAcreage}
                onChange={(e) => setQuickAcreage(e.target.value)}
                className="form-select"
                style={{ border: '1px solid #cbd5e1' }}
              >
                <option value="">Any Acreage</option>
                <option value="5">5+ Acres</option>
                <option value="10">10+ Acres</option>
                <option value="20">20+ Acres</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto', padding: '11px 28px' }}>
              🔍 Search Farmlands
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register?role=LANDOWNER" className="btn btn-secondary">
              List Your Farmland
            </Link>
            <Link to="/lands" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Explore All Listings →
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Metrics Bar */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', padding: '36px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>500+</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Acres Leased</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>100%</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Verified Ownership</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>Zero</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Hidden Brokerages</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>Digital</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Structured Lease Records</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lands Section */}
      <section className="container page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-mint)', textTransform: 'uppercase' }}>
              Prime Agricultural Opportunities
            </span>
            <h2 className="page-title" style={{ marginTop: '4px' }}>Featured Farmland Listings</h2>
          </div>
          <Link to="/lands" className="btn btn-outline btn-sm">
            View All Lands →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching prime farmlands..." />
        ) : featuredLands.length > 0 ? (
          <div className="grid-3">
            {featuredLands.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🌾</div>
            <h3 className="empty-state-title">No listings available yet</h3>
            <p className="empty-state-text">Be the first to list agricultural farmland for lease.</p>
            <Link to="/add-land" className="btn btn-primary">List Farmland</Link>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: '#f1f5f2', padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
              Streamlined Process
            </span>
            <h2 className="page-title">How AgriLease Operates</h2>
            <p className="page-subtitle">A transparent 3-step pathway for landowners and cultivating farmers</p>
          </div>

          <div className="grid-2" style={{ gap: '36px' }}>
            {/* For Landowners */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px' }}>🚜</span>
                <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>For Landowners</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>1.</span>
                  <div><strong>Publish Farmland:</strong> Specify soil type, acreage, water sources, and annual expected rent.</div>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>2.</span>
                  <div><strong>Review Proposals:</strong> View proposed crops, duration, and farming experience from applicants.</div>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>3.</span>
                  <div><strong>Approve & Lease:</strong> Generate digital agreements that lock acreage and establish clear terms.</div>
                </li>
              </ul>
            </div>

            {/* For Farmers */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px' }}>🌾</span>
                <h3 style={{ fontSize: '20px', color: 'var(--primary-dark)' }}>For Cultivating Farmers</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>1.</span>
                  <div><strong>Browse & Filter:</strong> Search by state, district, soil type (Alluvial, Black, Red), and budget.</div>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>2.</span>
                  <div><strong>Apply with Proposed Crop:</strong> Submit customized acreage requests, crop plans, and offered rent.</div>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>3.</span>
                  <div><strong>Start Cultivation:</strong> Receive formal lease confirmation and direct owner contact information.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

