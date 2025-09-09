import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { removeFormatting, removePlateFormatting, formatDateFromDatabase} from '@shared/formatters';

// Status padrão como fallback
const DEFAULT_VEHICLE_STATUS = [
  { status_veiculo_id: 1, nome: 'Em Operação' },
  { status_veiculo_id: 2, nome: 'Em Manutenção' },
  { status_veiculo_id: 3, nome: 'Inativo' }
];

// Tipos padrão como fallback
const DEFAULT_VEHICLE_TYPES = [
  { tipo_veiculo_id: 1, nome: 'Ônibus', descricao: 'Veículo de transporte coletivo com capacidade para 40+ passageiros' },
  { tipo_veiculo_id: 2, nome: 'Micro-ônibus', descricao: 'Veículo de transporte coletivo com capacidade para 15-30 passageiros' },
  { tipo_veiculo_id: 3, nome: 'Van', descricao: 'Veículo de transporte coletivo com capacidade para 8-15 passageiros' },
  { tipo_veiculo_id: 4, nome: 'Caminhão', descricao: 'Veículo para transporte de cargas' }
];

// Função para transformar dados do backend para frontend
const transformVehicleData = (vehicle, getStatusVeiculoNome, getTipoVeiculoNome) => ({
  id: vehicle.veiculo_id,
  veiculo_id: vehicle.veiculo_id, // Manter compatibilidade
  placa: vehicle.placa,
  nome: vehicle.nome,
  modelo: vehicle.modelo,
  marca: vehicle.marca,
  ano_fabricacao: vehicle.ano_fabricacao,
  capacidade: vehicle.capacidade,
  quilometragem: vehicle.quilometragem,
  data_ultima_manutencao: vehicle.data_ultima_manutencao ? formatDateFromDatabase(vehicle.data_ultima_manutencao) : null,
  data_proxima_manutencao: vehicle.data_proxima_manutencao ? formatDateFromDatabase(vehicle.data_proxima_manutencao) : null,
  tipo_veiculo_id: vehicle.tipo_veiculo_id,
  tipo_nome: getTipoVeiculoNome(vehicle.tipo_veiculo_id),
  status_veiculo_id: vehicle.status_veiculo_id,
  status: getStatusVeiculoNome(vehicle.status_veiculo_id),
  status_nome: getStatusVeiculoNome(vehicle.status_veiculo_id),
  ativo: vehicle.ativo
});

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  return {
    nome: formData.nome,
    placa: removePlateFormatting(formData.placa),
    modelo: formData.modelo || null,
    marca: formData.marca || null,
    ano_fabricacao: formData.ano_fabricacao ? Number(formData.ano_fabricacao) : null,
    capacidade: formData.capacidade ? Number(formData.capacidade) : null,
    quilometragem: formData.quilometragem ? Number(formData.quilometragem) : null,
    data_ultima_manutencao: formData.data_ultima_manutencao || null,
    data_proxima_manutencao: formData.data_proxima_manutencao || null,
    tipo_veiculo_id: formData.tipo_veiculo_id || formData.tipo_veiculo ? Number(formData.tipo_veiculo_id || formData.tipo_veiculo) : null,
    status_veiculo_id: formData.status_veiculo_id || formData.status_veiculo ? Number(formData.status_veiculo_id || formData.status_veiculo) : null,
    ativo: formData.ativo !== undefined ? formData.ativo : true
  };
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} veículo: `;
  
  if (error?.data?.error) {
    return baseMessage + error.data.error;
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useVehicles = () => {
  // Estados
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusVeiculo, setStatusVeiculo] = useState([]);
  const [tiposVeiculo, setTiposVeiculo] = useState([]);

  // Memoizar função para obter nome do status do veículo
  const getStatusVeiculoNome = useCallback((statusId) => {
    const status = statusVeiculo.find(s => s.status_veiculo_id === statusId);
    return status ? status.nome : 'Não informado';
  }, [statusVeiculo]);

  // Memoizar função para obter nome do tipo do veículo
  const getTipoVeiculoNome = useCallback((tipoId) => {
    const tipo = tiposVeiculo.find(t => t.tipo_veiculo_id === tipoId);
    return tipo ? tipo.nome : 'Não informado';
  }, [tiposVeiculo]);

  // Memoizar transformação dos dados dos veículos
  const transformedVehicles = useMemo(() => {
    if (!vehicles.length) return [];
    return vehicles.map(vehicle => 
      transformVehicleData(vehicle, getStatusVeiculoNome, getTipoVeiculoNome)
    );
  }, [vehicles, statusVeiculo, tiposVeiculo, getStatusVeiculoNome, getTipoVeiculoNome]);

  // Função para buscar status de veículos
  const fetchStatusVeiculo = useCallback(async () => {
    try {
      const response = await api.vehicles.getStatus();
      
      if (response?.data && Array.isArray(response.data)) {
        setStatusVeiculo(response.data);
      } else {
        setStatusVeiculo(DEFAULT_VEHICLE_STATUS);
      }
    } catch (error) {
      console.error("Erro ao buscar status de veículos:", error);
      setStatusVeiculo(DEFAULT_VEHICLE_STATUS);
    }
  }, []);

  // Função para buscar tipos de veículos
  const fetchTiposVeiculo = useCallback(async () => {
    try {
      const response = await api.vehicles.getTypes();
      
      if (response?.data && Array.isArray(response.data)) {
        setTiposVeiculo(response.data);
      } else {
        setTiposVeiculo(DEFAULT_VEHICLE_TYPES);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de veículos:", error);
      setTiposVeiculo(DEFAULT_VEHICLE_TYPES);
    }
  }, []);

  // Função otimizada para buscar veículos
  const fetchVehicles = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await api.vehicles.list(1, 100, '');

      if (response?.data && Array.isArray(response.data)) {
        setVehicles(response.data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Erro ao buscar veículos:", err);
      setError("Não foi possível carregar os veículos. Tente novamente mais tarde.");
      setVehicles([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchVehicles(true);
    fetchStatusVeiculo();
    fetchTiposVeiculo();
  }, [fetchVehicles, fetchStatusVeiculo, fetchTiposVeiculo]);

  // Função para criar veículo
  const createVehicle = useCallback(async (formData) => {
    try {
      setError(null);
      const backendData = prepareBackendData(formData);
      
      const response = await api.vehicles.create(backendData);
      
      if (response) {
        // Recarrega a lista após criar
        await fetchVehicles(false);
        return { success: true };
      }
      
      throw new Error("Resposta inválida do servidor");
    } catch (err) {
      const errorMessage = getErrorMessage(err, "criar");
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [fetchVehicles]);

  // Função para atualizar veículo
  const updateVehicle = useCallback(async (id, formData) => {
    try {
      setError(null);
      const backendData = prepareBackendData(formData);
      
      const response = await api.vehicles.update(id, backendData);
      
      if (response) {
        // Recarrega a lista após atualizar
        await fetchVehicles(false);
        return { success: true };
      }
      
      throw new Error("Resposta inválida do servidor");
    } catch (err) {
      const errorMessage = getErrorMessage(err, "atualizar");
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [fetchVehicles]);

  // Função para deletar veículo
  const deleteVehicle = useCallback(async (id) => {
    try {
      setError(null);
      
      const response = await api.vehicles.delete(id);
      
      if (response) {
        // Recarrega a lista após deletar
        await fetchVehicles(false);
        return { success: true };
      }
      
      throw new Error("Resposta inválida do servidor");
    } catch (err) {
      const errorMessage = getErrorMessage(err, "deletar");
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [fetchVehicles]);

  // Função para buscar veículo por ID
  const getVehicleById = useCallback(async (id) => {
    try {
      setError(null);
      const response = await api.vehicles.getById(id);
      
      if (response) {
        return response;
      }
      
      throw new Error("Veículo não encontrado");
    } catch (err) {
      const errorMessage = getErrorMessage(err, "buscar");
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchVehicles(),
        fetchStatusVeiculo(),
        fetchTiposVeiculo()
      ]);
    };

    loadInitialData();
  }, [fetchVehicles, fetchStatusVeiculo, fetchTiposVeiculo]);

  return {
    // Estados
    vehicles: transformedVehicles,
    isLoading,
    error,
    statusVeiculo,
    tiposVeiculo,
    
    // Funções
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    refetch,
    
    // Funções utilitárias
    getStatusVeiculoNome,
    getTipoVeiculoNome,
    
    // Funções de busca (para uso externo se necessário)
    fetchVehicles,
    fetchStatusVeiculo,
    fetchTiposVeiculo
  };
};
