import React from 'react';
import PropTypes from 'prop-types';

const FormSection = ({ 
  title, 
  icon,
  iconGradient,
  description,
  children,
  className = ''
}) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-12">
        <div 
          className={`modern-card card border-0 shadow-sm ${className}`}
          style={{
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
          }}
        >
          <div className="card-body p-3 p-sm-4">
            <h6 className={`${description ? 'mb-2' : 'mb-3 mb-sm-4'} fw-bold d-flex align-items-center`}>
              {icon && (
                <div className="icon-wrapper me-2" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: iconGradient || 'linear-gradient(135deg, var(--bs-primary) 0%, #0E8F3A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <i className={`bi bi-${icon} text-white`}></i>
                </div>
              )}
              <span>{title}</span>
            </h6>
            {description && (
              <p className="text-muted small mb-3 mb-sm-4" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                {description}
              </p>
            )}
            <div className="row g-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconGradient: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default FormSection;
