import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de botão de ação reutilizável
 * Suporta diferentes variantes, tamanhos e ícones
 */
const ActionButton = ({ 
  children, 
  icon, 
  variant = 'outline-primary', 
  size = 'sm',
  onClick, 
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button'
}) => {
  const getButtonClasses = () => {
    let classes = `btn btn-${variant} btn-${size}`;
    
    if (fullWidth) {
      classes += ' w-100';
    }
    
    return `${classes} ${className}`;
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <i className={`${icon} me-2`}></i>
      )}
      {children}
    </button>
  );
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
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default ActionButton;
