import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { removeFormatting, formatDateFromDatabase} from '@shared/formatters';

// Tipos padrão como fallback
const DEFAULT_BUSES_STATUS = [
  { status_onibus_id: 1, nome: 'Em Operação' },
  { status_onibus_id: 2, nome: 'Em Manutenção' },
  { status_onibus_id: 3, nome: 'Inativo' }
];

// Função para transformar dados do backend para frontend
const transformBusData = (bus, getStatusOnibusNome) => ({
  id: bus.onibus_id,
  onibus_id: bus.onibus_id,
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
  status: getStatusOnibusNome(bus.status_onibus_id)
});

// Função para preparar dados para o backend
const prepareBackendData = (formData, isCreate = false) => {
  // Campos obrigatórios para backend
  const backendData = {
    nome: formData.nome || 'Ônibus sem nome',
    placa: removeFormatting(formData.placa) || 'AAA0A00',
    modelo: formData.modelo || 'Modelo não informado',
    marca: formData.marca || 'Marca não informada',
    ano_fabricacao: formData.ano_fabricacao ? Number(formData.ano_fabricacao) : new Date().getFullYear(),
    capacidade: formData.capacidade ? Number(formData.capacidade) : 50,
    quilometragem: formData.quilometragem ? Number(formData.quilometragem) : 0,
    data_ultima_manutencao: formData.data_ultima_manutencao || null,
    data_proxima_manutencao: formData.data_proxima_manutencao || null,
    status_onibus_id: formData.status_onibus ? Number(formData.status_onibus) : null,
    ativo: formData.ativo !== undefined ? formData.ativo : true
  };
  // Remove campos nulos ou undefined
  Object.keys(backendData).forEach(key => {
    if (backendData[key] === null || backendData[key] === undefined) {
      delete backendData[key];
    }
  });
  return backendData;
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
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOnibus, setStatusOnibus] = useState([]);

  const getStatusOnibusNome = useCallback((statusId) => {
    const status = statusOnibus.find(s => s.status_onibus_id === statusId);
    return status ? status.nome : 'Não informado';
  }, [statusOnibus]);

  const transformedBuses = useMemo(() => {
    if (!buses.length || !statusOnibus.length) return [];
    return buses.map(bus => 
      transformBusData(bus, getStatusOnibusNome)
    );
  }, [buses, statusOnibus, getStatusOnibusNome]);

  const fetchStatusOnibus = useCallback(async () => {
    try {
      const response = await api.buses.getStatus();
      if (response?.data && Array.isArray(response.data)) {
        setStatusOnibus(response.data);
      } else {
        setStatusOnibus(DEFAULT_BUSES_STATUS);
      }
    } catch (error) {
      console.error("Erro ao buscar status de ônibus:", error);
      setStatusOnibus(DEFAULT_BUSES_STATUS);
    }
  }, []);

  const fetchBuses = useCallback(async (showLoadingState = true) => {
    if (statusOnibus.length === 0) return;

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
      setError(getErrorMessage(err, "buscar"));
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [statusOnibus.length]);

  const refetch = useCallback(() => {
    fetchBuses(true);
  }, [fetchBuses]);

  const createBus = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData, true);
      await api.buses.create(backendData);
      await fetchBuses(false);
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar ônibus:", error);
      return {
        success: false, 
        error: getErrorMessage(error, "criar")
      };
    }
  }, [fetchBuses]);

  const updateBus = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData, false);
      await api.buses.update(id, backendData);
      await fetchBuses(false);
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar ônibus:", error);
      return {
        success: false,
        error: getErrorMessage(error, "atualizar")
      };
    }
  }, [fetchBuses]);

  const deleteBus = useCallback(async (id) => {
    try {
        await api.buses.delete(id);
        await fetchBuses(false);
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir ônibus:", error);
        return {
            success: false,
            error: getErrorMessage(error, "excluir")
        };
    }
  }, [fetchBuses]);

  const getOnibusById = useCallback(async (id) => {
    try {
      const response = await api.buses.getById(id);
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error("Erro ao buscar ônibus por ID:", error);
        return {
            success: false,
            error: getErrorMessage(error, "buscar")
        };
    }
  }, []);

  useEffect(() => {
    fetchStatusOnibus();
  }, [fetchStatusOnibus]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return {
    buses: transformedBuses,
    isLoading,
    error,
    statusOnibus,

    createBus,
    updateBus,  
    deleteBus,
    getOnibusById,
    refetch,

    getStatusOnibusNome
  };
};

