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
  isCreateForm = null,
  steps = null // Nova prop para definir etapas
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
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Memoize field configurations for better performance
  const fieldsConfig = useMemo(() => config.fields, [config.fields]);

  // Funções para controlar as etapas
  const nextStep = useCallback((e) => {
    // Previne o comportamento padrão do formulário
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (steps && currentStep < steps.length - 1) {
      // Valida campos obrigatórios da etapa atual
      const currentStepFields = steps[currentStep]?.fields || [];
      const stepErrors = {};
      let hasErrors = false;
      
      currentStepFields.forEach(fieldName => {
        const field = fieldsConfig.find(f => f.name === fieldName);
        if (field && field.required) {
          const value = formData[field.name] || '';
          // Validação inline para evitar dependência circular
          let error = null;
          
          // Validação de campo obrigatório
          if (!value || value.toString().trim() === '') {
            error = `${field.label} é obrigatório`;
          }
          
          // Validação customizada
          if (!error && field.validator) {
            error = field.validator(value, formData);
          }
          
          if (error) {
            stepErrors[fieldName] = error;
            hasErrors = true;
          }
        }
      });
      
      if (hasErrors) {
        // Atualiza erros e marca campos como tocados
        setErrors(prev => ({ ...prev, ...stepErrors }));
        setTouchedFields(prev => {
          const newTouched = { ...prev };
          currentStepFields.forEach(fieldName => {
            if (stepErrors[fieldName]) {
              newTouched[fieldName] = true;
            }
          });
          return newTouched;
        });
        
        // Mostra mensagem de erro
        console.warn('Preencha todos os campos obrigatórios da etapa atual');
        return;
      }
      
      // Se não há erros, avança para próxima etapa
      setCurrentStep(currentStep + 1);
    }
  }, [steps, currentStep, fieldsConfig, formData]);

  const prevStep = useCallback((e) => {
    // Previne o comportamento padrão do formulário
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const isLastStep = steps ? currentStep === steps.length - 1 : true;
  const isFirstStep = currentStep === 0;

  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      const newFormData = {};
      const newTouchedFields = {};
      fieldsConfig.forEach(field => {
        let value = initialData[field.name] || initialData[field.alternativeKey] || field.defaultValue || '';
        
        // Aplica transformação reversa se disponível (ex: conversão de datas do banco para formato de exibição)
        if (field.reverseTransform && value) {
          value = field.reverseTransform(value);
        }
        
        newFormData[field.name] = value;
        // Marca os campos preenchidos como tocados para validação na edição
        if (value && value !== '' && value !== field.defaultValue) {
          newTouchedFields[field.name] = true;
        }
      });
      setFormData(newFormData);
      setTouchedFields(newTouchedFields);
    }
  }, [initialData, fieldsConfig]);

  // Valida os campos iniciais após carregar os dados (separado para evitar dependência circular)
  useEffect(() => {
    if (initialData && Object.keys(touchedFields).length > 0) {
      const newErrors = {};
      fieldsConfig.forEach(field => {
        if (touchedFields[field.name]) {
          // Validação inline para evitar dependência circular
          const fieldConfig = fieldsConfig.find(f => f.name === field.name);
          const value = formData[field.name];
          let error = null;
          
          // Validação de campo obrigatório
          if (fieldConfig?.required && (!value || value.toString().trim() === '')) {
            error = `${fieldConfig.label} é obrigatório`;
          }
          
          // Validação customizada
          if (!error && fieldConfig?.validator) {
            error = fieldConfig.validator(value, formData);
          }
          
          if (error) {
            newErrors[field.name] = error;
          }
        }
      });
      setErrors(newErrors);
    }
  }, [initialData, fieldsConfig, touchedFields, formData]);

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
                  } else if (response && Array.isArray(response)) {
                    newSelectOptions[field.name] = response;
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
  const validateField = useCallback((name, value, currentFormData = formData) => {
    const fieldConfig = getFieldConfig(name);
    if (!fieldConfig) return null;

    // Validação de campo obrigatório
    if (fieldConfig.required && (!value || value.toString().trim() === '')) {
      return `${fieldConfig.label} é obrigatório`;
    }

    // Validação customizada
    if (fieldConfig.validator) {
      return fieldConfig.validator(value, currentFormData);
    }

    return null;
  }, [getFieldConfig, formData]);

  // Verifica se a etapa atual está válida
  const isCurrentStepValid = useMemo(() => {
    if (!steps) return true;
    
    const currentStepFields = steps[currentStep]?.fields || [];
    return currentStepFields.every(fieldName => {
      const field = fieldsConfig.find(f => f.name === fieldName);
      if (field && field.required) {
        const value = formData[field.name] || '';
        const error = validateField(field.name, value);
        return !error;
      }
      return true;
    });
  }, [steps, currentStep, fieldsConfig, formData, validateField]);

  // Função para buscar dados do CEP
  const handleCepBlur = useCallback(async (cep) => {
    if (!cep) return;
    
    // Remove formatação para contar apenas os dígitos
    const cleanCep = cep.replace(/\D/g, '');
    
    // Só faz a requisição se tiver exatamente 8 dígitos
    if (cleanCep.length !== 8) {
      return;
    }
    
    setIsLoadingCep(true);
    
    try {
      // Importa a API dinamicamente para evitar dependência circular
      const api = (await import('@web/api/api')).default;
      const addressData = await api.passengers.getAddressByCep(cep);
      
      // Atualiza os campos de endereço com os dados do CEP
      setFormData(prev => ({
        ...prev,
        logradouro: addressData.logradouro,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        uf: addressData.uf,
        cep: addressData.cep
      }));
      
      // Limpa erros dos campos preenchidos automaticamente
      setErrors(prev => ({
        ...prev,
        logradouro: null,
        bairro: null,
        cidade: null,
        uf: null,
        cep: null
      }));
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      
      // Mostra erro apenas se o CEP for válido mas não encontrado
      if (error.message === 'CEP não encontrado') {
        setErrors(prev => ({
          ...prev,
          cep: 'CEP não encontrado'
        }));
      }
    } finally {
      setIsLoadingCep(false);
    }
  }, []);

  // Manipulador de foco nos campos
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Valida apenas campos que foram tocados
    const errorMsg = validateField(name, value, formData);
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));

    // Verifica se existe um evento customizado para este campo
    const fieldConfig = getFieldConfig(name);
    if (fieldConfig && fieldConfig.onBlur) {
      // Chama o evento customizado se existir
      if (fieldConfig.onBlur === 'handleCepBlur' && name === 'cep') {
        handleCepBlur(value);
      }
    }
  }, [validateField, getFieldConfig, handleCepBlur]);

  // Manipulador de alteração nos campos com validação otimizada
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldConfig = getFieldConfig(name);
    
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Aplica formatação se disponível
    if (fieldConfig && fieldConfig.formatter) {
      processedValue = fieldConfig.formatter(processedValue);
    }
    
    
    const newFormData = { ...formData, [name]: processedValue };
    setFormData(newFormData);
    
    // Valida em tempo real apenas se o campo já foi tocado
    if (touchedFields[name]) {
      const errorMsg = validateField(name, processedValue, newFormData);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  }, [getFieldConfig, touchedFields, validateField, formData]);

  // Validação do formulário completo
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Valida todos os campos
    fieldsConfig.forEach(field => {
      const error = validateField(field.name, formData[field.name], formData);
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
      const error = validateField(field.name, formData[field.name], formData);
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
      // Não marca automaticamente como tocados - deixa o usuário validar conforme interage
      setTouchedFields({});
    }
  }, [config.fakeDataGenerator]);

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
    
    // Lógica melhorada para aplicar classes de validação
    let validationClass = '';
    if (isFieldTouched) {
      if (error) {
        validationClass = 'is-invalid';
      } else if (value && value !== '' && field.required) {
        validationClass = 'is-valid';
      } else if (value && value !== '' && !field.required) {
        // Para campos não obrigatórios, só aplica is-valid se não há erro
        const fieldError = validateField(field.name, value, formData);
        validationClass = fieldError ? 'is-invalid' : 'is-valid';
      }
    }

    const inputGroupClass = `input-group${field.size ? ` input-group-${field.size}` : ''}`;
    const inputClass = `form-control${field.size ? ` form-control-${field.size}` : ''} ${validationClass}`;
    
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
                disabled={field.disabled || isLoading || (field.name === 'cep' && isLoadingCep)}
                {...(field.additionalProps || {})}
              />
              {field.name === 'cep' && isLoadingCep && (
                <span className="input-group-text bg-light">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </span>
              )}
              {showError && <div className="invalid-feedback">{error}</div>}
            </div>
            {helpText}
          </div>
        );

      case 'checkbox':
        const isPcdField = field.name === 'pcd';
        const checkboxClass = isPcdField 
          ? `form-check-input form-check-input-lg ${validationClass}` 
          : `form-check-input ${validationClass}`;
        const containerClass = isPcdField 
          ? 'form-check form-check-lg p-3 border rounded bg-light' 
          : 'form-check';
        const labelClass = isPcdField 
          ? 'form-check-label fw-bold fs-5 text-primary' 
          : 'form-check-label fw-semibold';
        
        return (
          <div key={field.name} className="mb-4">
            <div className={containerClass}>
              <input
                className={checkboxClass}
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={field.disabled || isLoading}
                {...(field.additionalProps || {})}
              />
              <label className={labelClass} htmlFor={field.name}>
                <i className={`${field.labelIcon} me-2 ${isPcdField ? 'fs-4' : ''}`}></i>
                {field.label}
                {field.required && <span className="text-danger ms-1">*</span>}
              </label>
              {isPcdField && (
                <div className="form-text text-muted mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Marque esta opção se o passageiro possui alguma deficiência
                </div>
              )}
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
                {(selectOptions[field.name] || []).map((option) => {
                  const label = typeof field.optionLabel === 'function' 
                    ? field.optionLabel(option) 
                    : option[field.optionLabel];
                  return (
                    <option key={option[field.optionValue]} value={option[field.optionValue]}>
                      {label}
                    </option>
                  );
                })}
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
  }, [formData, errors, touchedFields, selectOptions, handleChange, handleBlur, isLoading, validateField]);

  return (
    <div className={`card border-0 shadow-sm ${steps ? 'multi-step-form' : ''} ${className}`}>
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

        {/* Renderiza campos com etapas se especificado */}
        {steps ? (
          <div>
            {/* Indicador de etapas */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-primary">
                  <i className={`${steps[currentStep]?.icon || 'bi bi-list-ol'} me-2`}></i>
                  {steps[currentStep]?.title || `Etapa ${currentStep + 1}`}
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary fs-6">
                    {currentStep + 1} de {steps.length}
                  </span>
                </div>
              </div>
              <div className="progress mb-4" style={{ height: '8px' }}>
                <div 
                  className={`progress-bar ${isCurrentStepValid ? 'bg-primary' : 'bg-warning'}`}
                  role="progressbar" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Campos da etapa atual */}
            <div className="row">
              {steps[currentStep]?.fields?.map(fieldName => {
                const field = fieldsConfig.find(f => f.name === fieldName);
                return field ? (
                  <div key={fieldName} className={field.colClass || 'col-12'}>
                    {renderField(field)}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ) : config.groups ? (
          // Renderiza campos agrupados se especificado
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
        <div className="d-flex justify-content-between gap-3">
          {/* Botões de navegação para etapas */}
          {steps ? (
            <>
              <div className="d-flex gap-2">
                {!isFirstStep && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-lg px-4" 
                    onClick={(e) => prevStep(e)}
                    disabled={isSubmitting || isLoading}
                    style={{ minWidth: '120px' }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Anterior
                  </button>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg px-4" 
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                  style={{ minWidth: '120px' }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
                
                {!isLastStep ? (
                  <button 
                    type="button" 
                    className="btn btn-primary text-white btn-lg px-4"
                    onClick={(e) => nextStep(e)}
                    disabled={isSubmitting || isLoading || !isCurrentStepValid}
                    style={{ minWidth: '120px' }}
                    title={!isCurrentStepValid ? 'Preencha todos os campos obrigatórios da etapa atual' : ''}
                  >
                    Próximo
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-success text-white btn-lg px-4"
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
                        <i className={`bi ${initialData && !isCreateForm ? 'bi-pencil-square' : 'bi-check-circle'} me-2`}></i>
                        {(initialData && !isCreateForm) ? 'Atualizar' : 'Finalizar'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            // Botões normais quando não há etapas
            <>
              <div></div>
              <div className="d-flex gap-2">
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
              </div>
            </>
          )}

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
  isCreateForm: PropTypes.bool,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  )
};

export default GenericForm;
