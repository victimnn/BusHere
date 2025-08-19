import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente reutilizável para itens de configuração com switch
 */
const SettingItem = ({ 
  setting, 
  onToggle,
  disabled = false,
  size = 'col-md-6'
}) => {
  return (
    <div className={size}>
      <div 
        className="border rounded p-3 h-100" 
        style={{ 
          transition: 'all 0.3s ease',
          backgroundColor: disabled ? 'rgba(0,0,0,0.05)' : 'transparent'
        }}
      >
        <div 
          className="d-flex align-items-center justify-content-between"
          style={{ 
            transition: 'all 0.3s ease',
            minHeight: '60px',
            opacity: disabled ? 0.6 : 1
          }}
        >
          <div className="d-flex align-items-center flex-grow-1">
            <div 
              className="bg-light rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" 
              style={{ 
                width: '40px', 
                height: '40px', 
                transition: 'all 0.3s ease' 
              }}
            >
              <i className={`bi ${setting.icon} text-primary fs-6`}></i>
            </div>
            <div className="flex-grow-1">
              <strong className="d-block" style={{ fontSize: '0.95rem' }}>
                {setting.name}
              </strong>
              <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                {setting.description}
              </small>
            </div>
          </div>
          <div className="form-check form-switch ms-3">
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id={`setting-${setting.id}`}
              checked={setting.value === "Ativado"}
              onChange={() => onToggle(setting.id)}
              disabled={disabled}
              style={{ 
                width: '2.5rem', 
                height: '1.3rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SettingItem.propTypes = {
  setting: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.string
};

export default SettingItem;
