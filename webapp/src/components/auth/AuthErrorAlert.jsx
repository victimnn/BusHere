import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de alerta de erro para formulários de autenticação
 * Segue padrões de feedback identificados no projeto
 */
const AuthErrorAlert = memo(({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger d-flex align-items-start mb-3" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2 mt-1 flex-shrink-0"></i>
      <div className="flex-grow-1">
        <span className="small">{error}</span>
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

AuthErrorAlert.displayName = 'AuthErrorAlert';

AuthErrorAlert.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func
};

export default AuthErrorAlert;