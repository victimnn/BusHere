import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de feedback de status do registro
 * Mostra loading, sucesso e erro durante o processo de cadastro
 */
const RegistrationStatusAlert = memo(({ 
  status, 
  message, 
  onClose,
  showProgress = false 
}) => {
  if (!status) return null;

  const getAlertClass = () => {
    switch (status) {
      case 'loading':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="spinner-border spinner-border-sm me-2 mt-1" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        );
      case 'success':
        return <i className="bi bi-check-circle-fill me-2 mt-1 text-success"></i>;
      case 'error':
        return <i className="bi bi-exclamation-triangle-fill me-2 mt-1 text-danger"></i>;
      default:
        return <i className="bi bi-info-circle-fill me-2 mt-1"></i>;
    }
  };

  const getDefaultMessage = () => {
    switch (status) {
      case 'loading':
        return 'Criando sua conta... Por favor, aguarde.';
      case 'success':
        return '🎉 Conta criada com sucesso! Redirecionando para o login...';
      case 'error':
        return 'Erro ao criar conta. Verifique os dados e tente novamente.';
      default:
        return '';
    }
  };

  return (
    <div className={`alert ${getAlertClass()} d-flex align-items-start mb-3`} role="alert">
      {getIcon()}
      <div className="flex-grow-1">
        <span className="small">{message || getDefaultMessage()}</span>
        {showProgress && status === 'loading' && (
          <div className="progress mt-2" style={{ height: '3px' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: '100%' }}
            ></div>
          </div>
        )}
      </div>
      {onClose && status !== 'loading' && (
        <button
          type="button"
          className="btn-close btn-close-sm ms-2"
          aria-label="Fechar alerta"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
});

RegistrationStatusAlert.displayName = 'RegistrationStatusAlert';

RegistrationStatusAlert.propTypes = {
  status: PropTypes.oneOf(['loading', 'success', 'error']),
  message: PropTypes.string,
  onClose: PropTypes.func,
  showProgress: PropTypes.bool
};

export default RegistrationStatusAlert;