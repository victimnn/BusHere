import React from 'react';
import PropTypes from 'prop-types';

/**
 * Campo de formulário reutilizável com label, input Bootstrap e suporte a validação.
 */
const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = '',
  inputClassName = '',
  disabled = false,
  error,
  success,
  helpText,
  children, // para addons (ex: ícones) via input-group
  inputProps = {},
}) => {
  // Determina as classes de validação
  const getValidationClass = () => {
    if (error) return 'is-invalid';
    if (success) return 'is-valid';
    return '';
  };

  const inputElement = (
    <input
      id={id}
      type={type}
      className={`form-control ${inputClassName} ${getValidationClass()}`}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      aria-describedby={helpText ? `${id}-help` : undefined}
      {...inputProps}
    />
  );

  const hasAddons = Boolean(children);

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label font-family-segundaria">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {hasAddons ? (
        <div className="input-group">
          {inputElement}
          {children}
        </div>
      ) : (
        inputElement
      )}

      {/* Mensagens de feedback */}
      {error && (
        <div className="invalid-feedback d-block">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error}
        </div>
      )}
      
      {success && (
        <div className="valid-feedback d-block">
          <i className="bi bi-check-circle me-1"></i>
          {success}
        </div>
      )}

      {/* Texto de ajuda */}
      {helpText && !error && !success && (
        <div id={`${id}-help`} className="form-text">
          {helpText}
        </div>
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  helpText: PropTypes.string,
  children: PropTypes.node,
  inputProps: PropTypes.object,
};

export default FormField;
