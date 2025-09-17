import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ActionButton } from '../common';

/**
 * Componente de navegação para o formulário de registro
 * Gerencia botões de próximo, anterior e submissão
 */
const RegisterNavigation = memo(({ 
  currentStep,
  totalSteps = 2,
  isStep1Valid,
  isStep2Valid,
  loading,
  onNextStep,
  onPrevStep,
  onSubmit
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      onNextStep();
    } else {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      {currentStep === 2 && (
        <div className="d-grid gap-2 d-md-flex">
          <ActionButton
            type="button"
            variant="outline-secondary"
            size="lg"
            className="mb-2 mb-md-0 me-md-2 w-auto"
            style={{ minWidth: "120px" }}
            onClick={onPrevStep}
            disabled={loading}
            icon="bi bi-arrow-left"
          >
            Voltar
          </ActionButton>
          
          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            className="flex-fill fw-semibold"
            disabled={!isStep2Valid}
            loading={loading}
            icon={!loading ? "bi bi-check-circle" : undefined}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </ActionButton>
        </div>
      )}
      
      {currentStep === 1 && (
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 fw-semibold"
          disabled={!isStep1Valid}
          loading={loading}
          icon={!loading ? "bi bi-arrow-right" : undefined}
        >
          {loading ? "Verificando..." : "Continuar"}
        </ActionButton>
      )}
    </form>
  );
});

RegisterNavigation.displayName = 'RegisterNavigation';

RegisterNavigation.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
  isStep1Valid: PropTypes.bool.isRequired,
  isStep2Valid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default RegisterNavigation;