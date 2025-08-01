import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { removeFormatting, formatDateFromDatabase} from '@shared/formatters';

// Status padrão como fallback
const DEFAULT_BUS_STATUS = [
  { status_onibus_id: 1, nome: 'Em Operação' },
  { status_onibus_id: 2, nome: 'Em Manutenção' },
  { status_onibus_id: 3, nome: 'Inativo' }
];

// Função para transformar dados do backend para frontend
const transformBusData = (bus, getStatusOnibusNome) => ({
  id: bus.onibus_id,
  onibus_id: bus.onibus_id, // Manter compatibilidade
  placa: bus.placa,
  nome: bus.nome,
  modelo: bus.modelo,
  marca: bus.marca,
  ano_fabricacao: bus.ano_fabricacao,
  capacidade: bus.capacidade,
  quilometragem: bus.quilometragem,
  data_ultima_manutencao: bus.data_ultima_manutencao ? formatDateFromDatabase(bus.data_ultima_manutencao) : null,
  data_proxima_manutencao: bus.data_proxima_manutencao ? formatDateFromDatabase(bus.data_proxima_manutencao) : null,
  status_onibus_id: bus.status_onibus_id,
  status: getStatusOnibusNome(bus.status_onibus_id),
  status_nome: getStatusOnibusNome(bus.status_onibus_id),
  ativo: bus.ativo
});

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  return {
    nome: formData.nome,
    placa: removeFormatting(formData.placa),
    modelo: formData.modelo || null,
    marca: formData.marca || null,
    ano_fabricacao: formData.ano_fabricacao ? Number(formData.ano_fabricacao) : null,
    capacidade: formData.capacidade ? Number(formData.capacidade) : null,
    quilometragem: formData.quilometragem ? Number(formData.quilometragem) : null,
    data_ultima_manutencao: formData.data_ultima_manutencao || null,
    data_proxima_manutencao: formData.data_proxima_manutencao || null,
    status_onibus_id: formData.status_onibus_id || formData.status_onibus ? Number(formData.status_onibus_id || formData.status_onibus) : null,
    ativo: formData.ativo !== undefined ? formData.ativo : true
  };
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} ônibus: `;

  if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
    return baseMessage + error.message;
  }
  
  if (error.message?.includes('409')) {
    return baseMessage + "Placa já cadastrada no sistema.";
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useBuses = () => {
  // Estados
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOnibus, setStatusOnibus] = useState([]);

  // Memoizar função para obter nome do status do ônibus
  const getStatusOnibusNome = useCallback((statusId) => {
    const status = statusOnibus.find(s => s.status_onibus_id === statusId);
    return status ? status.nome : 'Não informado';
  }, [statusOnibus]);

  // Memoizar transformação dos dados dos ônibus
  const transformedBuses = useMemo(() => {
    if (!buses.length || !statusOnibus.length) return [];
    return buses.map(bus => 
      transformBusData(bus, getStatusOnibusNome)
    );
  }, [buses, statusOnibus, getStatusOnibusNome]);

  // Função para buscar status de ônibus
  const fetchStatusOnibus = useCallback(async () => {
    try {
      const response = await api.buses.getStatus();
      if (response?.data && Array.isArray(response.data)) {
        setStatusOnibus(response.data);
      } else {
        setStatusOnibus(DEFAULT_BUS_STATUS);
      }
    } catch (error) {
      console.error("Erro ao buscar status de ônibus:", error);
      setStatusOnibus(DEFAULT_BUS_STATUS);
    }
  }, []);

  // Função otimizada para buscar ônibus
  const fetchBuses = useCallback(async (showLoadingState = true) => {
    if (!statusOnibus.length) return;

    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await api.buses.list(1, 100, '');

      if (response?.data && Array.isArray(response.data)) {
        setBuses(response.data);
      } else {
        setBuses([]);
      }
    } catch (err) {
      console.error("Erro ao buscar ônibus:", err);
      setError("Não foi possível carregar os ônibus. Tente novamente mais tarde.");
      setBuses([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [statusOnibus.length]);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchBuses(true);
  }, [fetchBuses]);

  // Função para criar ônibus
  const createBus = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.buses.create(backendData);
      await fetchBuses(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar ônibus:", error);
      return {
        success: false, 
        error: getErrorMessage(error, "criar")
      };
    }
  }, [fetchBuses]);

  // Função para atualizar ônibus
  const updateBus = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.buses.update(id, backendData);
      await fetchBuses(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar ônibus:", error);
      return {
        success: false,
        error: getErrorMessage(error, "atualizar")
      };
    }
  }, [fetchBuses]);

  // Função para excluir ônibus
  const deleteBus = useCallback(async (id) => {
    try {
        await api.buses.delete(id);
        await fetchBuses(false); // Recarregar sem loading state
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir ônibus:", error);
        return {
            success: false,
            error: getErrorMessage(error, "excluir")
        };
    }
  }, [fetchBuses]);

  // Função para buscar um ônibus específico por ID
  const getBusById = useCallback(async (id) => {
    try {
      const response = await api.buses.getById(id);
      
      // Transformar os dados para o formato usado no frontend
      if (response && statusOnibus.length > 0) {
        const transformedBus = transformBusData(response, getStatusOnibusNome);
        return { 
          success: true, 
          data: transformedBus 
        };
      } else {
        return { 
          success: true, 
          data: response 
        };
      }
    } catch (error) {
      console.error("Erro ao buscar ônibus por ID:", error);
      return {
        success: false,
        error: getErrorMessage(error, "buscar")
      };
    }
  }, [getStatusOnibusNome, statusOnibus.length]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchStatusOnibus();
  }, [fetchStatusOnibus]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return {
    // Estados
    buses: transformedBuses,
    isLoading,
    error,
    statusOnibus,
    
    // Ações
    createBus,
    updateBus,  
    deleteBus,
    getBusById,
    refetch,
    
    // Utilitários
    getStatusOnibusNome
  };
};

