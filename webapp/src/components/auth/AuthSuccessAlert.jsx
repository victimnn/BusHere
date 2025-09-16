import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de alerta de sucesso para formulários de autenticação
 * Segue padrões de feedback identificados no projeto
 */
const AuthSuccessAlert = memo(({ message, onClose, autoClose = true }) => {
  if (!message) return null;

  // Auto close após 5 segundos se autoClose estiver habilitado
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="alert alert-success d-flex align-items-start mb-3" role="alert">
      <i className="bi bi-check-circle-fill me-2 mt-1 flex-shrink-0"></i>
      <div className="flex-grow-1">
        <span className="small">{message}</span>
      </div>
      {onClose && (
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

AuthSuccessAlert.displayName = 'AuthSuccessAlert';

AuthSuccessAlert.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool
};

export default AuthSuccessAlert;