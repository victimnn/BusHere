import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { 
    transformRouteData, 
    prepareRouteBackendData, 
    getRouteErrorMessage, 
    useRouteStatus 
} from '../operations/useRouteOperations';

export const useRoutes = () => {
  // Estados
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar hook de status de rotas
  const { statusRota, setRouteStatus, getStatusRotaNome } = useRouteStatus();

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
      
      // Verificar diferentes estruturas de resposta
      let statusData = [];
      if (response?.data && Array.isArray(response.data)) {
        statusData = response.data;
      } else if (Array.isArray(response)) {
        statusData = response;
      }
      
      setRouteStatus(statusData);
    } catch (error) {
      console.error("Erro ao buscar status de rota:", error);
      setRouteStatus([]); // Vai usar DEFAULT_ROUTE_STATUS
    }
  }, [setRouteStatus]);

  // Função otimizada para buscar rotas
  const fetchRoutes = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await api.routes.list(1, 100, '');

      if (response?.data && Array.isArray(response.data)) {
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
      const backendData = prepareRouteBackendData(formData);
      await api.routes.create(backendData);
      await fetchRoutes(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      return {
        success: false, 
        error: getRouteErrorMessage(error, "criar rota")
      };
    }
  }, [fetchRoutes]);

  // Função para atualizar rota
  const updateRoute = useCallback(async (id, formData) => {
    try {
      const backendData = prepareRouteBackendData(formData);
      await api.routes.update(id, backendData);
      await fetchRoutes(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar rota:", error);
      return {
        success: false,
        error: getRouteErrorMessage(error, "atualizar rota")
      };
    }
  }, [fetchRoutes]);

  // Função para excluir rota
  const deleteRoute = useCallback(async (id) => {
    try {
        // Verificar se a rota existe e tem associações
        let route;
        try {
            route = await api.routes.getById(id);
        } catch (getError) {
            console.error('Erro ao buscar rota para exclusão:', getError);
            return {
                success: false,
                error: "Rota não encontrada ou não pode ser acessada."
            };
        }
        
        // Tentar remover associações de ônibus/motorista primeiro
        if (route.onibus_id || route.motorista_id) {
            try {
                const assignmentsResponse = await api.routes.getAssignments(id);
                const assignments = assignmentsResponse.data || [];
                
                // Remover todas as associações ativas
                for (const assignment of assignments) {
                    if (assignment.ativo) {
                        await api.routes.deleteAssignment(id, assignment.onibus_rota_id);
                    }
                }
            } catch (assignmentError) {
                console.error('Erro ao remover associações:', assignmentError);
                return {
                    success: false,
                    error: "Erro ao remover associações da rota. Verifique se não há dependências ativas."
                };
            }
        }
        
        // Excluir a rota
        await api.routes.delete(id);
        await fetchRoutes(false); // Recarregar sem loading state
        return { success: true };
        
    } catch (error) {
        console.error("Erro ao excluir rota:", error);
        
        // Mensagem específica baseada no erro
        let errorMessage = getRouteErrorMessage(error, "excluir rota");
        
        if (error.status === 500) {
            errorMessage = "Erro interno do servidor. A rota pode ter dependências que impedem sua exclusão (pontos da rota, logs de localização, etc.).";
        } else if (error.message?.includes('constraint') || error.message?.includes('foreign key')) {
            errorMessage = "Não é possível excluir esta rota pois existem dependências vinculadas (pontos, ônibus, motoristas ou dados históricos).";
        } else if (error.status === 409) {
            errorMessage = "Conflito: Esta rota está sendo utilizada e não pode ser excluída no momento.";
        }
        
        return {
            success: false,
            error: errorMessage
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
        error: getRouteErrorMessage(error, "buscar rota")
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
