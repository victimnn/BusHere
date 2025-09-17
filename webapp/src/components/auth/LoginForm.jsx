import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ActionButton, FormField, PasswordField } from '../common';

/**
 * Componente de formulário de login
 * Segue padrões de formulários identificados no projeto
 */
const LoginForm = memo(({ 
  formData,
  validation,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
  onGoToRegister
}) => {
  const { email, password, rememberMe } = formData;
  const { emailError, passwordError, isFormValid } = validation;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="needs-validation mb-3">
      <FormField
        id="login-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={onEmailChange}
        required
        placeholder="seu@email.com"
        autoComplete="email"
        disabled={loading}
        error={emailError}
      />

      <PasswordField
        id="login-password"
        label="Senha"
        value={password}
        onChange={onPasswordChange}
        placeholder="Digite sua senha"
        required
        autoComplete="current-password"
        disabled={loading}
        buttonVariant="outline-secondary"
        error={passwordError}
      />

      {/* Opções adicionais mobile-friendly */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-1">
        <div className="form-check d-flex align-items-center">
          <input
            className="form-check-input me-3"
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={onRememberMeChange}
            disabled={loading}
            style={{ 
              transform: 'scale(1.5)',
              accentColor: '#12BE4D'
            }}
          />
          <label 
            className="form-check-label fw-medium mt-1 text-dark mb-0 d-flex" 
            htmlFor="rememberMe"
          >
            Lembrar de mim
          </label>
        </div>
        <Link 
          to="/forgot-password" 
          className="text-decoration-none text-success fs-6 fw-medium"
          style={{ 
            transition: 'all 0.2s ease',
            padding: '4px 8px',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(18, 190, 77, 0.1)';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.textDecoration = 'none';
          }}
        >
          Esqueceu a senha?
        </Link>
      </div>

      {/* Botão de submit mobile-friendly */}
      <ActionButton
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        className="mb-4 fw-semibold"
        disabled={!isFormValid}
        loading={loading}
        icon={!loading ? "bi bi-box-arrow-in-right" : undefined}
        ariaLabel={loading ? "Fazendo login..." : "Entrar na conta"}
      >
        {loading ? "Entrando..." : "Entrar"}
      </ActionButton>

      {/* Divisor mobile-friendly */}
      <div className="position-relative text-center mb-4">
        <hr className="my-3 opacity-25" />
        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small rounded-pill">
          ou
        </span>
      </div>

      {/* Ações secundárias mobile-first */}
      <div className="mb-4">
        <ActionButton
          variant="outline-primary"
          size="lg"
          fullWidth
          className="fw-medium"
          onClick={onGoToRegister}
          disabled={loading}
          icon="bi bi-person-plus"
        >
          Criar nova conta
        </ActionButton>
      </div>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

LoginForm.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    rememberMe: PropTypes.bool.isRequired
  }).isRequired,
  validation: PropTypes.shape({
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
    isFormValid: PropTypes.bool.isRequired
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onRememberMeChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoToRegister: PropTypes.func.isRequired
};

export default LoginForm;