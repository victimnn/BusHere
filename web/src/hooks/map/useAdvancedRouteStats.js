import { useCallback } from 'react';

/**
 * Hook para cálculos avançados de estatísticas de rota
 */
export const useAdvancedRouteStats = () => {
    /**
     * Calcula a distância real de uma polyline (sequência de coordenadas)
     * @param {Array} coordinates - Array de coordenadas [[lat, lng], [lat, lng], ...]
     * @returns {number} Distância em quilômetros
     */
    const calculatePolylineDistance = useCallback((coordinates) => {
        if (!coordinates || coordinates.length < 2) {
            return 0;
        }

        let totalDistance = 0;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const [lat1, lng1] = coordinates[i];
            const [lat2, lng2] = coordinates[i + 1];
            
            // Fórmula de Haversine para calcular distância entre dois pontos
            const R = 6371; // Raio da Terra em km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c; // Distância em km

            totalDistance += distance;
        }

        return totalDistance;
    }, []);

    /**
     * Calcula estatísticas avançadas considerando rotas reais
     * @param {Array} points - Pontos da rota
     * @param {Array} routeSegments - Segmentos de rota real (opcional)
     * @param {Object} options - Opções de cálculo
     * @returns {Object} Estatísticas calculadas
     */
    const calculateAdvancedRouteStats = useCallback((points, routeSegments = null, options = {}) => {
        const defaultOptions = {
            averageSpeed: 50, // km/h - Velocidade média urbana atualizada
            useRealRoutes: true,
            includeDetailedSegments: true
        };

        const config = { ...defaultOptions, ...options };

        if (!points || points.length < 2) {
            return {
                totalDistance: 0,
                estimatedTime: 0,
                segments: [],
                averageSpeed: config.averageSpeed,
                method: 'none',
                accuracy: 'none'
            };
        }

        let totalDistance = 0;
        let segments = [];
        let method = 'direct'; // 'direct' ou 'real'
        let accuracy = 'approximated'; // 'approximated' ou 'precise'

        // Se temos segmentos de rota real, usar eles
        if (config.useRealRoutes && routeSegments && routeSegments.length > 0) {
            method = 'real';
            accuracy = 'precise';

            routeSegments.forEach((segment, index) => {
                const segmentDistance = calculatePolylineDistance(segment.coordinates);
                totalDistance += segmentDistance;

                if (config.includeDetailedSegments) {
                    segments.push({
                        from: segment.from,
                        to: segment.to,
                        distance: segmentDistance,
                        index: index,
                        coordinates: segment.coordinates,
                        coordinatesCount: segment.coordinates.length,
                        method: 'real_route'
                    });
                }
            });
        } else {
            // Fallback para cálculo direto (linha reta)
            method = 'direct';
            accuracy = 'approximated';

            for (let i = 0; i < points.length - 1; i++) {
                const point1 = points[i];
                const point2 = points[i + 1];
                
                // Cálculo direto usando Haversine
                const segmentDistance = calculatePolylineDistance([
                    [parseFloat(point1.latitude), parseFloat(point1.longitude)],
                    [parseFloat(point2.latitude), parseFloat(point2.longitude)]
                ]);

                totalDistance += segmentDistance;
                
                if (config.includeDetailedSegments) {
                    segments.push({
                        from: point1,
                        to: point2,
                        distance: segmentDistance,
                        index: i,
                        coordinates: [
                            [parseFloat(point1.latitude), parseFloat(point1.longitude)],
                            [parseFloat(point2.latitude), parseFloat(point2.longitude)]
                        ],
                        coordinatesCount: 2,
                        method: 'direct_line'
                    });
                }
            }
        }

        // Cálculo do tempo estimado
        const estimatedTime = (totalDistance / config.averageSpeed) * 60; // em minutos

        // Estatísticas adicionais
        const stats = {
            totalDistance,
            estimatedTime,
            segments,
            averageSpeed: config.averageSpeed,
            method,
            accuracy,
            
            // Informações detalhadas
            details: {
                totalPoints: points.length,
                totalSegments: segments.length,
                averageSegmentDistance: segments.length > 0 ? totalDistance / segments.length : 0,
                estimatedTimeFormatted: formatTime(estimatedTime),
                speedUnit: 'km/h',
                distanceUnit: 'km'
            },

            // Comparação com velocidades diferentes
            timeVariations: {
                conservative: (totalDistance / 30) * 60, // 30 km/h
                moderate: (totalDistance / 40) * 60,     // 40 km/h
                current: estimatedTime,                   // 50 km/h
                optimistic: (totalDistance / 60) * 60    // 60 km/h
            }
        };

        return stats;
    }, [calculatePolylineDistance]);

    /**
     * Formata tempo em minutos para uma string legível
     * @param {number} minutes - Tempo em minutos
     * @returns {string} Tempo formatado
     */
    const formatTime = useCallback((minutes) => {
        if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        }
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        
        return `${hours}h ${remainingMinutes}min`;
    }, []);

    /**
     * Compara estatísticas entre diferentes métodos de cálculo
     * @param {Array} points - Pontos da rota
     * @param {Array} routeSegments - Segmentos de rota real
     * @returns {Object} Comparação detalhada
     */
    const compareRouteMethods = useCallback((points, routeSegments) => {
        const directStats = calculateAdvancedRouteStats(points, null, { useRealRoutes: false });
        const realStats = calculateAdvancedRouteStats(points, routeSegments, { useRealRoutes: true });

        const distanceDifference = realStats.totalDistance - directStats.totalDistance;
        const timeDifference = realStats.estimatedTime - directStats.estimatedTime;
        const accuracyImprovement = ((distanceDifference / directStats.totalDistance) * 100);

        return {
            direct: directStats,
            real: realStats,
            comparison: {
                distanceDifference: Math.abs(distanceDifference),
                timeDifference: Math.abs(timeDifference),
                accuracyImprovement: Math.abs(accuracyImprovement),
                isRealRouteLonger: distanceDifference > 0,
                improvementPercentage: accuracyImprovement.toFixed(1)
            }
        };
    }, [calculateAdvancedRouteStats]);

    return {
        calculateAdvancedRouteStats,
        calculatePolylineDistance,
        formatTime,
        compareRouteMethods
    };
};
