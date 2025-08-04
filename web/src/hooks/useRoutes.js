import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { formatDateFromDatabase } from '@shared/formatters';

// Status padrão como fallback
const DEFAULT_ROUTE_STATUS = [
  { status_rota_id: 1, nome: 'Ativa' },
  { status_rota_id: 2, nome: 'Inativa' },
  { status_rota_id: 3, nome: 'Em Manutenção' }
];

// Função para transformar dados do backend para frontend
const transformRouteData = (route, getStatusRotaNome) => {
  // Tentar obter o status de diferentes formas
  let statusText = 'Não informado';
  
  if (route.status_nome) {
    statusText = route.status_nome;
  } else if (route.status) {
    statusText = route.status;
  } else if (route.status_rota_id) {
    statusText = getStatusRotaNome(route.status_rota_id);
  }
  
  return {
    id: route.rota_id,
    rota_id: route.rota_id, // Manter compatibilidade
    codigo_rota: route.codigo_rota,
    nome: route.nome,
    origem_descricao: route.origem_descricao,
    destino_descricao: route.destino_descricao,
    distancia_km: route.distancia_km,
    tempo_viagem_estimado_minutos: route.tempo_viagem_estimado_minutos,
    status_rota_id: route.status_rota_id,
    status: statusText,
    status_nome: statusText,
    ativo: route.ativo
  };
};

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  return {
    codigo_rota: formData.codigo_rota,
    nome: formData.nome,
    origem_descricao: formData.origem_descricao || null,
    destino_descricao: formData.destino_descricao || null,
    distancia_km: formData.distancia_km ? Number(formData.distancia_km) : null,
    tempo_viagem_estimado_minutos: formData.tempo_viagem_estimado_minutos ? Number(formData.tempo_viagem_estimado_minutos) : null,
    status_rota_id: formData.status_rota_id || formData.status_rota ? Number(formData.status_rota_id || formData.status_rota) : null,
    ativo: formData.ativo !== undefined ? formData.ativo : true
  };
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} rota: `;

  if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
    return baseMessage + error.message;
  }
  
  if (error.message?.includes('409')) {
    return baseMessage + "Código de rota já cadastrado no sistema.";
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useRoutes = () => {
  // Estados
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusRota, setStatusRota] = useState([]);

  // Memoizar função para obter nome do status da rota
  const getStatusRotaNome = useCallback((statusId) => {
    if (!statusId) return 'Não informado';
    
    // Converter para número se necessário
    const numericId = typeof statusId === 'string' ? parseInt(statusId, 10) : statusId;
    
    const status = statusRota.find(s => 
      s.status_rota_id === numericId || 
      s.id === numericId ||
      s.status_rota_id === statusId ||
      s.id === statusId
    );
    
    return status ? status.nome : 'Não informado';
  }, [statusRota]);

  // Memoizar transformação dos dados das rotas
  const transformedRoutes = useMemo(() => {
    if (!routes.length) return [];
    
    return routes.map(route => 
      transformRouteData(route, getStatusRotaNome)
    );
  }, [routes, statusRota, getStatusRotaNome]);

  // Função para buscar status de rotas
  const fetchStatusRota = useCallback(async () => {
    try {
      const response = await api.routes.getStatus();
      
      console.log('Resposta da API de status de rotas:', response);
      
      // Verificar diferentes estruturas de resposta
      let statusData = [];
      if (response?.data && Array.isArray(response.data)) {
        statusData = response.data;
      } else if (Array.isArray(response)) {
        statusData = response;
      } else {
        statusData = DEFAULT_ROUTE_STATUS;
      }
      
      setStatusRota(statusData);
    } catch (error) {
      console.error("Erro ao buscar status de rota:", error);
      setStatusRota(DEFAULT_ROUTE_STATUS);
    }
  }, []);

  // Função otimizada para buscar rotas
  const fetchRoutes = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await api.routes.list(1, 100, '');
      
      console.log('Resposta da API de rotas:', response);

      if (response?.data && Array.isArray(response.data)) {
        console.log('Dados das rotas recebidos:', response.data);
        setRoutes(response.data);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar rotas:", err);
      setError("Não foi possível carregar as rotas. Tente novamente mais tarde.");
      setRoutes([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchRoutes(true);
  }, [fetchRoutes]);

  // Função para criar rota
  const createRoute = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.routes.create(backendData);
      await fetchRoutes(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      return {
        success: false, 
        error: getErrorMessage(error, "criar")
      };
    }
  }, [fetchRoutes]);

  // Função para atualizar rota
  const updateRoute = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.routes.update(id, backendData);
      await fetchRoutes(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar rota:", error);
      return {
        success: false,
        error: getErrorMessage(error, "atualizar")
      };
    }
  }, [fetchRoutes]);

  // Função para excluir rota
  const deleteRoute = useCallback(async (id) => {
    try {
        await api.routes.delete(id);
        await fetchRoutes(false); // Recarregar sem loading state
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir rota:", error);
        return {
            success: false,
            error: getErrorMessage(error, "excluir")
        };
    }
  }, [fetchRoutes]);

  // Função para buscar uma rota específica por ID
  const getRouteById = useCallback(async (id) => {
    try {
      const response = await api.routes.getById(id);
      
      // Transformar os dados para o formato usado no frontend
      if (response && statusRota.length > 0) {
        const transformedRoute = transformRouteData(response, getStatusRotaNome);
        return { 
          success: true, 
          data: transformedRoute 
        };
      } else {
        return { 
          success: true, 
          data: response 
        };
      }
    } catch (error) {
      console.error("Erro ao buscar rota por ID:", error);
      return {
        success: false,
        error: getErrorMessage(error, "buscar")
      };
    }
  }, [getStatusRotaNome, statusRota.length]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      // Carregar status primeiro, depois rotas
      await fetchStatusRota();
      await fetchRoutes();
    };
    
    loadData();
  }, [fetchStatusRota, fetchRoutes]);

  return {
    // Estados
    routes: transformedRoutes,
    isLoading,
    error,
    statusRota,
    
    // Ações
    createRoute,
    updateRoute,  
    deleteRoute,
    getRouteById,
    refetch,
    
    // Utilitários
    getStatusRotaNome
  };
};
