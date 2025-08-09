import { useState, useCallback } from 'react';

/**
 * Hook reutilizável para operações CRUD comuns
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
            
            const errorMessage = getErrorMessage(error);
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
 * Extrai mensagem de erro padronizada
 */
const getErrorMessage = (error) => {
    if (error.message) {
        return error.message;
    } 
    
    if (error.data?.error) {
        return error.data.error;
    }
    
    switch (error.status) {
        case 409:
            return 'Conflito: O item já existe no sistema.';
        case 400:
            return 'Dados inválidos. Verifique os campos obrigatórios.';
        case 404:
            return 'Item não encontrado.';
        case 500:
            return 'Erro interno do servidor. Tente novamente.';
        default:
            return 'Erro inesperado. Tente novamente.';
    }
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

        // Tempo estimado considerando velocidade média urbana de 30 km/h
        const estimatedTime = (totalDistance / 30) * 60; // em minutos

        return {
            totalDistance,
            estimatedTime,
            segments,
            averageSpeed: 30 // km/h
        };
    }, [calculateDistance]);

    return {
        calculateDistance,
        validateCoordinates,
        formatCoordinates,
        calculateRouteStats
    };
};
