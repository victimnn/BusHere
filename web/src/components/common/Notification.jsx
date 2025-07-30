import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ notification, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onClose, 500); // Tempo para a animação de fade-out
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const { message, type } = notification;

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      case 'info':
      default:
        return 'notification-info';
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

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className={`notification-container ${getTypeClasses()} ${exiting ? 'fade-out' : 'fade-in'}`}
      role="alert"
    >
      <div className="d-flex align-items-center notification-content">
        <i className={`bi ${getIcon()} me-3 fs-4`}></i>
        <div className="flex-grow-1">{message}</div>
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="notification-progress-bar"></div>
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
