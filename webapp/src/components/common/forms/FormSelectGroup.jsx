import React from 'react';
import PropTypes from 'prop-types';

const FormSelectGroup = ({ 
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Selecione...',
  required = false,
  disabled = false,
  error,
  colSize = 'col-12'
}) => {
  return (
    <div className={colSize}>
      {label && (
        <label htmlFor={id} className="form-label fw-semibold small text-muted mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-group input-group-lg">
        {icon && (
          <span className="input-group-text bg-light border-end-0">
            <i className={`bi bi-${icon} text-muted`}></i>
          </span>
        )}
        <select
          className={`form-select ${icon ? 'border-start-0 ps-0' : ''} ${error ? 'is-invalid' : ''}`}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          style={{ fontSize: '1rem' }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </select>
        {error && (
          <div className="invalid-feedback">{error}</div>
        )}
      </div>
    </div>
  );
};

FormSelectGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string
  })).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  colSize: PropTypes.string
};

export default FormSelectGroup;
