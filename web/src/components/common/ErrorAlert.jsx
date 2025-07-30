import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({ 
  error, 
  onRetry = null, 
  onDismiss = null,
  variant = 'danger',
  icon = 'bi-exclamation-triangle-fill',
  className = ''
}) => {
  if (!error) return null;

  return (
    <div className={`alert alert-${variant} d-flex align-items-center mb-4 ${className}`} role="alert">
      <i className={`bi ${icon} me-2 fs-5`}></i>
      <div className="flex-grow-1">
        {typeof error === 'string' ? error : error.message || 'Ocorreu um erro inesperado'}
      </div>
      <div className="d-flex gap-2 ms-3">
        {onRetry && (
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={onRetry}
            type="button"
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Tentar Novamente
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="btn-close"
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
};

ErrorAlert.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  icon: PropTypes.string,
  className: PropTypes.string
};

export default ErrorAlert;
