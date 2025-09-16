import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de cabeçalho para páginas de registro
 * Inclui indicador de progresso e navegação
 */
const RegisterHeader = memo(({ 
  currentStep, 
  totalSteps = 2, 
  title, 
  subtitle, 
  onBack, 
  loading = false 
}) => {
  return (
    <div className="mb-3 mb-md-4">
      {/* Top bar com botão voltar e progresso */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          className="btn btn-link text-dark p-0 fs-4"
          onClick={onBack}
          aria-label="Voltar"
          type="button"
          disabled={loading}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        
        {/* Indicador de progresso mobile */}
        <div className="flex-grow-1 mx-3">
          <div className="progress" style={{ height: "6px" }}>
            <div 
              className="progress-bar bg-success" 
              style={{ 
                width: `${(currentStep / totalSteps) * 100}%`,
                transition: "width 0.3s ease"
              }}
              aria-valuenow={currentStep}
              aria-valuemin="1"
              aria-valuemax={totalSteps}
            ></div>
          </div>
          <div className="text-end mt-1">
            <small className="text-muted fw-medium">{currentStep}/{totalSteps}</small>
          </div>
        </div>
      </div>
      
      {/* Título e descrição mobile-first */}
      <div className="text-center">
        <h1 className="fw-bold mb-2 h3-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted mb-0 fs-6">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
});

RegisterHeader.displayName = 'RegisterHeader';

RegisterHeader.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default RegisterHeader;