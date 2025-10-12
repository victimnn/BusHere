import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCPF, formatPhoneNumber, removeFormatting } from '../../../../shared/formatters.ts';
import { validateEmail, validatePhoneNumber, validateCEP } from '../../../../shared/validators.ts';
import { BRAZILIAN_STATES } from '../../../../shared/brazilianStates.ts';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook personalizado para gerenciar lógica de edição de perfil
 * Baseado no hook useRegister, adaptado para edição
 */
export const useEditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Estado da aplicação
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Estados do formulário - inicializa com dados do usuário
  const [formData, setFormData] = useState({
    // Dados pessoais editáveis
    nome: user?.nome_completo || '',
    telefone: user?.telefone || '',
    email: user?.email || '',
    
    // Senha (opcional na edição)
    password: '',
    confirmPassword: '',
    
    // Dados de endereço editáveis
    cep: user?.cep || '',
    logradouro: user?.logradouro || '',
    numero: user?.numero_endereco || '',
    complemento: user?.complemento_endereco || '',
    bairro: user?.bairro || '',
    cidade: user?.cidade || '',
    uf: user?.uf || '',
    
    // PCD
    pcd: user?.pcd || false
  });

  // Estados de validação
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Atualiza formData quando user mudar
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome_completo || '',
        telefone: user.telefone ? formatPhoneNumber(user.telefone) : '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        cep: user.cep ? formatCEP(user.cep) : '',
        logradouro: user.logradouro || '',
        numero: user.numero_endereco || '',
        complemento: user.complemento_endereco || '',
        bairro: user.bairro || '',
        cidade: user.cidade || '',
        uf: user.uf || '',
        pcd: user.pcd || false
      });
    }
  }, [user]);

  // Função para formatar CEP
  const formatCEP = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 8) {
      return cleanValue.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Validação em tempo real
  useEffect(() => {
    const errors = {};

    if (touchedFields.email) {
      if (!formData.email) {
        errors.email = 'E-mail é obrigatório';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Por favor, insira um e-mail válido';
      }
    }

    // Validação de senha - apenas se o usuário quiser alterar
    if (touchedFields.password && formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'A senha deve ter pelo menos 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = 'A senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número';
      }
    }

    if (touchedFields.confirmPassword && formData.password) {
      if (formData.password !== formData.confirmPassword) {
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

    if (touchedFields.telefone) {
      if (!formData.telefone) {
        errors.telefone = 'Telefone é obrigatório';
      } else {
        const rawPhone = removeFormatting(formData.telefone);
        if (rawPhone.length < 10 || rawPhone.length > 11) {
          errors.telefone = 'Telefone deve seguir o padrão (XX) XXXXX-XXXX';
        }
      }
    }

    // Validações de endereço
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
    if (field === 'telefone') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'cep') {
      formattedValue = formatCEP(value);
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

  // Validação do formulário
  const isFormValid = useCallback(() => {
    const requiredFields = ['nome', 'email', 'telefone', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllFields = requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });
    
    // Se senha foi preenchida, validar confirmação também
    if (formData.password) {
      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
        return false;
      }
    }
    
    // Verificar se não há erros de validação
    const hasNoErrors = Object.keys(fieldErrors).length === 0;
    
    return hasAllFields && hasNoErrors;
  }, [formData, fieldErrors]);

  // Buscar CEP automático
  const fetchAddressByCEP = useCallback(async (cep) => {
    if (!cep || cep.length < 8) return;
    
    try {
      setIsLoadingCep(true);
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
    } finally {
      setIsLoadingCep(false);
    }
  }, []);

  // Função para lidar com erros de atualização
  const handleUpdateError = useCallback((err) => {
    console.error('Erro na atualização:', err);
    
    if (err.status === 409) {
      return 'Este e-mail já está em uso. Tente outro e-mail.';
    } else if (err.status === 422) {
      return err?.data?.message || 'Dados inválidos. Verifique as informações e tente novamente.';
    } else if (err.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    } else {
      return err?.data?.message || err?.message || 'Falha ao atualizar perfil. Tente novamente.';
    }
  }, []);

  // Submissão
  const handleSubmit = useCallback(async () => {
    // Marcar todos os campos como tocados para forçar validação
    const allFields = ['nome', 'email', 'telefone', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    const newTouchedFields = { ...touchedFields };
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    // Verificar se todos os campos obrigatórios estão preenchidos
    const hasAllFields = allFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    });

    if (!hasAllFields) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    // Aguardar validações serem processadas
    await new Promise(resolve => setTimeout(resolve, 100));

    const hasNoErrors = allFields.every(field => !fieldErrors[field]);
    
    // Validar senha se foi preenchida
    if (formData.password) {
      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem.');
        return false;
      }
      if (fieldErrors.password || fieldErrors.confirmPassword) {
        setError('Por favor, corrija os erros de senha.');
        return false;
      }
    }
    
    if (!hasNoErrors) {
      setError('Por favor, corrija os erros antes de continuar.');
      return false;
    }

    setError('');
    setLoading(true);

    try {
      // Preparar dados para o backend
      const updateData = {
        nome_completo: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: removeFormatting(formData.telefone),
        pcd: formData.pcd,
        logradouro: formData.logradouro.trim(),
        numero_endereco: formData.numero.trim(),
        complemento_endereco: formData.complemento.trim() || null,
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        uf: formData.uf,
        cep: removeFormatting(formData.cep),
      };

      // Adicionar senha apenas se foi preenchida
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Chamar API de atualização
      const response = await api.auth.updateProfile(updateData);
      
      if (response && (response.success || response.message)) {
        setError('');
        setSuccess('Perfil atualizado com sucesso!');
        setShowSuccessModal(true);
        
        // Atualizar dados do usuário no contexto
        if (response.user || response.data) {
          await updateUser(response.user || response.data);
        }
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/conta');
        }, 2000);
        
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = handleUpdateError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, fieldErrors, touchedFields, navigate, handleUpdateError, updateUser]);

  // Função para cancelar edição
  const handleCancel = useCallback(() => {
    navigate('/conta');
  }, [navigate]);

  // Função para limpar estados de feedback
  const clearFeedback = useCallback(() => {
    setError('');
    setSuccess('');
    setShowSuccessModal(false);
  }, []);

  return {
    // Estados da aplicação
    loading,
    error,
    success,
    showSuccessModal,
    isLoadingCep,
    
    // Estados do formulário
    formData,
    fieldErrors,
    touchedFields,
    
    // Funções de validação
    isFormValid: isFormValid(),
    
    // Funções de manipulação
    handleInputChange,
    handleBlur,
    fetchAddressByCEP,
    
    // Funções de ação
    handleSubmit,
    handleCancel,
    
    // Função para limpar feedback
    clearError: () => setError(''),
    clearFeedback,
    
    // Dados úteis
    BRAZILIAN_STATES
  };
};
