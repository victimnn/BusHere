import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Carregando...', 
  centered = true,
  className = '',
  variant = 'primary'
}) => {
  const sizeClasses = {
    small: { width: '1.5rem', height: '1.5rem' },
    medium: { width: '2.5rem', height: '2.5rem' },
    large: { width: '3rem', height: '3rem' }
  };

  const containerClasses = centered 
    ? "d-flex flex-column justify-content-center align-items-center my-5 py-5"
    : "d-flex align-items-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`spinner-border text-${variant} mb-3`} 
        role="status"
        style={sizeClasses[size]}
      >
        <span className="visually-hidden">Carregando...</span>
      </div>
      {message && (
        <p className="text-muted mb-0">{message}</p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  centered: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])
};

export default LoadingSpinner;
