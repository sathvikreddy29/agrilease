import React from 'react';

export const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getStyleClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`alert-banner ${getStyleClass()}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{getIcon()}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: 0.7,
            padding: '2px 6px'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AlertMessage;

