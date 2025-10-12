import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ 
  id,
  label,
  description,
  icon,
  iconGradient,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <div 
      className="info-field d-flex align-items-center justify-content-between p-3" 
      style={{ 
        borderRadius: '0.75rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div className="d-flex align-items-center">
        {icon && (
          <div className="icon-circle me-3" style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: iconGradient || 'linear-gradient(135deg, #7781afff 0%, #1e7746ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <i className={`bi bi-${icon} text-white`}></i>
          </div>
        )}
        <div>
          <label className="form-check-label fw-semibold mb-0" htmlFor={id} style={{ cursor: 'pointer' }}>
            {label}
          </label>
          {description && (
            <small className="d-block text-muted" style={{ fontSize: '0.8rem' }}>
              {description}
            </small>
          )}
        </div>
      </div>
      <div className="form-check form-switch m-0">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          style={{ 
            width: '3rem', 
            height: '1.5rem', 
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.string,
  iconGradient: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ToggleSwitch;
