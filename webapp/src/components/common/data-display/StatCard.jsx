import React from 'react';

const StatCard = ({ 
  icon, 
  iconColor = 'text-info', 
  bgColor = 'bg-info', 
  label, 
  value, 
  valueColor = '',
  colClass = 'col-6' 
}) => {
  return (
    <div className={colClass}>
      <div className="stat-card card border-0 shadow-sm text-center">
        <div className="card-body p-3">
          <div 
            className={`stat-icon ${bgColor} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2`}
            style={{ width: '48px', height: '48px' }}
          >
            <i className={`bi ${icon} ${iconColor}`}></i>
          </div>
          <small className="text-muted d-block">{label}</small>
          <small className={`fw-bold ${valueColor}`}>
            {value}
          </small>
        </div>
      </div>
    </div>
  );
};

export default StatCard;