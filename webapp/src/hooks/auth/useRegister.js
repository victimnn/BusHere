import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCPF, formatPhoneNumber, removeFormatting } from '../../../../shared/formatters.ts';
import { validateEmail, validateCPF, validadeRawCPF, validatePhoneNumber, validateCEP } from '../../../../shared/validators.ts';
import { BRAZILIAN_STATES } from '../../../../shared/brazilianStates.ts';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook personalizado para gerenciar lógica de registro
 * Segue padrões identificados na estrutura web do projeto
 */
export const useRegister = () => {
  // Estado da aplicação
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'loading', 'success', 'error'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estados do formulário
  const [formData, setFormData] = useState({
    // Credenciais
    email: '',
    password: '',
    confirmPassword: '',
    
    // Dados pessoais
    nome: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    
    // Dados de endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  // Estados de validação
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Validação em tempo real
  useEffect(() => {
    const errors = {};

    // Validações da etapa 1 - só validar campos que foram tocados E têm valor
    if (touchedFields.email) {
      if (!formData.email) {
        errors.email = 'E-mail é obrigatório';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Por favor, insira um e-mail válido';
      }
    }

    if (touchedFields.password) {
      if (!formData.password) {
        errors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 8) {
        errors.password = 'A senha deve ter pelo menos 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = 'A senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número';
      }
    }

    if (touchedFields.confirmPassword) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (touchedFields.nome) {
      if (!formData.nome.trim()) {
        errors.nome = 'Nome é obrigatório';
      } else if (formData.nome.trim().length < 2) {
        errors.nome = 'Nome deve ter pelo menos 2 caracteres';
      } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome)) {
        errors.nome = 'Nome deve conter apenas letras e espaços';
      }
    }

    if (touchedFields.cpf) {
      if (!formData.cpf) {
        errors.cpf = 'CPF é obrigatório';
      } else {
        const rawCpf = removeFormatting(formData.cpf);
        if (!validadeRawCPF(rawCpf)) {
          errors.cpf = 'CPF inválido';
        }
      }
    }

    if (touchedFields.telefone) {
      if (!formData.telefone) {
        errors.telefone = 'Telefone é obrigatório';
      } else {
        const rawPhone = removeFormatting(formData.telefone);
        if (rawPhone.length < 10 || rawPhone.length > 11) {
          errors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
        }
      }
    }

    if (touchedFields.dataNascimento) {
      if (!formData.dataNascimento) {
        errors.dataNascimento = 'Data de nascimento é obrigatória';
      } else {
        const today = new Date();
        const birthDate = new Date(formData.dataNascimento);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Ajustar idade se ainda não fez aniversário este ano
        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
          ? age - 1 
          : age;

        if (adjustedAge < 14) {
          errors.dataNascimento = 'Você deve ter pelo menos 14 anos';
        } else if (adjustedAge > 120) {
          errors.dataNascimento = 'Data de nascimento inválida';
        }
      }
    }

    // Validações da etapa 2
    if (touchedFields.cep) {
      if (!formData.cep) {
        errors.cep = 'CEP é obrigatório';
      } else if (!validateCEP(formData.cep)) {
        errors.cep = 'CEP inválido';
      }
    }

    if (touchedFields.logradouro) {
      if (!formData.logradouro.trim()) {
        errors.logradouro = 'Logradouro é obrigatório';
      } else if (formData.logradouro.trim().length < 5) {
        errors.logradouro = 'Logradouro deve ter pelo menos 5 caracteres';
      }
    }

    if (touchedFields.numero) {
      if (!formData.numero.trim()) {
        errors.numero = 'Número é obrigatório';
      }
    }

    if (touchedFields.bairro) {
      if (!formData.bairro.trim()) {
        errors.bairro = 'Bairro é obrigatório';
      } else if (formData.bairro.trim().length < 2) {
        errors.bairro = 'Bairro deve ter pelo menos 2 caracteres';
      }
    }

    if (touchedFields.cidade) {
      if (!formData.cidade.trim()) {
        errors.cidade = 'Cidade é obrigatória';
      } else if (formData.cidade.trim().length < 2) {
        errors.cidade = 'Cidade deve ter pelo menos 2 caracteres';
      }
    }

    if (touchedFields.uf) {
      if (!formData.uf) {
        errors.uf = 'Estado é obrigatório';
      } else if (!BRAZILIAN_STATES.find(state => state.value === formData.uf)) {
        errors.uf = 'Estado inválido';
      }
    }

    setFieldErrors(errors);
  }, [formData, touchedFields]);

  // Função para lidar com mudanças nos inputs
  const handleInputChange = useCallback((field, value) => {
    let formattedValue = value;

    // Aplicar formatação específica
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'cep') {
      // Formatar CEP automaticamente
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 8) {
        formattedValue = cleanValue.replace(/(\d{5})(\d)/, '$1-$2');
      }
    } else if (field === 'nome' || field === 'cidade' || field === 'bairro') {
      // Capitalizar primeira letra de cada palavra
      formattedValue = value.replace(/\b\w/g, l => l.toUpperCase());
    } else if (field === 'uf') {
      formattedValue = value.toUpperCase();
    } else if (field === 'logradouro') {
      // Capitalizar logradouro
      formattedValue = value.replace(/\b\w/g, l => l.toUpperCase());
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Marcar campo como tocado quando há alteração
    if (!touchedFields[field]) {
      setTouchedFields(prev => ({
        ...prev,
        [field]: true
      }));
    }
  }, [touchedFields]);

  // Função para marcar campo como tocado
  const handleBlur = useCallback((field) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  // Validação das etapas (sem exigir que todos campos sejam tocados para habilitar botão)
  const isStep1Valid = useCallback(() => {
    const requiredFields = ['email', 'password', 'confirmPassword', 'nome', 'cpf', 'telefone', 'dataNascimento'];
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllFields = requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });
    
    // Verificar se não há erros de validação nos campos que foram tocados
    const hasNoErrors = requiredFields.every(field => !fieldErrors[field]);
    
    return hasAllFields && hasNoErrors;
  }, [formData, fieldErrors]);

  const isStep2Valid = useCallback(() => {
    const requiredFields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllFields = requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });
    
    // Verificar se não há erros de validação nos campos que foram tocados
    const hasNoErrors = requiredFields.every(field => !fieldErrors[field]);
    
    return hasAllFields && hasNoErrors;
  }, [formData, fieldErrors]);

  // Buscar CEP automático
  const fetchAddressByCEP = useCallback(async (cep) => {
    if (!cep || cep.length < 8) return;
    
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        // Atualizar os campos de endereço automaticamente
        const updates = {
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || ''
        };
        
        setFormData(prev => ({
          ...prev,
          ...updates
        }));

        // Marcar os campos preenchidos automaticamente como tocados
        setTouchedFields(prev => ({
          ...prev,
          logradouro: true,
          bairro: true,
          cidade: true,
          uf: true
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  }, []);

  // Navegação entre etapas
  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      // Marcar todos os campos da etapa 1 como tocados para forçar validação
      const step1Fields = ['email', 'password', 'confirmPassword', 'nome', 'cpf', 'telefone', 'dataNascimento'];
      const newTouchedFields = { ...touchedFields };
      step1Fields.forEach(field => {
        newTouchedFields[field] = true;
      });
      setTouchedFields(newTouchedFields);

      // Verificar se a etapa 1 é válida
      const hasAllFields = step1Fields.every(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });
      
      if (hasAllFields) {
        setCurrentStep(2);
        setError('');
        return true;
      } else {
        setError('Por favor, preencha todos os campos obrigatórios corretamente.');
        return false;
      }
    }
    return false;
  }, [currentStep, formData, touchedFields]);

  const handlePrevStep = useCallback(() => {
    setCurrentStep(1);
    setError('');
  }, []);

  // Função para lidar com erros de registro
  const handleRegistrationError = useCallback((err) => {
    console.error('Erro no registro:', err);
    
    if (err.status === 409) {
      return 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
    } else if (err.status === 422) {
      return err?.data?.message || 'Dados inválidos. Verifique as informações e tente novamente.';
    } else if (err.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    } else {
      return err?.data?.message || err?.message || 'Falha ao criar conta. Tente novamente.';
    }
  }, []);

  // Submissão final
  const handleSubmit = useCallback(async () => {
    // Marcar todos os campos da etapa 2 como tocados para forçar validação
    const step2Fields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    const newTouchedFields = { ...touchedFields };
    step2Fields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    // Verificar se a etapa 2 é válida
    const hasAllFields = step2Fields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });

    if (!hasAllFields) {
      setError('Por favor, preencha todos os campos obrigatórios corretamente.');
      return false;
    }

    // Aguardar validações serem processadas
    await new Promise(resolve => setTimeout(resolve, 100));

    const hasNoErrors = step2Fields.every(field => !fieldErrors[field]);
    
    if (!hasNoErrors) {
      setError('Por favor, corrija os erros antes de continuar.');
      return false;
    }

    setError('');
    setLoading(true);
    setRegistrationStatus('loading');

    try {
      // Preparar dados para o backend no formato que ele espera
      const registrationData = {
        nome_completo: formData.nome.trim(),
        cpf: removeFormatting(formData.cpf),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefone: removeFormatting(formData.telefone),
        data_nascimento: formData.dataNascimento,
        pcd: false, // Default value
        logradouro: formData.logradouro.trim(),
        numero_endereco: formData.numero.trim(),
        complemento_endereco: formData.complemento.trim() || null,
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        uf: formData.uf,
        cep: removeFormatting(formData.cep),
        tipo_passageiro_id: 1, // Default para estudante
        ativo: true
      };

      // Chamar API de registro
      const response = await api.auth.register(registrationData);
      if (response && (response.success || response.message)) {
        setError('');
        setRegistrationStatus('success');
        setSuccess('Conta criada com sucesso! Redirecionando...');
        setShowSuccessModal(true);
        // Login automático após registro
        let loginResponse = null;
        try {
          loginResponse = await api.auth.login({
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          });
          if (loginResponse && loginResponse.token) {
            localStorage.setItem('token', loginResponse.token);
            await login(loginResponse);
          }
        } catch (loginErr) {
          // Se falhar, apenas segue o fluxo normal
          console.error('Erro ao logar após registro:', loginErr);
        }
        setTimeout(() => {
          let redirectPath = '/'; // Default agora é home
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get('redirect');
            if (redirectParam) {
              redirectPath = redirectParam;
            }
          }
          navigate(redirectPath, {
            state: {
              message: 'Conta criada com sucesso! Você já está logado.',
              type: 'success'
            }
          });
        }, 3500);
        return true;
      }
      
      return false;
    } catch (err) {
      setRegistrationStatus('error');
      const errorMessage = handleRegistrationError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, fieldErrors, touchedFields, navigate, handleRegistrationError, login]);

  // Função para voltar
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Função para ir para login
  const goToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // Função para limpar estados de feedback
  const clearFeedback = useCallback(() => {
    setError('');
    setSuccess('');
    setRegistrationStatus(null);
    setShowSuccessModal(false);
  }, []);

  return {
    // Estados da aplicação
    currentStep,
    loading,
    error,
    success,
    registrationStatus,
    showSuccessModal,
    
    // Estados do formulário
    formData,
    fieldErrors,
    touchedFields,
    
    // Funções de validação
    isStep1Valid: isStep1Valid(),
    isStep2Valid: isStep2Valid(),
    
    // Funções de manipulação
    handleInputChange,
    handleBlur,
    fetchAddressByCEP,
    
    // Funções de navegação
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    goBack,
    goToLogin,
    
    // Função para limpar feedback
    clearError: () => setError(''),
    clearFeedback,
    
    // Dados úteis
    BRAZILIAN_STATES
  };
};