import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de badge de status reutilizável
 * Suporta diferentes tipos de status com cores automáticas
 */
const StatusBadge = ({ 
  status, 
  text, 
  variant = 'auto',
  size = 'default',
  className = ''
}) => {
  const getStatusClasses = () => {
    if (variant === 'auto') {
      // Mapeamento automático baseado no status
      const statusMap = {
        pending: 'bg-warning text-dark',
        paid: 'bg-success text-white',
        overdue: 'bg-danger text-white',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-dark',
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        active: 'bg-success text-white',
        inactive: 'bg-secondary text-white',
        default: 'bg-secondary text-white'
      };
      
      return statusMap[status] || statusMap.default;
    }
    
    return variant;
  };

  const getSizeClasses = () => {
    const sizeMap = {
      small: 'badge-sm',
      default: '',
      large: 'badge-lg'
    };
    
    return sizeMap[size];
  };

  return (
    <span className={`badge ${getStatusClasses()} ${getSizeClasses()} ${className}`}>
      {text || status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  text: PropTypes.string,
  variant: PropTypes.oneOf([
    'auto',
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 
    'bg-warning', 'bg-info', 'bg-light', 'bg-dark',
    'bg-warning text-dark', 'bg-info text-dark', 'bg-success text-white'
  ]),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string
};

export default StatusBadge;
