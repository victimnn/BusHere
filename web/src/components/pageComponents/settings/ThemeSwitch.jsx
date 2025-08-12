import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para switch de tema (modo escuro/claro)
 */
const ThemeSwitch = ({ 
  isDark, 
  onToggle,
  animationDelay = "0s"
}) => {
  return (
    <div 
      className="card p-4 mb-4 shadow-sm border-0 animate__animated animate__fadeInUp" 
      style={{ animationDelay }}
    >
      <div className="d-flex align-items-center mb-4">
        <div 
          className="bg-info rounded-circle p-3 me-3 shadow-sm d-flex align-items-center justify-content-center" 
          style={{ width: '50px', height: '50px' }}
        >
          <i className="bi bi-palette text-white fs-4"></i>
        </div>
        <div className="flex-grow-1">
          <h4 className="mb-1">Aparência</h4>
          <p className="text-muted mb-0">Configure o visual do sistema</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div 
            className="d-flex align-items-center justify-content-between py-3 px-3 border rounded" 
            style={{ 
              transition: 'all 0.3s ease', 
              backgroundColor: 'rgba(0,123,255,0.03)' 
            }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="bg-light rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  transition: 'all 0.3s ease' 
                }}
              >
                <i 
                  className={`bi ${isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill'} text-primary fs-4`} 
                  style={{ transition: 'all 0.3s ease' }}
                ></i>
              </div>
              <div>
                <strong className="d-block fs-5">
                  Modo {isDark ? 'Escuro' : 'Claro'}
                </strong>
                <small className="text-muted">
                  {isDark ? 'Tema escuro ativo' : 'Tema claro ativo'}
                </small>
              </div>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="darkModeSwitch"
                checked={isDark}
                onChange={onToggle}
                style={{ 
                  width: '3.5rem', 
                  height: '1.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ThemeSwitch.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  animationDelay: PropTypes.string
};

export default ThemeSwitch;
