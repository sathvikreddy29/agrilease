import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '12px' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px auto' }}>
          Your current account role (<strong>{user?.role}</strong>) does not have permission to view this section.
        </p>
        <a href="/" className="btn btn-primary">
          Return to Home
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

