import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente de footer para páginas de registro
 * Inclui links para login e termos de uso
 */
const RegisterFooter = memo(({ currentStep, redirect }) => {
  if (currentStep !== 1) return null;

  const loginPath = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';

  return (
    <div className="text-center">
      <p className="mb-3">
        <Link 
          to={loginPath}
          className="text-decoration-none fw-semibold d-inline-block text-success fs-6"
          style={{ padding: "8px 0" }}
        >
          Já possui uma conta? Entre aqui
        </Link>
      </p>
      
      <small className="text-muted d-block lh-sm" style={{ 
        maxWidth: "280px",
        margin: "0 auto"
      }}>
        Ao criar uma conta, você concorda com nossos{" "}
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

RegisterFooter.displayName = 'RegisterFooter';

RegisterFooter.propTypes = {
  currentStep: PropTypes.number.isRequired,
  redirect: PropTypes.string
};

export default RegisterFooter;