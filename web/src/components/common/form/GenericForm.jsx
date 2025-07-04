import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function GenericForm({ 
  config, 
  initialData, 
  onSubmit, 
  onCancel,
  onDelete,
  showDeleteButton = false
}) {
  const [formData, setFormData] = useState(() => {
    const initialFormData = {};
    config.fields.forEach(field => {
      initialFormData[field.name] = '';
    });
    return initialFormData;
  });

  const [errors, setErrors] = useState({});
  const [selectOptions, setSelectOptions] = useState({});

  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      const newFormData = {};
      config.fields.forEach(field => {
        newFormData[field.name] = initialData[field.name] || initialData[field.alternativeKey] || '';
      });
      setFormData(newFormData);
    }
  }, [initialData, config.fields]);

  // Carrega opções para campos select
  useEffect(() => {
    const loadSelectOptions = async () => {
      const newSelectOptions = {};
      
      for (const field of config.fields) {
        if (field.type === 'select' && field.loadOptions) {
          try {
            const response = await field.loadOptions();
            if (response && response.data) {
              newSelectOptions[field.name] = response.data;
            }
          } catch (error) {
            console.error(`Erro ao carregar opções para ${field.name}:`, error);
            if (field.defaultOptions) {
              newSelectOptions[field.name] = field.defaultOptions;
            }
          }
        }
      }
      
      setSelectOptions(newSelectOptions);
    };

    loadSelectOptions();
  }, [config.fields]);

  // Encontra a configuração do campo
  const getFieldConfig = (fieldName) => {
    return config.fields.find(field => field.name === fieldName);
  };

  // Validação em tempo real
  const validateField = (name, value) => {
    const fieldConfig = getFieldConfig(name);
    if (!fieldConfig || !fieldConfig.validator) return null;
    return fieldConfig.validator(value);
  };

  // Manipulador de alteração nos campos com validação
  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldConfig = getFieldConfig(name);
    
    let processedValue = value;
    
    // Aplica formatação se disponível
    if (fieldConfig && fieldConfig.formatter) {
      processedValue = fieldConfig.formatter(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Valida o campo somente se o usuário já começou a digitar algo
    if (processedValue || fieldConfig?.required) {
      const errorMsg = validateField(name, processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    } else {
      // Limpa o erro quando o usuário apaga tudo
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validação do formulário completo
  const validateForm = () => {
    const newErrors = {};
    
    // Valida todos os campos
    config.fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepara os dados para envio
      let submitData = { ...formData };
      
      // Transforma latitude e longitude em coordinates array se ambos existirem
      if (submitData.latitude && submitData.longitude) {
        submitData.coordinates = [parseFloat(submitData.latitude), parseFloat(submitData.longitude)];
        delete submitData.latitude;
        delete submitData.longitude;
      }
      
      onSubmit(submitData);
    }
  };

  // Preenche com dados fake se disponível
  const handleFakeData = () => {
    if (config.fakeDataGenerator) {
      setFormData(config.fakeDataGenerator());
      setErrors({});
    }
  };

  // Renderiza um campo baseado no tipo
  const renderField = (field) => {
    const error = errors[field.name];
    const value = formData[field.name];

    const inputGroupClass = `input-group${field.size ? ` input-group-${field.size}` : ''}`;
    const inputClass = `form-control${field.size ? ` form-control-${field.size}` : ''} ${error ? 'is-invalid' : ''}`;    switch (field.type) {
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
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
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
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                {...(field.additionalProps || {})}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
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
              >
                <option value="">{field.placeholder}</option>
                {(selectOptions[field.name] || []).map((option) => (
                  <option key={option[field.optionValue]} value={option[field.optionValue]}>
                    {option[field.optionLabel]}
                  </option>
                ))}
              </select>
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="form-label fw-semibold">
              <i className={`${field.labelIcon} me-2 text-primary`}></i>
              {field.label}
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
                placeholder={field.placeholder}
                rows={field.rows || 3}
                {...(field.additionalProps || {})}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card border-0">
      <form onSubmit={handleSubmit} className="card-body p-4">
        {config.fields.map(field => renderField(field))}
        
        <hr className="my-4" />
          <div className="d-flex justify-content-end gap-3 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-lg px-4" 
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary text-white btn-lg px-4"
          >
            <i className={`bi ${initialData ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
            {initialData ? 'Atualizar' : 'Cadastrar'} 
          </button>

          {showDeleteButton && onDelete && initialData && (
            <button
              type="button"
              className="btn btn-danger btn-lg px-4"
              onClick={onDelete}
            >
              <i className="bi bi-trash me-2"></i>
              Deletar
            </button>
          )}
          
          {config.fakeDataGenerator && (
            <button
              type="button"
              className="btn btn-secondary btn-lg px-4"
              onClick={handleFakeData}
            >
              Faker
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
        type: PropTypes.oneOf(['text', 'email', 'number', 'select', 'textarea', 'hidden']).isRequired,
        label: PropTypes.string.isRequired,
        labelIcon: PropTypes.string.isRequired,
        inputIcon: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        validator: PropTypes.func,
        formatter: PropTypes.func,
        maxLength: PropTypes.number,
        size: PropTypes.oneOf(['sm', 'lg']),
        // Para campos select
        loadOptions: PropTypes.func,
        defaultOptions: PropTypes.array,
        optionValue: PropTypes.string,
        optionLabel: PropTypes.string,
        // Para textarea
        rows: PropTypes.number,
        // Props adicionais
        additionalProps: PropTypes.object,
        alternativeKey: PropTypes.string
      })
    ).isRequired,
    fakeDataGenerator: PropTypes.func  }).isRequired,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showDeleteButton: PropTypes.bool
};

export default GenericForm;
