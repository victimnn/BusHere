import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de footer para páginas de autenticação
 * Segue padrões de componentes identificados no projeto
 */
const AuthFooter = memo(() => {
  return (
    <div className="text-center">
      <small className="text-muted d-block lh-sm" style={{ maxWidth: "280px", margin: "0 auto" }}>
        Ao entrar, você concorda com nossos{" "}
        <Link to="/terms" className="text-decoration-none text-muted">
          <u>Termos de Uso</u>
        </Link>{" "}
        e{" "}
        <Link to="/privacy" className="text-decoration-none text-muted">
          <u>Política de Privacidade</u>
        </Link>
      </small>
    </div>
  );
});

AuthFooter.displayName = 'AuthFooter';

export default AuthFooter;