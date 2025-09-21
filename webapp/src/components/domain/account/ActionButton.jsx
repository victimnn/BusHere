import React from 'react';

const ActionButton = ({ 
  gradient, 
  icon, 
  title, 
  subtitle, 
  onClick,
  className = '' 
}) => {
  return (
    <button 
      className={`action-button btn btn-lg d-flex align-items-center justify-content-between p-3 ${className}`}
      style={{
        background: gradient,
        border: 'none',
        color: 'white'
      }}
      onClick={onClick}
    >
      <div className="d-flex align-items-center">
        <div 
          className="action-icon bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ width: '40px', height: '40px' }}
        >
          <i className={`bi ${icon} text-secondary`}></i>
        </div>
        <div className="text-start">
          <div className="fw-semibold">{title}</div>
          <small className="text-white-50">{subtitle}</small>
        </div>
      </div>
      <i className="bi bi-chevron-right text-white-50"></i>
    </button>
  );
};

export default ActionButton;