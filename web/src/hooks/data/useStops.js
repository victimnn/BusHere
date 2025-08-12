import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';
import { formatDateFromDatabase } from '@shared/formatters';

// Função para transformar dados do backend para frontend
const transformStopData = (stop) => {
  return {
    id: stop.ponto_id,
    ponto_id: stop.ponto_id, // Manter compatibilidade
    nome: stop.nome,
    latitude: stop.latitude,
    longitude: stop.longitude,
    logradouro: stop.logradouro,
    numero_endereco: stop.numero_endereco,
    bairro: stop.bairro,
    cidade: stop.cidade,
    uf: stop.uf,
    cep: stop.cep,
    referencia: stop.referencia,
    criacao: stop.criacao,
    atualizacao: stop.atualizacao,
    ativo: stop.ativo,
    status: stop.ativo ? 'Ativo' : 'Inativo',
    // Campos formatados para uso na UI
    coordinates: `${Number(stop.latitude).toFixed(4)}, ${Number(stop.longitude).toFixed(4)}`,
    address: `${stop.logradouro}, ${stop.numero_endereco} - ${stop.bairro}, ${stop.cidade} - ${stop.uf}`,
    endereco: `${stop.logradouro}, ${stop.numero_endereco} - ${stop.bairro}, ${stop.cidade} - ${stop.uf}`
  };
};

// Função para preparar dados para o backend
const prepareBackendData = (formData) => {
  // As coordenadas devem sempre estar presentes, pois vêm do mapa
  if (!formData.latitude || !formData.longitude) {
    console.error('❌ Coordenadas ausentes!');
    throw new Error('Erro interno: coordenadas não encontradas. Tente criar o ponto novamente através do mapa.');
  }

  // O backend espera um campo 'coordinates' como array [latitude, longitude]
  const coordinates = [Number(formData.latitude), Number(formData.longitude)];

  const backendData = {
    nome: formData.nome,
    coordinates: coordinates, // Backend espera este campo como array
    latitude: Number(formData.latitude), // Manter para compatibilidade se necessário
    longitude: Number(formData.longitude), // Manter para compatibilidade se necessário
    logradouro: formData.logradouro || null,
    numero_endereco: formData.numero_endereco || null,
    bairro: formData.bairro || null,
    cidade: formData.cidade || null,
    uf: formData.uf || null,
    cep: formData.cep || null,
    referencia: formData.referencia || null,
    ativo: formData.ativo !== undefined ? formData.ativo : true
  };
  
  return backendData;
};

// Função utilitária para processar mensagens de erro
const getErrorMessage = (error, action) => {
  const baseMessage = `Erro ao ${action} ponto: `;

  // Tratar erros de coordenadas/internos
  if (error.message?.includes('Erro interno:') || error.message?.includes('coordenadas não encontradas')) {
    return error.message; // Retorna a mensagem completa
  }

  // Tratar erros específicos do backend com mais detalhes
  if (error.data) {
    // Se há uma mensagem específica do backend
    if (error.data.message) {
      return baseMessage + error.data.message;
    }
    
    // Se há um campo error específico
    if (error.data.error) {
      return baseMessage + error.data.error;
    }
    
    // Se há erros de validação detalhados
    if (error.data.errors && Array.isArray(error.data.errors)) {
      const validationErrors = error.data.errors
        .map(err => err.message || err.field || err)
        .join(', ');
      return baseMessage + `Erros de validação: ${validationErrors}`;
    }
    
    // Se há detalhes específicos
    if (error.data.details) {
      return baseMessage + error.data.details;
    }
  }

  // Tratar erros 400 (Bad Request) com informação mais específica
  if (error.status === 400) {
    return baseMessage + "Dados inválidos enviados para o servidor. Verifique os logs do console para mais detalhes.";
  }

  // Tratar outros erros de validação
  if (error.message?.includes('obrigatória') || error.message?.includes('obrigatório')) {
    return baseMessage + error.message;
  }

  if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
    return baseMessage + error.message;
  }
  
  if (error.message?.includes('409')) {
    return baseMessage + "Ponto já cadastrado no sistema.";
  }
  
  return baseMessage + (error.message || "Tente novamente mais tarde");
};

