import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="container page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌾</div>
      <h1 className="page-title" style={{ fontSize: '36px', marginBottom: '12px' }}>
        404 - Farmland Page Not Found
      </h1>
      <p className="page-subtitle" style={{ maxWidth: '480px', margin: '0 auto 28px auto' }}>
        The agricultural listing or page you requested does not exist or has been relocated.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
        <Link to="/lands" className="btn btn-outline">
          Browse Farmlands
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

