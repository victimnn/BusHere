import React from 'react';
import PropTypes from 'prop-types';

const FormActionButtons = ({ 
  onClick,
  label = 'Botão',
  icon = 'bi-check-circle-fill',
  loading = false,
  disabled = false,
  loadingText = 'Carregando...',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success'
  className = '',
  type = 'button',
  fullWidth = true
}) => {
  const getGradient = () => {
    if (loading || disabled) {
      return 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)';
    }
    
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, var(--bs-primary) 0%, #0E8F3A 100%)';
      case 'success':
        return 'linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)';
      case 'danger':
        return 'linear-gradient(135deg, #ff4757 0%, #c44569 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      default:
        return 'linear-gradient(135deg, var(--bs-primary) 0%, #0E8F3A 100%)';
    }
  };

  const getShadowColor = () => {
    switch (variant) {
      case 'primary':
        return 'rgba(18, 190, 77, 0.3)';
      case 'success':
        return 'rgba(18, 190, 77, 0.3)';
      case 'danger':
        return 'rgba(255, 71, 87, 0.3)';
      case 'secondary':
        return 'rgba(102, 126, 234, 0.3)';
      default:
        return 'rgba(18, 190, 77, 0.3)';
    }
  };

  const handleMouseEnter = (e) => {
    if (!loading && !disabled) {
      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 8px 24px ${getShadowColor()}`;
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1) translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseDown = (e) => {
    if (!loading && !disabled) {
      e.currentTarget.style.transform = 'scale(0.98)';
    }
  };

  const handleMouseUp = (e) => {
    if (!loading && !disabled) {
      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-lg shadow-sm ${fullWidth ? 'w-100' : ''} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
      style={{
        background: getGradient(),
        border: 'none',
        color: 'white',
        fontWeight: '600',
        padding: '1rem',
        borderRadius: '1rem',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1,
        transform: 'scale(1)',
        cursor: (loading || disabled) ? 'not-allowed' : 'pointer'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {loading ? (
        <>
          <span 
            className="spinner-border spinner-border-sm me-2" 
            style={{ animation: 'spin 0.8s linear infinite' }}
          ></span>
          {loadingText}
        </>
      ) : (
        <>
          <i className={`bi ${icon} me-2`}></i>
          {label}
        </>
      )}
    </button>
  );
};

FormActionButtons.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  icon: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  loadingText: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool
};

export default FormActionButtons;
