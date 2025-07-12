import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

function GenericForm({ 
  config, 
  initialData, 
  onSubmit, 
  onCancel,
  onDelete,
  showDeleteButton = false,
  isLoading = false,
  className = '',
  title = null,
  subtitle = null,
  isCreateForm = null
}) {
  const [formData, setFormData] = useState(() => {
    const initialFormData = {};
    config.fields.forEach(field => {
      initialFormData[field.name] = field.defaultValue || '';
    });
    return initialFormData;
  });

  const [errors, setErrors] = useState({});
  const [selectOptions, setSelectOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Memoize field configurations for better performance
  const fieldsConfig = useMemo(() => config.fields, [config.fields]);

  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      const newFormData = {};
      fieldsConfig.forEach(field => {
        let value = initialData[field.name] || initialData[field.alternativeKey] || field.defaultValue || '';
        
        // Aplica transformação reversa se disponível (ex: conversão de datas do banco para formato de exibição)
        if (field.reverseTransform && value) {
          value = field.reverseTransform(value);
        }
        
        newFormData[field.name] = value;
      });
      setFormData(newFormData);
    }
  }, [initialData, fieldsConfig]);

  // Carrega opções para campos select de forma otimizada
  useEffect(() => {
    const loadSelectOptions = async () => {
      const newSelectOptions = {};
      const loadPromises = [];
      
      for (const field of fieldsConfig) {
        if (field.type === 'select') {
          if (field.loadOptions) {
            loadPromises.push(
              field.loadOptions()
                .then(response => {
                  if (response && response.data) {
                    newSelectOptions[field.name] = response.data;
                  }
                })
                .catch(error => {
                  console.error(`Erro ao carregar opções para ${field.name}:`, error);
                  if (field.defaultOptions) {
                    newSelectOptions[field.name] = field.defaultOptions;
                  }
                })
            );
          } else if (field.defaultOptions) {
            newSelectOptions[field.name] = field.defaultOptions;
          }
        }
      }

      if (loadPromises.length > 0) {
        await Promise.all(loadPromises);
      }
      
      setSelectOptions(newSelectOptions);
    };

    loadSelectOptions();
  }, [fieldsConfig]);

  // Encontra a configuração do campo (memoized)
  const getFieldConfig = useCallback((fieldName) => {
    return fieldsConfig.find(field => field.name === fieldName);
  }, [fieldsConfig]);

  // Validação em tempo real otimizada
  const validateField = useCallback((name, value) => {
    const fieldConfig = getFieldConfig(name);
    if (!fieldConfig) return null;

    // Validação de campo obrigatório
    if (fieldConfig.required && (!value || value.toString().trim() === '')) {
      return `${fieldConfig.label} é obrigatório`;
    }

    // Validação customizada
    if (fieldConfig.validator) {
      return fieldConfig.validator(value);
    }

    return null;
  }, [getFieldConfig]);

  // Manipulador de foco nos campos
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Valida apenas campos que foram tocados
    const errorMsg = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
  }, [validateField]);

  // Manipulador de alteração nos campos com validação otimizada
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldConfig = getFieldConfig(name);
    
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Aplica formatação se disponível
    if (fieldConfig && fieldConfig.formatter) {
      processedValue = fieldConfig.formatter(processedValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Valida apenas campos que já foram tocados ou são obrigatórios
    if (touchedFields[name] || fieldConfig?.required) {
      const errorMsg = validateField(name, processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  }, [getFieldConfig, touchedFields, validateField]);

  // Validação do formulário completo
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Valida todos os campos
    fieldsConfig.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fieldsConfig, formData, validateField]);

  // Verifica se o formulário é válido
  const isFormValid = useMemo(() => {
    return fieldsConfig.every(field => {
      const error = validateField(field.name, formData[field.name]);
      return !error;
    });
  }, [fieldsConfig, formData, validateField]);

  // Manipulador de envio do formulário
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    // Marca todos os campos como tocados para mostrar erros
    const allTouched = {};
    fieldsConfig.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouchedFields(allTouched);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Prepara os dados para envio
        let submitData = { ...formData };
        
        // Aplica transformações dos campos (ex: conversão de datas para formato do banco)
        fieldsConfig.forEach(field => {
          if (field.transform && submitData[field.name]) {
            submitData[field.name] = field.transform(submitData[field.name]);
          }
        });
        
        // Transforma latitude e longitude em coordinates array se ambos existirem
        if (submitData.latitude && submitData.longitude) {
          submitData.coordinates = [parseFloat(submitData.latitude), parseFloat(submitData.longitude)];
          delete submitData.latitude;
          delete submitData.longitude;
        }
        
        await onSubmit(submitData);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, isLoading, fieldsConfig, validateForm, formData, onSubmit]);

  // Preenche com dados fake se disponível
  const handleFakeData = useCallback(() => {
    if (config.fakeDataGenerator) {
      const fakeData = config.fakeDataGenerator();
      setFormData(fakeData);
      setErrors({});
      // Marca todos os campos como tocados para permitir validação
      const allTouched = {};
      fieldsConfig.forEach(field => {
        allTouched[field.name] = true;
      });
      setTouchedFields(allTouched);
    }
  }, [config.fakeDataGenerator, fieldsConfig]);

  // Reseta o formulário
  const handleReset = useCallback(() => {
    const resetData = {};
    fieldsConfig.forEach(field => {
      resetData[field.name] = field.defaultValue || '';
    });
    setFormData(resetData);
    setErrors({});
    setTouchedFields({});
  }, [fieldsConfig]);

  // Renderiza um campo baseado no tipo
  const renderField = useCallback((field) => {
    const error = errors[field.name];
    const value = formData[field.name] || '';
    const isFieldTouched = touchedFields[field.name];
    const showError = error && isFieldTouched;

    const inputGroupClass = `input-group${field.size ? ` input-group-${field.size}` : ''}`;
    const inputClass = `form-control${field.size ? ` form-control-${field.size}` : ''} ${showError ? 'is-invalid' : value ? 'is-valid' : ''}`;
    
    // Componente de ajuda/dica
    const helpText = field.helpText && (
      <div className="form-text text-muted">
        <i className="bi bi-info-circle me-1"></i>
        {field.helpText}
      </div>
    );

    switch (field.type) {
      case 'hidden':
        return (
          <input
            key={field.name}
            type="hidden"
            id={field.name}
            name={field.name}
            value={value}
          />
        );

      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'url':
      case 'tel':
      case 'date':
      case 'datetime-local':
      case 'time':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>
            <div className={inputGroupClass}>
              <span className="input-group-text bg-light">
                <i className={field.inputIcon}></i>
              </span>
              <input
                type={field.type}
                className={inputClass}
                id={field.name}
                name={field.name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                min={field.min}
                max={field.max}
                step={field.step}
                pattern={field.pattern}
                autoComplete={field.autoComplete}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              />
              {showError && <div className="invalid-feedback">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="mb-4">
            <div className="form-check">
              <input
                className={`form-check-input ${showError ? 'is-invalid' : ''}`}
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              />
              <label className="form-check-label fw-semibold" htmlFor={field.name}>
                <i className={`${field.labelIcon} me-2 text-primary`}></i>
                {field.label}
                {field.required && <span className="text-danger ms-1">*</span>}
              </label>
              {showError && <div className="invalid-feedback d-block">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>
            <div className={inputGroupClass}>
              <span className="input-group-text bg-light">
                <i className={field.inputIcon}></i>
              </span>
              <select
                className={inputClass}
                id={field.name}
                name={field.name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              >
                <option value="">{field.placeholder || 'Selecione uma opção'}</option>
                {(selectOptions[field.name] || []).map((option) => (
                  <option key={option[field.optionValue]} value={option[field.optionValue]}>
                    {option[field.optionLabel]}
                  </option>
                ))}
              </select>
              {showError && <div className="invalid-feedback">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>
            <div className={inputGroupClass}>
              <span className="input-group-text bg-light">
                <i className={field.inputIcon}></i>
              </span>
              <textarea
                className={inputClass}
                id={field.name}
                name={field.name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                maxLength={field.maxLength}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              />
              {showError && <div className="invalid-feedback">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>
            <div className={inputGroupClass}>
              <span className="input-group-text bg-light">
                <i className={field.inputIcon}></i>
              </span>
              <input
                type="file"
                className={inputClass}
                id={field.name}
                name={field.name}
                onChange={handleChange}
                onBlur={handleBlur}
                accept={field.accept}
                multiple={field.multiple}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              />
              {showError && <div className="invalid-feedback">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      default:
        return null;
    }
  }, [formData, errors, touchedFields, selectOptions, handleChange, handleBlur, isLoading]);

  return (
    <div className={`card border-0 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="card-header bg-gradient-primary text-white">
          {title && <h5 className="card-title mb-0">{title}</h5>}
          {subtitle && <p className="card-text mb-0 opacity-75">{subtitle}</p>}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card-body p-4" noValidate>
        {/* Indicador de progresso */}
        {isSubmitting && (
          <div className="progress mb-3" style={{ height: '3px' }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" 
                 style={{ width: '100%' }}>
            </div>
          </div>
        )}

        {/* Renderiza campos agrupados se especificado */}
        {config.groups ? (
          config.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {group.title && (
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <i className={`${group.icon} me-2`}></i>
                  {group.title}
                </h6>
              )}
              <div className={`row ${group.columns ? `row-cols-${group.columns}` : ''}`}>
                {group.fields.map(fieldName => {
                  const field = fieldsConfig.find(f => f.name === fieldName);
                  return field ? (
                    <div key={fieldName} className={group.columns ? 'col' : ''}>
                      {renderField(field)}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))
        ) : (
          // Renderiza campos normalmente
          <div className="row">
            {fieldsConfig.map(field => (
              <div key={field.name} className={field.colClass || 'col-12'}>
                {renderField(field)}
              </div>
            ))}
          </div>
        )}
        
        {/* Botões auxiliares */}
        {(config.fakeDataGenerator || true) && (
          <div className="d-flex justify-content-start gap-2 mb-3">
            {config.fakeDataGenerator && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={handleFakeData}
                disabled={isSubmitting || isLoading}
              >
                <i className="bi bi-shuffle me-1"></i>
                Dados Exemplo
              </button>
            )}
            
            <button
              type="button"
              className="btn btn-outline-info btn-sm px-3"
              onClick={handleReset}
              disabled={isSubmitting || isLoading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Limpar
            </button>
          </div>
        )}
        
        <hr className="my-4" />
        
        {/* Botões principais */}
        <div className="d-flex justify-content-end gap-3">
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-lg px-5" 
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            style={{ minWidth: '140px' }}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary text-white btn-lg px-5"
            disabled={isSubmitting || isLoading || !isFormValid}
            style={{ minWidth: '140px' }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processando...
              </>
            ) : (
              <>
                <i className={`bi ${initialData && !isCreateForm ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                {(initialData && !isCreateForm) ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </button>

          {showDeleteButton && onDelete && initialData && (
            <button
              type="button"
              className="btn btn-outline-danger btn-lg px-5"
              onClick={onDelete}
              disabled={isSubmitting || isLoading}
              style={{ minWidth: '140px' }}
            >
              <i className="bi bi-trash me-2"></i>
              Deletar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

GenericForm.propTypes = {
  config: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf([
          'text', 'email', 'number', 'password', 'url', 'tel', 'date', 
          'datetime-local', 'time', 'select', 'textarea', 'checkbox', 
          'file', 'hidden'
        ]).isRequired,
        label: PropTypes.string.isRequired,
        labelIcon: PropTypes.string,
        inputIcon: PropTypes.string,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        validator: PropTypes.func,
        formatter: PropTypes.func,
        transform: PropTypes.func,
        reverseTransform: PropTypes.func,
        maxLength: PropTypes.number,
        min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        pattern: PropTypes.string,
        size: PropTypes.oneOf(['sm', 'lg']),
        colClass: PropTypes.string,
        defaultValue: PropTypes.any,
        helpText: PropTypes.string,
        disabled: PropTypes.bool,
        autoComplete: PropTypes.string,
        // Para campos select
        loadOptions: PropTypes.func,
        defaultOptions: PropTypes.array,
        optionValue: PropTypes.string,
        optionLabel: PropTypes.string,
        // Para textarea
        rows: PropTypes.number,
        // Para arquivos
        accept: PropTypes.string,
        multiple: PropTypes.bool,
        // Props adicionais
        additionalProps: PropTypes.object,
        alternativeKey: PropTypes.string
      })
    ).isRequired,
    fakeDataGenerator: PropTypes.func,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string).isRequired,
        columns: PropTypes.number
      })
    )
  }).isRequired,  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isCreateForm: PropTypes.bool
};

export default GenericForm;
