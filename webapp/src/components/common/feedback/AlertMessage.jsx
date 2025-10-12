import React from 'react';
import PropTypes from 'prop-types';

const AlertMessage = ({ 
  type = 'info', // 'success', 'danger', 'warning', 'info'
  message,
  onClose,
  dismissible = true,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle-fill';
      case 'danger':
        return 'exclamation-triangle-fill';
      case 'warning':
        return 'exclamation-circle-fill';
      case 'info':
        return 'info-circle-fill';
      default:
        return 'info-circle-fill';
    }
  };

  return (
    <div 
      className={`alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} fade show mb-3 shadow-sm ${className}`}
      role="alert" 
      style={{ 
        borderRadius: '1rem',
        border: 'none',
        animation: 'slideDown 0.3s ease'
      }}
    >
      <div className="d-flex align-items-center">
        <i className={`bi bi-${getIcon()} fs-5 me-3`}></i>
        <div className="flex-grow-1">{message}</div>
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
  className: PropTypes.string
};

export default AlertMessage;
