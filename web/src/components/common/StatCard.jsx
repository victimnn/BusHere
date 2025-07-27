import React from 'react';
import AnimatedCounter from '../reports/AnimatedCounter';

const StatCard = ({ 
  title, 
  value, 
  iconClass, 
  gradient, 
  onClick, 
  className = "col-lg-4 col-md-6 mb-4" 
}) => {
  return (
    <div className={className}>
      <div 
        className="card border-0 shadow-sm h-100 stats-card card-hover" 
        style={{
          background: gradient, 
          cursor: onClick ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        <div className="card-body text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title mb-2 opacity-75 fw-normal">{title}</h6>
              <h2 className="fw-bold mb-0 stats-value">
                <AnimatedCounter endValue={value || 0} />
              </h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-circle stats-icon">
              <i className={iconClass}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
