import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { formatCPF, formatPhoneNumber, removeFormatting, formatDateFromDatabase } from '@shared/formatters';

// Status padrão como fallback
const DEFAULT_DRIVER_STATUS = [
  { status_motorista_id: 1, nome: 'Ativo' },
  { status_motorista_id: 2, nome: 'Férias' },
  { status_motorista_id: 3, nome: 'Afastado' },
  { status_motorista_id: 4, nome: 'Inativo' }
];

// Função para transformar dados do backend para frontend
const transformDriverData = (driver, getStatusMotoristaName) => ({
  id: driver.motorista_id,
  motorista_id: driver.motorista_id, // Manter compatibilidade
  nome: driver.nome,
  cpf: formatCPF(driver.cpf),
  cnh_numero: driver.cnh_numero,
  cnh_categoria: driver.cnh_categoria,
  cnh_validade: formatDateFromDatabase(driver.cnh_validade),
  telefone: formatPhoneNumber(driver.telefone),
  email: driver.email,
  data_admissao: formatDateFromDatabase(driver.data_admissao),
  status_motorista_id: driver.status_motorista_id,
  status_nome: getStatusMotoristaName(driver.status_motorista_id),
  ativo: driver.ativo
});

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  return {
    nome: formData.nome,
    cpf: removeFormatting(formData.cpf),
    cnh_numero: formData.cnh_numero,
    cnh_categoria: formData.cnh_categoria,
    cnh_validade: formData.cnh_validade,
    telefone: removeFormatting(formData.telefone),
    email: formData.email || null,
    data_admissao: formData.data_admissao || null,
    status_motorista_id: formData.status_motorista_id
  };
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} motorista: `;
  
  if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
    return baseMessage + error.message;
  }
  
  if (error.message?.includes('409')) {
    return baseMessage + "CPF, CNH ou email já cadastrado no sistema.";
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useDrivers = () => {
  // Estados
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMotorista, setStatusMotorista] = useState([]);

  // Memoizar função para obter nome do status do motorista
  const getStatusMotoristaName = useCallback((status_motorista_id) => {
    const status = statusMotorista.find(s => s.status_motorista_id === status_motorista_id);
    return status ? status.nome : 'Não informado';
  }, [statusMotorista]);

  // Memoizar transformação dos dados dos motoristas
  const transformedDrivers = useMemo(() => {
    if (!drivers.length || !statusMotorista.length) return [];
    
    return drivers.map(driver => 
      transformDriverData(driver, getStatusMotoristaName)
    );
  }, [drivers, getStatusMotoristaName]);

  // Função para buscar status de motorista
  const fetchStatusMotorista = useCallback(async () => {
    try {
      const response = await api.drivers.getStatus();
      if (response?.data) {
        setStatusMotorista(response.data);
      } else {
        setStatusMotorista(DEFAULT_DRIVER_STATUS);
      }
    } catch (error) {
      console.error('Erro ao carregar status de motorista:', error);
      setStatusMotorista(DEFAULT_DRIVER_STATUS);
    }
  }, []);

  // Função otimizada para buscar motoristas
  const fetchDrivers = useCallback(async (showLoadingState = true) => {
    if (!statusMotorista.length) return;

    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await api.drivers.list(1, 100, '');
      
      if (response?.data && Array.isArray(response.data)) {
        setDrivers(response.data);
      } else {
        setDrivers([]);
      }
    } catch (err) {
      console.error("Erro ao buscar motoristas:", err);
      setError("Não foi possível carregar os motoristas. Tente novamente mais tarde.");
      setDrivers([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [statusMotorista.length]);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchDrivers(true);
  }, [fetchDrivers]);

  // Função para criar motorista
  const createDriver = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.drivers.create(backendData);
      await fetchDrivers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar motorista:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "criar") 
      };
    }
  }, [fetchDrivers]);

  // Função para atualizar motorista
  const updateDriver = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.drivers.update(id, backendData);
      await fetchDrivers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "atualizar") 
      };
    }
  }, [fetchDrivers]);

  // Função para excluir motorista
  const deleteDriver = useCallback(async (id) => {
    try {
      await api.drivers.delete(id);
      await fetchDrivers(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir motorista:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "excluir") 
      };
    }
  }, [fetchDrivers]);

  // Função para buscar um motorista específico por ID
  const getDriverById = useCallback(async (id) => {
    try {
      const response = await api.drivers.getById(id);
      
      // Transformar os dados para o formato usado no frontend
      if (response && statusMotorista.length > 0) {
        const transformedDriver = transformDriverData(response, getStatusMotoristaName);
        return { 
          success: true, 
          data: transformedDriver 
        };
      } else {
        return { 
          success: true, 
          data: response 
        };
      }
    } catch (error) {
      console.error("Erro ao buscar motorista:", error);
      return { 
        success: false, 
        error: getErrorMessage(error, "buscar") 
      };
    }
  }, [getStatusMotoristaName, statusMotorista.length]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchStatusMotorista();
  }, [fetchStatusMotorista]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    // Estados
    drivers: transformedDrivers,
    isLoading,
    error,
    statusMotorista,
    
    // Ações
    createDriver,
    updateDriver,
    deleteDriver,
    getDriverById,
    refetch,
    
    // Utilitários
    getStatusMotoristaName
  };
};
