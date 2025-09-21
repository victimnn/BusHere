import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const useAccountPage = (isDark) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Função para obter iniciais do nome
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para obter status do usuário com cores
  const getUserStatus = (user) => {
    // Verifica diferentes possíveis campos de status
    if (user?.ativo === true || user?.ativo === 1 || user?.ativo === 'true') {
      return { text: 'Ativo', color: 'text-success' };
    }
    if (user?.ativo === false || user?.ativo === 0 || user?.ativo === 'false') {
      return { text: 'Inativo', color: 'text-danger' };
    }
    // Status padrão se não há informação
    return { text: 'Ativo', color: 'text-success' };
  };

  // Função para lidar com edição de perfil
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    console.log('Editar perfil - funcionalidade em desenvolvimento');
  };

  // Função para lidar com logout
  const handleLogout = () => {
    logout();
  };

  return {
    // Estados
    user,
    isEditing,
    isDarkMode: isDark,
    
    // Funções utilitárias
    getInitials,
    formatDate,
    getUserStatus,
    
    // Handlers
    handleEditProfile,
    handleLogout
  };
};