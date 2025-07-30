import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ActionButton = memo(({ 
  onClick, 
  icon, 
  text, 
  variant = 'primary', 
  size = 'lg',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} d-flex align-items-center ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <span>Processando...</span>
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`}></i>}
          <span>{text}</span>
        </>
      )}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'info', 'light', 'dark', 'outline-primary'
  ]),
  size: PropTypes.oneOf(['sm', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default ActionButton;
