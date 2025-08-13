import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente reutilizável para seções de configuração
 */
const SettingSection = ({ 
  title, 
  description, 
  icon, 
  iconBg = "bg-primary",
  children,
  animationDelay = "0s"
}) => {
  return (
    <div 
      className="card p-4 mb-4 shadow-sm border-0 animate__animated animate__fadeInUp" 
      style={{ animationDelay }}
    >
      <div className="d-flex align-items-center mb-4">
        <div 
          className={`${iconBg} rounded-circle p-3 me-3 shadow-sm d-flex align-items-center justify-content-center`} 
          style={{ width: '50px', height: '50px' }}
        >
          <i className={`bi ${icon} text-white fs-4`}></i>
        </div>
        <div className="flex-grow-1">
          <h4 className="mb-1">{title}</h4>
          <p className="text-muted mb-0">{description}</p>
        </div>
      </div>
      
      <div className="row">
        {children}
      </div>
    </div>
  );
};

SettingSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconBg: PropTypes.string,
  children: PropTypes.node.isRequired,
  animationDelay: PropTypes.string
};

export default SettingSection;
