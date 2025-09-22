import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de botão de ação reutilizável
 * Suporta diferentes variantes, tamanhos, ícones e estados de loading
 */
const ActionButton = ({ 
  children, 
  icon, 
  variant = 'outline-primary', 
  size = 'sm',
  onClick, 
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  type = 'button',
  ariaLabel,
  tooltip,
  ...rest
}) => {
  const getButtonClasses = () => {
    let classes = `btn btn-${variant}`;
    
    // Tamanho
    if (size !== 'md') {
      classes += ` btn-${size}`;
    }
    
    // Largura total
    if (fullWidth) {
      classes += ' w-100';
    }

    // Estado de loading
    if (loading) {
      classes += ' position-relative';
    }
    
    return `${classes} ${className}`.trim();
  };

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const buttonContent = (
    <>
      {loading && (
        <span className="position-absolute top-50 start-50 translate-middle">
          <span 
            className="spinner-border spinner-border-sm" 
            role="status" 
            aria-hidden="true"
          ></span>
        </span>
      )}
      
      <span className={loading ? 'opacity-0' : ''}>
        {icon && !loading && (
          <i className={`${icon} ${children ? 'me-2' : ''}`}></i>
        )}
        {children}
      </span>
    </>
  );

  const button = (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...rest}
    >
      {buttonContent}
    </button>
  );

  // Se houver tooltip, envolver com span para o tooltip
  if (tooltip && !disabled && !loading) {
    return (
      <span 
        data-bs-toggle="tooltip" 
        data-bs-placement="top" 
        title={tooltip}
      >
        {button}
      </span>
    );
  }

  return button;
};

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 
    'outline-warning', 'outline-info', 'outline-light', 'outline-dark'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  tooltip: PropTypes.string,
};

export default ActionButton;
