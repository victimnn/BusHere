import { useState } from 'react';
import { validateEmail } from '@shared/validators';

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const setFieldError = (name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateField = (name, value) => {
    const val = value?.trim?.() ?? value;
    switch (name) {
      case 'email':
        return val ? (validateEmail(val) ? '' : 'Email inválido') : 'Informe seu email';
      case 'password':
        return val ? '' : 'Informe sua senha';
      default:
        return '';
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const fieldError = validateField(name, value);
    setFieldError(name, fieldError);
  };

  const validateForm = (email, password) => {
    const formErrors = {};
    
    if (!email || !password) {
      formErrors.general = 'Por favor, preencha todos os campos.';
      return formErrors;
    }

    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);

    if (emailError) formErrors.email = emailError;
    if (passwordError) formErrors.password = passwordError;

    return formErrors;
  };

  return {
    // state
    showPassword,
    isSubmitting,
    errors,
    // setters
    setShowPassword,
    setIsSubmitting,
    // handlers
    handleBlur,
    // validators
    validateForm,
  };
}

export default useLoginForm;
