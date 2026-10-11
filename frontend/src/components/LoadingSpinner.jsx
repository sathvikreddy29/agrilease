import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid var(--primary-pale)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
        {text}
      </span>
    </div>
  );
};

export default LoadingSpinner;

