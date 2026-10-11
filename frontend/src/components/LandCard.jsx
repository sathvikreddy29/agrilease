import React from 'react';
import { Link } from 'react-router-dom';

export const LandCard = ({ land }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge badge-success">Available</span>;
      case 'PARTIALLY_LEASED':
        return <span className="badge badge-warning">Partially Leased</span>;
      case 'FULLY_LEASED':
        return <span className="badge badge-danger">Fully Leased</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div className="card land-card">
      <div className="land-card-img-wrap">
        <img
          src={land.imageUrl || defaultImage}
          alt={land.title}
          className="land-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="land-card-badge">
          {getStatusBadge(land.status)}
        </div>
      </div>

      <div className="land-card-content">
        <div className="land-card-location">
          <span>📍</span>
          <span>{land.village}, {land.district}, {land.state}</span>
        </div>

        <h3 className="land-card-title">
          <Link to={`/lands/${land.id}`} style={{ color: 'inherit' }}>
            {land.title}
          </Link>
        </h3>

        <div className="land-card-specs">
          <div className="spec-item">
            <span className="spec-label">Available Land</span>
            <span className="spec-value">
              {land.availableAcreage} / {land.totalAcreage} Acres
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Soil Type</span>
            <span className="spec-value">{land.soilType || 'Fertile'}</span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Water Source</span>
            <span className="spec-value" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {land.waterAvailability || 'Available'}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Electricity</span>
            <span className="spec-value">
              {land.electricityAvailability ? '⚡ 3-Phase' : 'Unavailable'}
            </span>
          </div>
        </div>

        <div className="land-card-price-row">
          <div>
            <div className="price-figure">
              ₹{Number(land.rentPerAcrePerYear).toLocaleString('en-IN')}
            </div>
            <div className="price-unit">per acre / year</div>
          </div>

          <Link to={`/lands/${land.id}`} className="btn btn-outline btn-sm">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandCard;

