import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <div 
      className={`alert ${getTypeClasses()} alert-dismissible fade show position-fixed`}
      style={{ 
        top: '20px', 
        right: '20px', 
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px'
      }}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <i className={`bi ${getIcon()} me-2 fs-5`}></i>
        <div className="flex-grow-1">{message}</div>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired
  }),
  onClose: PropTypes.func.isRequired
};

export default Notification;
