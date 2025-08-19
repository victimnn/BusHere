import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para header da página de configurações
 */
const PageHeader = ({ 
  title, 
  description, 
  icon,
  animationDelay = "0s"
}) => {
  return (
    <div 
      className="d-flex align-items-center mb-4 animate__animated animate__fadeInDown"
      style={{ animationDelay }}
    >
      <div 
        className="bg-primary rounded-circle p-3 me-3 shadow d-flex align-items-center justify-content-center" 
        style={{ width: '60px', height: '60px' }}
      >
        <i className={`bi ${icon} text-white fs-4`}></i>
      </div>
      <div>
        <h2 className="mb-1">{title}</h2>
        <p className="text-muted mb-0">{description}</p>
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  animationDelay: PropTypes.string
};

export default PageHeader;