export const useStops = () => {
  // Estados
  const [stops, setStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([-22.698, -47.009]);

  // Memoizar transformação dos dados dos pontos
  const transformedStops = useMemo(() => {
    if (!stops.length) return [];
    
    return stops.map(stop => transformStopData(stop));
  }, [stops]);

  // Função otimizada para buscar pontos
  const fetchStops = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await api.stops.list();

      if (response && Array.isArray(response)) {
        setStops(response);
        
        // Centraliza o mapa calculando a média das coordenadas dos pontos
        if (response.length > 0) {
          const avgLat = response.reduce((sum, stop) => sum + parseFloat(stop.latitude), 0) / response.length;
          const avgLng = response.reduce((sum, stop) => sum + parseFloat(stop.longitude), 0) / response.length;
          setMapCenter([avgLat, avgLng]);
        } else {
          setMapCenter([-22.698, -47.009]);
        }
      } else {
        setStops([]);
      }
    } catch (err) {
      console.error("Erro ao buscar pontos:", err);
      setError("Não foi possível carregar os pontos. Tente novamente mais tarde.");
      setStops([]);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Função de retry para recarregar dados
  const refetch = useCallback(() => {
    fetchStops(true);
  }, [fetchStops]);

  // Função para criar ponto
  const createStop = useCallback(async (formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.stops.create(backendData);
      await fetchStops(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar ponto:", error);
      return {
        success: false, 
        error: getErrorMessage(error, "criar")
      };
    }
  }, [fetchStops]);

  // Função para atualizar ponto
  const updateStop = useCallback(async (id, formData) => {
    try {
      const backendData = prepareBackendData(formData);
      await api.stops.update(id, backendData);
      await fetchStops(false); // Recarregar sem loading state
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar ponto:", error);
      return {
        success: false,
        error: getErrorMessage(error, "atualizar")
      };
    }
  }, [fetchStops]);

  // Função para excluir ponto
  const deleteStop = useCallback(async (id) => {
    try {
      await api.stops.delete(id);
      
      // Atualiza o estado local removendo o ponto excluído
      setStops(prevStops => prevStops.filter(stop => stop.ponto_id !== id));
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir ponto:", error);
      return {
        success: false,
        error: getErrorMessage(error, "excluir")
      };
    }
  }, []);

  // Função para buscar um ponto específico por ID
  const getStopById = useCallback(async (id) => {
    try {
      const response = await api.stops.getById(id);
      
      // Transformar os dados para o formato usado no frontend
      if (response) {
        const transformedStop = transformStopData(response);
        return { 
          success: true, 
          data: transformedStop 
        };
      } else {
        return { 
          success: true, 
          data: response 
        };
      }
    } catch (error) {
      console.error("Erro ao buscar ponto por ID:", error);
      return {
        success: false,
        error: getErrorMessage(error, "buscar")
      };
    }
  }, []);

  // Função para buscar pontos por nome
  const searchStops = useCallback(async (name) => {
    try {
      const response = await api.stops.search(name);
      
      if (response && Array.isArray(response)) {
        const transformedStops = response.map(stop => transformStopData(stop));
        return { 
          success: true, 
          data: transformedStops 
        };
      } else {
        return { 
          success: true, 
          data: [] 
        };
      }
    } catch (error) {
      console.error("Erro ao buscar pontos por nome:", error);
      return {
        success: false,
        error: getErrorMessage(error, "buscar")
      };
    }
  }, []);

  // Função utilitária para encontrar um ponto por ID
  const findStopById = useCallback((id) => {
    return transformedStops.find(stop => stop.ponto_id === id || stop.id === id);
  }, [transformedStops]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  return {
    // Estados
    stops: transformedStops,
    isLoading,
    error,
    mapCenter,
    
    // Ações
    createStop,
    updateStop,  
    deleteStop,
    getStopById,
    searchStops,
    refetch,
    
    // Utilitários
    findStopById
  };
};
