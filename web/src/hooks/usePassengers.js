import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { formatCPF, formatPhoneNumber, removeFormatting } from '@shared/formatters';

// Tipos padrão como fallback
const DEFAULT_PASSENGER_TYPES = [
  { tipo_passageiro_id: 1, nome: 'Estudante' },
  { tipo_passageiro_id: 2, nome: 'Corporativo' }
];

// Função para transformar dados do backend para frontend
const transformPassengerData = (passenger, getTipoPassageiroNome) => ({
  id: passenger.passageiro_id,
  nome: passenger.nome_completo,
  cpf: formatCPF(passenger.cpf),
  email: passenger.email,
  telefone: formatPhoneNumber(passenger.telefone),
  tipo_passageiro_id: passenger.tipo_passageiro_id,
  tipo_passageiro: getTipoPassageiroNome(passenger.tipo_passageiro_id)
});

// Função para preparar dados para o backend
const prepareBackendData = (formData, isCreate = false) => {
  const baseData = {
    nome_completo: formData.nome,
    cpf: removeFormatting(formData.cpf),
    telefone: removeFormatting(formData.telefone),
    email: formData.email || '',
    tipo_passageiro_id: formData.tipo_passageiro
  };

  // Adicionar campos obrigatórios apenas para criação
  if (isCreate) {
    return {
      ...baseData,
      senha_hash: 'temp_hash_' + Date.now(),
      logradouro: 'Endereço não informado',
      numero_endereco: '1',
      bairro: 'Não informado',
      cidade: 'Não informada',
      uf: 'XX',
      cep: '00000000'
    };
  }

  return baseData;
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} passageiro: `;
  
  if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
    return baseMessage + error.message;
  }
  
  if (error.message?.includes('409')) {
    return baseMessage + "CPF ou email já cadastrado no sistema.";
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const usePassengers = () => {
  // Estados
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiposPassageiro, setTiposPassageiro] = useState([]);

  // Memoizar função para obter nome do tipo de passageiro
  const getTipoPassageiroNome = useCallback((tipo_passageiro_id) => {
    const tipo = tiposPassageiro.find(t => t.tipo_passageiro_id === tipo_passageiro_id);
    return tipo ? tipo.nome : 'Não informado';
  }, [tiposPassageiro]);

  // Memoizar transformação dos dados dos passageiros
  const transformedPassengers = useMemo(() => {
    if (!passengers.length || !tiposPassageiro.length) return [];
    
    return passengers.map(passenger => 
      transformPassengerData(passenger, getTipoPassageiroNome)
    );
  }, [passengers, getTipoPassageiroNome]);

  // Função para buscar tipos de passageiro
  const fetchTiposPassageiro = useCallback(async () => {
    try {
      const response = await api.passengers.getTypes();
      if (response?.data) {
        setTiposPassageiro(response.data);
      } else {
        setTiposPassageiro(DEFAULT_PASSENGER_TYPES);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de passageiro:', error);
      setTiposPassageiro(DEFAULT_PASSENGER_TYPES);
    }
  }, []);

  // Função otimizada para buscar passageiros
  const fetchPassengers = useCallback(async (showLoadingState = true) => {
    if (!tiposPassageiro.length) return;

    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await api.passengers.list(1, 100, '');
      
      if (response?.data && Array.isArray(response.data)) {
        setPassengers(response.data);
      } else {
        setPassengers([]);
      }
    } catch (err) {
      console.error("Erro ao buscar passageiros:", err);
      setError("Não foi possível carregar os passageiros. Tente novamente mais tarde.");
      setPassengers([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [tiposPassageiro.length]);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchPassengers(true);
  }, [fetchPassengers]);

  // Função para criar passageiro
  const createPassenger = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData, true);
      await api.passengers.create(backendData);
      await fetchPassengers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar passageiro:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "criar") 
      };
    }
  }, [fetchPassengers]);

  // Função para atualizar passageiro
  const updatePassenger = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData, false);
      await api.passengers.update(id, backendData);
      await fetchPassengers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar passageiro:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "atualizar") 
      };
    }
  }, [fetchPassengers]);

  // Função para excluir passageiro
  const deletePassenger = useCallback(async (id) => {
    try {
      await api.passengers.delete(id);
      await fetchPassengers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir passageiro:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "excluir") 
      };
    }
  }, [fetchPassengers]);

  // Função para buscar um passageiro específico por ID
  const getPassengerById = useCallback(async (id) => {
    try {
      const response = await api.passengers.getById(id);
      return { 
        success: true, 
        data: response 
      };
    } catch (error) {
      console.error("Erro ao buscar passageiro:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "buscar") 
      };
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchTiposPassageiro();
  }, [fetchTiposPassageiro]);

  useEffect(() => {
    fetchPassengers();
  }, [fetchPassengers]);

  return {
    // Estados
    passengers: transformedPassengers,
    isLoading,
    error,
    tiposPassageiro,
    
    // Ações
    createPassenger,
    updatePassenger,
    deletePassenger,
    getPassengerById,
    refetch,
    
    // Utilitários
    getTipoPassageiroNome
  };
};
