import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de card informativo reutilizável
 * Suporta header, conteúdo e opcionalmente footer
 */
const InfoCard = ({ 
  header, 
  children, 
  footer, 
  variant = 'default', 
  className = '',
  shadow = true,
  border = false
}) => {
  const getCardClasses = () => {
    let classes = 'card';
    
    if (variant === 'light') {
      classes += ' bg-light';
    }
    
    if (!border) {
      classes += ' border-0';
    }
    
    if (shadow) {
      classes += ' shadow-sm';
    }
    
    return `${classes} ${className}`;
  };

  const getHeaderClasses = () => {
    let classes = 'card-header';
    
    if (variant === 'light') {
      classes += ' bg-light border-0';
    }
    
    return classes;
  };

  return (
    <div className={getCardClasses()}>
      {header && (
        <div className={getHeaderClasses()}>
          <h6 className="mb-0 fw-bold">
            {header.icon && (
              <i className={`${header.icon} me-2 text-primary`}></i>
            )}
            {header.title}
          </h6>
        </div>
      )}
      
      <div className="card-body p-3">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer bg-transparent border-0 pt-0">
          {footer}
        </div>
      )}
    </div>
  );
};

InfoCard.propTypes = {
  header: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.string.isRequired
  }),
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'light']),
  className: PropTypes.string,
  shadow: PropTypes.bool,
  border: PropTypes.bool
};

export default InfoCard;
