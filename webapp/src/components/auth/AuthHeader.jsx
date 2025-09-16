import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de cabeçalho para páginas de autenticação
 * Segue padrões de componentes identificados no projeto
 */
const AuthHeader = memo(({ 
  title, 
  subtitle, 
  onClose, 
  loading = false,
  showCloseButton = true 
}) => {
  return (
    <div className="mb-4">
      {/* Top bar com botão fechar */}
      {showCloseButton && (
        <div className="d-flex justify-content-start">
          <button
            className="btn btn-link text-dark p-3"
            onClick={onClose}
            aria-label="Fechar"
            type="button"
            disabled={loading}
            style={{ fontSize: '2.5rem' }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
      
      {/* Título e descrição mobile-first */}
      <div className="text-center">
        <h1 className="fw-bold mb-3 h1">
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

AuthHeader.displayName = 'AuthHeader';

AuthHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.string,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  showCloseButton: PropTypes.bool
};

export default AuthHeader;