import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

/**
 * Hook personalizado para gerenciar lógica de login
 * Segue padrões identificados na estrutura web do projeto
 */
export const useLogin = () => {
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estados de validação
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dependências
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validação em tempo real do email
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor, insira um e-mail válido');
    } else {
      setEmailError('');
    }
  }, [email]);

  // Validação em tempo real da senha
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError('');
    }
  }, [password]);

  // Verificação se o formulário é válido
  const isFormValid = email && password && !emailError && !passwordError;

  // Função para lidar com erros de login
  const handleLoginError = useCallback((err) => {
    console.error('Erro no login:', err);
    
    if (err.status === 401) {
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    } else if (err.status === 429) {
      return 'Muitas tentativas de login. Tente novamente em alguns minutos.';
    } else if (err.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    } else {
      return err?.data?.message || err?.message || 'Falha ao fazer login. Tente novamente.';
    }
  }, []);

  // Função principal de login
  const handleLogin = useCallback(async () => {
    if (!isFormValid) {
      setError('Por favor, corrija os erros antes de continuar.');
      return false;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await api.auth.login({ email, password });
      
      if (response && response.token) {
        // Gerenciar persistência do login
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        
        // Login no contexto (que já tem os dados do usuário da resposta)
        await login(response);
        
        // Redirecionamento para home
        navigate('/', { replace: true });
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = handleLoginError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, isFormValid, navigate, login, handleLoginError]);

  // Função para limpar formulário
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setRememberMe(false);
    setEmailError('');
    setPasswordError('');
    setError('');
  }, []);

  // Função para voltar
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Função para navegar para registro
  const goToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  return {
    // Estados do formulário
    formData: {
      email,
      password,
      rememberMe
    },
    
    // Funções de atualização
    setEmail,
    setPassword,
    setRememberMe,
    
    // Estados de validação
    validation: {
      emailError,
      passwordError,
      isFormValid
    },
    
    // Estados de controle
    loading,
    error,
    
    // Funções de ação
    handleLogin,
    resetForm,
    goBack,
    goToRegister,
    
    // Função para limpar erro
    clearError: () => setError('')
  };
};