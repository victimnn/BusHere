import React from 'react';
import AnimatedCounter from '../../features/reports/AnimatedCounter';

const StatCard = ({ 
  title,
  value,
  iconClass,
  gradient = "bg-gradient-primary",
  onClick,
  className = "col-lg-4 col-md-6 mb-4"
}) => {


  return (
    <div className={className}>
      <div
        className={`card border-0 shadow-sm h-100 stats-card card-hover ${gradient}`}
        style={{ 
          cursor: onClick ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title mb-2 opacity-75 fw-normal">{title}</h6>
              <h2 className="fw-bold mb-0 stats-value">
                <AnimatedCounter endValue={value || 0} />
              </h2>
            </div>
            <div className="rounded-circle stats-icon" style={{ 
              background: `rgba(255, 255, 255, 0.2)`,
              border: `2px solid rgba(255, 255, 255, 0.3)`
            }}>
              <i className={iconClass} style={{ 
                color: 'black',
                fontSize: '2.4rem'
              }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
