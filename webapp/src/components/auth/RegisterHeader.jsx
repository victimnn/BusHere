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
  onPrevStep,
  loading = false 
}) => {
  const handleBackClick = () => {
    if (currentStep === 2 && onPrevStep) {
      onPrevStep();
    } else {
      onBack();
    }
  };

  return (
    <div className="mb-3 mb-md-4">
      {/* Top bar com botão voltar e progresso */}
      <div className="d-flex align-items-center mb-3">
        {/* Botão voltar com largura fixa */}
        <div style={{ width: "40px" }}>
          <button
            className="btn btn-link text-dark p-0 fs-4"
            onClick={handleBackClick}
            aria-label="Voltar"
            type="button"
            disabled={loading}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
        
        {/* Indicador de progresso centralizado */}
        <div className="flex-grow-1 mx-3">
          <div className="progress" style={{ height: "8px" }}>
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
        </div>

        {/* Contador de etapas com largura fixa */}
        <div style={{ width: "40px" }} className="text-end">
          <small className="text-muted fw-medium">{currentStep}/{totalSteps}</small>
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
  onPrevStep: PropTypes.func,
  loading: PropTypes.bool
};

export default RegisterHeader;