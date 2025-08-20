import { useState, useCallback } from 'react';
import { validateEmail, validatePhoneNumber } from '../../../../shared/validators';
import { formatPhoneNumber } from '../../../../shared/formatters';

export function useRegisterForm() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateField = useCallback((name, value, otherValues = {}) => {
    const val = value?.trim?.() ?? value;
    switch (name) {
      case 'nome':
        return val ? '' : 'Informe seu nome completo';
      case 'email':
        return validateEmail(val) ? '' : 'Email inválido';
      case 'password':
        return val && val.length >= 6 ? '' : 'Mínimo de 6 caracteres';
      case 'confirm_password':
        return val === otherValues.password ? '' : 'As senhas não conferem';
      case 'telefone':
        // Telefone é opcional, mas se preenchido deve ser válido
        if (!val) return '';
        return validatePhoneNumber(val) ? '' : 'Telefone inválido';
      default:
        return '';
    }
  }, []);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    
    // Validação dos campos obrigatórios
    newErrors.nome = validateField('nome', formData.nome);
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    newErrors.confirm_password = validateField('confirm_password', formData.confirm_password, { password: formData.password });
    
    // Validação do telefone (opcional)
    if (formData.telefone) {
      newErrors.telefone = validateField('telefone', formData.telefone);
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  }, [validateField]);

  const handleBlur = useCallback((event) => {
    const { name, value, form } = event.target;
    const fieldError = validateField(name, value, { password: form?.password?.value });
    setFieldError(name, fieldError);
  }, [validateField, setFieldError]);

  const handlePhoneInput = useCallback((event) => {
    const input = event.target;
    let value = input.value;
    
    // Remove tudo que não é número
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (formato brasileiro: DDD + 9 dígitos)
    if (numbersOnly.length > 11) {
      value = numbersOnly.slice(0, 11);
    } else {
      value = numbersOnly;
    }
    
    // Aplica formatação apenas se tiver números
    if (value) {
      input.value = formatPhoneNumber(value);
    } else {
      input.value = '';
    }
  }, []);

  const handlePhoneKeyPress = useCallback((event) => {
    // Permite apenas números, backspace, delete, tab, enter, escape
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape'];
    const isNumber = /[0-9]/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    
    if (!isNumber && !isAllowedKey) {
      event.preventDefault();
    }
  }, []);

  const handlePhoneBlur = useCallback((event) => {
    const { name, value } = event.target;
    if (value) {
      const fieldError = validateField(name, value);
      setFieldError(name, fieldError);
    } else {
      clearFieldError(name);
    }
  }, [validateField, setFieldError, clearFieldError]);

  const handleSubmit = useCallback(async (formData, onSubmit) => {
    if (!validateForm(formData)) {
      return false;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm]);

  const resetForm = useCallback(() => {
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    // state
    errors,
    isSubmitting,
    // setters
    setFieldError,
    clearFieldError,
    // handlers
    handleBlur,
    handlePhoneInput,
    handlePhoneKeyPress,
    handlePhoneBlur,
    handleSubmit,
    resetForm,
    // validators
    validateField,
    validateForm,
  };
}

export default useRegisterForm;


