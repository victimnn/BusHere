import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { formatDateFromDatabase, formatDateForDatabase } from '@shared/formatters';

// Função para transformar dados do backend para frontend
const transformNotificationData = (notification, getScopeName) => ({
  id: notification.aviso_id,
  aviso_id: notification.aviso_id,
  titulo: notification.titulo,
  conteudo: notification.conteudo,
  data_publicacao: formatDateFromDatabase(notification.data_publicacao),
  data_expiracao: notification.data_expiracao ? formatDateFromDatabase(notification.data_expiracao) : null,
  usuario_criador_id: notification.usuario_criador_id,
  escopo_aviso_id: notification.escopo_aviso_id,
  escopo_nome: getScopeName(notification.escopo_aviso_id),
  rota_alvo_id: notification.rota_alvo_id,
  tipo_passageiro_alvo_id: notification.tipo_passageiro_alvo_id,
  passageiro_alvo_id: notification.passageiro_alvo_id,
  prioridade: notification.prioridade || 'MEDIA',
  enviar_push: notification.enviar_push !== false,
  enviar_email: notification.enviar_email === true,
  enviar_sms: notification.enviar_sms === true,
  ativo: notification.ativo !== false
});

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  const ensureDatabaseDateFormat = (dateValue) => {
    if (!dateValue) return null;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      return formatDateForDatabase(dateValue);
    }
    
    return formatDateForDatabase(dateValue) || dateValue;
  };

  return {
    titulo: formData.titulo,
    conteudo: formData.conteudo,
    escopo_aviso_id: parseInt(formData.escopo_aviso_id),
    data_expiracao: ensureDatabaseDateFormat(formData.data_expiracao),
    rota_alvo_id: formData.rota_alvo_id ? parseInt(formData.rota_alvo_id) : null,
    tipo_passageiro_alvo_id: formData.tipo_passageiro_alvo_id ? parseInt(formData.tipo_passageiro_alvo_id) : null,
    passageiro_alvo_id: formData.passageiro_alvo_id ? parseInt(formData.passageiro_alvo_id) : null,
    prioridade: formData.prioridade || 'MEDIA',
    enviar_push: formData.enviar_push !== false,
    enviar_email: formData.enviar_email === true,
    enviar_sms: formData.enviar_sms === true,
    ativo: formData.ativo !== false
  };
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} aviso: `;
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useNotifications = () => {
  // Estados
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scopes, setScopes] = useState([]);

  // Memoizar função para obter nome do escopo
  const getScopeName = useCallback((escopo_aviso_id) => {
    const scope = scopes.find(s => s.escopo_aviso_id === escopo_aviso_id);
    return scope ? scope.nome_escopo : 'Não informado';
  }, [scopes]);

  // Memoizar transformação dos dados dos avisos
  const transformedNotifications = useMemo(() => {
    if (!notifications.length || !scopes.length) return [];
    
    return notifications.map(notification => 
      transformNotificationData(notification, getScopeName)
    );
  }, [notifications, getScopeName]);

  // Função para buscar escopos de aviso
  const fetchScopes = useCallback(async () => {
    try {
      const response = await api.notifications.getScopes();
      if (response?.data) {
        setScopes(response.data);
      } else {
        setScopes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar escopos de aviso:', error);
      setScopes([]);
    }
  }, []);

  // Função otimizada para buscar avisos
  const fetchNotifications = useCallback(async (showLoadingState = true) => {
    if (!scopes.length) return;

    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await api.notifications.list();
      
      if (response?.data && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Erro ao buscar avisos:", err);
      setError("Não foi possível carregar os avisos. Tente novamente mais tarde.");
      setNotifications([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [scopes.length]);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  // Função para criar aviso
  const createNotification = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData);
      const response = await api.notifications.create(backendData);
      
      if (response?.data) {
        await fetchNotifications(false);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: "Erro ao criar aviso" };
    } catch (error) {
      console.error("Erro ao criar aviso:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "criar")
      };
    }
  }, [fetchNotifications]);

  // Função para atualizar aviso
  const updateNotification = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData);
      const response = await api.notifications.update(id, backendData);
      
      if (response?.data) {
        await fetchNotifications(false);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: "Erro ao atualizar aviso" };
    } catch (error) {
      console.error("Erro ao atualizar aviso:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "atualizar")
      };
    }
  }, [fetchNotifications]);

  // Função para excluir aviso
  const deleteNotification = useCallback(async (id) => {
    try {
      await api.notifications.delete(id);
      await fetchNotifications(false);
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir aviso:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "excluir")
      };
    }
  }, [fetchNotifications]);

  // Carregar escopos na inicialização
  useEffect(() => {
    fetchScopes();
  }, [fetchScopes]);

  // Carregar avisos quando escopos estiverem disponíveis
  useEffect(() => {
    if (scopes.length > 0) {
      fetchNotifications(true);
    }
  }, [scopes.length, fetchNotifications]);

  return {
    notifications: transformedNotifications,
    scopes,
    isLoading,
    error,
    createNotification,
    updateNotification,
    deleteNotification,
    refetch
  };
};
