import { useState, useCallback } from 'react';

// Status padrão como fallback
const DEFAULT_ROUTE_STATUS = [
  { status_rota_id: 1, nome: 'Ativa' },
  { status_rota_id: 2, nome: 'Inativa' },
  { status_rota_id: 3, nome: 'Em Manutenção' }
];

/**
 * Hook reutilizável para operações de rotas comuns
 */
export const useApiOperation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeOperation = useCallback(async (operation, successMessage) => {
        try {
            setLoading(true);
            setError(null);

            const result = await operation();
            
            return { 
                success: true, 
                data: result,
                message: successMessage || 'Operação realizada com sucesso!'
            };

        } catch (error) {
            console.error('Erro na operação:', error);
            
            const errorMessage = getRouteErrorMessage(error, 'executar operação');
            setError(errorMessage);
            
            return { 
                success: false, 
                error: errorMessage 
            };

        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        setError,
        executeOperation
    };
};

/**
 * Função utilitária para processar mensagens de erro específicas de rotas
 */
export const getRouteErrorMessage = (error, action) => {
    const baseMessage = `Erro ao ${action}: `;

    // Priorizar mensagens específicas do backend
    if (error.data?.error) {
        return baseMessage + error.data.error;
    }

    if (error.message?.includes('já cadastrado') || error.message?.includes('já está sendo usado')) {
        return baseMessage + error.message;
    }
    
    if (error.message?.includes('409') || error.status === 409) {
        return baseMessage + "Código de rota já cadastrado no sistema.";
    }

    if (error.message && error.message !== 'Ocorreu um erro na requisição') {
        return baseMessage + error.message;
    } 
    
    switch (error.status) {
        case 400:
            return baseMessage + 'Dados inválidos. Verifique os campos obrigatórios.';
        case 404:
            return baseMessage + 'Rota não encontrada.';
        case 500:
            return baseMessage + 'Erro interno do servidor. Tente novamente.';
        default:
            return baseMessage + (error.message || "Tente novamente mais tarde");
    }
};

/**
 * Função para transformar dados do backend para frontend
 */
export const transformRouteData = (route, getStatusRotaNome) => {
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
        ativo: route.ativo,
        // Informações de ônibus e motorista
        onibus_id: route.onibus_id || null,
        motorista_id: route.motorista_id || null,
        observacoes_assignment: route.observacoes_assignment || null,
        onibus_nome: route.onibus_nome || null,
        onibus_placa: route.onibus_placa || null,
        motorista_nome: route.motorista_nome || null,
        motorista_cnh: route.motorista_cnh || null
    };
};

/**
 * Função para preparar dados para o backend
 */
export const prepareRouteBackendData = (formData) => {
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

/**
 * Hook para gerenciar status de rotas
 */
export const useRouteStatus = () => {
    const [statusRota, setStatusRota] = useState([]);

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

    const setRouteStatus = useCallback((statusData) => {
        let formattedStatus = [];
        if (statusData && Array.isArray(statusData) && statusData.length > 0) {
            formattedStatus = statusData;
        } else {
            formattedStatus = DEFAULT_ROUTE_STATUS;
        }
        setStatusRota(formattedStatus);
    }, []);

    return {
        statusRota,
        setRouteStatus,
        getStatusRotaNome,
        DEFAULT_ROUTE_STATUS
    };
};

/**
 * Hook para funções utilitárias de coordenadas
 */
export const useCoordinateUtils = () => {
    // Função para calcular distância entre dois pontos usando fórmula de Haversine
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }, []);

    // Função para validar coordenadas
    const validateCoordinates = useCallback((lat, lng) => {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return false;
        }
        
        // Validar limites globais
        if (latitude < -90 || latitude > 90) {
            return false;
        }
        
        if (longitude < -180 || longitude > 180) {
            return false;
        }
        
        return true;
    }, []);

    // Função para formatar coordenadas
    const formatCoordinates = useCallback((lat, lng, precision = 6) => {
        return {
            latitude: parseFloat(lat).toFixed(precision),
            longitude: parseFloat(lng).toFixed(precision),
            display: `${parseFloat(lat).toFixed(precision)}, ${parseFloat(lng).toFixed(precision)}`
        };
    }, []);

    // Função para calcular estatísticas da rota
    const calculateRouteStats = useCallback((points) => {
        if (!points || points.length < 2) {
            return {
                totalDistance: 0,
                estimatedTime: 0,
                segments: []
            };
        }

        let totalDistance = 0;
        const segments = [];

        for (let i = 0; i < points.length - 1; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];
            
            const segmentDistance = calculateDistance(
                point1.latitude,
                point1.longitude,
                point2.latitude,
                point2.longitude
            );

            totalDistance += segmentDistance;
            
            segments.push({
                from: point1,
                to: point2,
                distance: segmentDistance,
                index: i
            });
        }

        // Tempo estimado considerando velocidade média urbana de 50 km/h
        const estimatedTime = (totalDistance / 50) * 60; // em minutos

        return {
            totalDistance,
            estimatedTime,
            segments,
            averageSpeed: 50 // km/h - Atualizado para 50 km/h
        };
    }, [calculateDistance]);

    return {
        calculateDistance,
        validateCoordinates,
        formatCoordinates,
        calculateRouteStats
    };
};
