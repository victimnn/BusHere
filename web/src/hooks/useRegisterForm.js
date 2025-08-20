import { useState } from 'react';
import { validateEmail, validateCEP, validateCPF, validadeRawCPF } from '@shared/validators';
import { formatCPF, formatCEP, removeFormatting } from '@shared/formatters';

export function useRegisterForm() {
  const [errors, setErrors] = useState({});
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);

  const setFieldError = (name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateField = (name, value, otherValues = {}) => {
    const val = value?.trim?.() ?? value;
    switch (name) {
      case 'full_name':
        return val ? '' : 'Informe seu nome completo';
      case 'email':
        return validateEmail(val) ? '' : 'Email inválido';
      case 'cpf': {
        const only = (val || '').replace(/\D/g, '');
        return (validateCPF(val) || validadeRawCPF(only)) ? '' : 'CPF inválido';
      }
      case 'password':
        return val && val.length >= 6 ? '' : 'Mínimo de 6 caracteres';
      case 'confirm_password':
        return val === otherValues.password ? '' : 'As senhas não conferem';
      case 'address_street':
        return val ? '' : 'Informe a rua';
      case 'address_number':
        return /^\d+$/.test(val || '') ? '' : 'Somente números';
      case 'address_city':
        return val ? '' : 'Informe a cidade';
      case 'cep':
        return validateCEP(val) ? '' : 'CEP inválido';
      default:
        return '';
    }
  };

  const handleBlur = (event) => {
    const { name, value, form } = event.target;
    const fieldError = validateField(name, value, { password: form?.password?.value });
    setFieldError(name, fieldError);
  };

  const handleCpfInput = (event) => {
    event.target.value = formatCPF(event.target.value);
  };

  const handleCepInput = (event) => {
    event.target.value = formatCEP(event.target.value);
  };

  const handleOnlyNumberInput = (event) => {
    const numbers = removeFormatting(event.target.value);
    event.target.value = numbers;
  };

  const handleCepBlur = async (event) => {
    const raw = removeFormatting(event.target.value || '');
    if (raw.length !== 8) {
      setFieldError('cep', 'CEP inválido');
      return;
    }
    setFieldError('cep', '');
    try {
      setIsCepLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('Falha ao buscar CEP');
      const data = await response.json();
      if (data.erro) {
        setFieldError('cep', 'CEP não encontrado');
        return;
      }
      if (!addressStreet) setAddressStreet(data.logradouro || '');
      if (!addressCity) setAddressCity(data.localidade || '');
      if (data.logradouro) setFieldError('address_street', '');
      if (data.localidade) setFieldError('address_city', '');
    } catch (e) {
      setFieldError('cep', 'Não foi possível buscar o CEP');
    } finally {
      setIsCepLoading(false);
    }
  };

  return {
    // state
    errors,
    addressStreet,
    addressCity,
    isCepLoading,
    // setters
    setFieldError,
    setAddressStreet,
    setAddressCity,
    // handlers
    handleBlur,
    handleCpfInput,
    handleCepInput,
    handleCepBlur,
    handleOnlyNumberInput,
    // validators
    validateField,
  };
}

export default useRegisterForm;


