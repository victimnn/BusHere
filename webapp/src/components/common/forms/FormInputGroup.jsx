import React from 'react';
import PropTypes from 'prop-types';
import { useInputIconAnimation } from '../../../hooks';

const FormInputGroup = ({ 
  id,
  label, 
  icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  maxLength,
  isLoading,
  children,
  colSize = 'col-12',
  inputStyle = {}
}) => {
  const { handleFocus: animateFocus, handleBlur: animateBlur } = useInputIconAnimation();

  return (
    <div className={colSize}>
      {label && (
        <label htmlFor={id} className="form-label fw-semibold small text-muted mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-group input-group-lg">
        {icon && (
          <span 
            className="input-group-text bg-light border-end-0" 
            style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <i className={`bi bi-${icon} text-muted`}></i>
          </span>
        )}
        <input
          type={type}
          className={`form-control ${icon ? 'border-start-0 ps-0' : ''} ${error ? 'is-invalid' : ''}`}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={(e) => animateBlur(e, onBlur)}
          onFocus={(e) => animateFocus(e, onFocus)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          style={{ 
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            ...inputStyle
          }}
        />
        {isLoading && (
          <span className="input-group-text bg-light border-start-0">
            <span className="spinner-border spinner-border-sm text-primary"></span>
          </span>
        )}
        {children}
        {error && (
          <div className="invalid-feedback">{error}</div>
        )}
      </div>
      {helpText && !error && (
        <small className="text-muted" style={{ fontSize: '0.8rem' }}>
          <i className="bi bi-info-circle me-1"></i>
          {helpText}
        </small>
      )}
    </div>
  );
};

FormInputGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  maxLength: PropTypes.string,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  colSize: PropTypes.string,
  inputStyle: PropTypes.object
};

export default FormInputGroup;
