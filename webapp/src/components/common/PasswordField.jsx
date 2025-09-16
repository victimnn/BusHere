import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

/**
 * Campo de senha com botão de mostrar/ocultar e validação opcional.
 */
const PasswordField = ({
  id,
  label = 'Senha',
  value,
  onChange,
  placeholder = 'Digite sua senha',
  required = true,
  autoComplete = 'current-password',
  buttonVariant = 'outline-secondary',
  inputClassName = '',
  disabled = false,
  error,
  success,
  helpText,
  showStrengthIndicator = false,
}) => {
  const [show, setShow] = useState(false);

  // Avalia a força da senha (simples)
  const getPasswordStrength = (password) => {
    if (!password) return null;
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score < 2) return { level: 'weak', text: 'Fraca', color: 'danger' };
    if (score < 4) return { level: 'medium', text: 'Média', color: 'warning' };
    return { level: 'strong', text: 'Forte', color: 'success' };
  };

  const strength = showStrengthIndicator ? getPasswordStrength(value) : null;

  return (
    <div className="password-field-container">
      <FormField
        id={id}
        label={label}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputClassName={inputClassName}
        disabled={disabled}
        error={error}
        success={success}
        helpText={helpText}
      >
        <button
          type="button"
          className={`btn btn-${buttonVariant}`}
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          disabled={disabled}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </FormField>

      {/* Indicador de força da senha */}
      {showStrengthIndicator && strength && value && (
        <div className="password-strength mt-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Força da senha:</small>
            <small className={`text-${strength.color} fw-semibold`}>
              {strength.text}
            </small>
          </div>
          <div className="progress" style={{ height: '4px' }}>
            <div
              className={`progress-bar bg-${strength.color}`}
              role="progressbar"
              style={{ 
                width: strength.level === 'weak' ? '33%' : 
                       strength.level === 'medium' ? '66%' : '100%' 
              }}
              aria-valuenow={
                strength.level === 'weak' ? 33 : 
                strength.level === 'medium' ? 66 : 100
              }
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

PasswordField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  buttonVariant: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  helpText: PropTypes.string,
  showStrengthIndicator: PropTypes.bool,
};

export default PasswordField;
