import { useState, useCallback } from 'react';

/**
 * Hook para calcular rotas reais entre pontos usando OSRM
 */
export const useRouting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cacheHits, setCacheHits] = useState(0);
    const [apiCalls, setApiCalls] = useState(0);

    // Cache simples em memória
    const routeCache = new Map();

    /**
     * Busca a rota real entre dois pontos usando OSRM
     */
    const getRouteWithOSRM = useCallback(async (start, end) => {
        const cacheKey = `${start.lat},${start.lng}-${end.lat},${end.lng}`;
        
        // Verificar cache primeiro
        if (routeCache.has(cacheKey)) {
            setCacheHits(prev => prev + 1);
            return routeCache.get(cacheKey);
        }

        try {
            setApiCalls(prev => prev + 1);
            
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na API OSRM: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.routes && data.routes[0] && data.routes[0].geometry) {
                // Converter coordenadas [lng, lat] para [lat, lng] para o Leaflet
                const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                // Salvar no cache
                routeCache.set(cacheKey, routeCoordinates);
                
                return routeCoordinates;
            }
            
            throw new Error('Rota não encontrada');
            
        } catch (error) {
            console.warn('Erro ao buscar rota OSRM:', error);
            
            // Fallback para linha reta
            const fallbackRoute = [[start.lat, start.lng], [end.lat, end.lng]];
            routeCache.set(cacheKey, fallbackRoute);
            
            return fallbackRoute;
        }
    }, []);

    /**
     * Calcula rotas reais para uma sequência de pontos
     */
    const calculateRealRoute = useCallback(async (points, service = 'osrm') => {
        if (!points || points.length < 2) {
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const routeSegments = [];
            
            // Processar segmentos sequencialmente
            for (let i = 0; i < points.length - 1; i++) {
                const start = {
                    lat: parseFloat(points[i].latitude),
                    lng: parseFloat(points[i].longitude)
                };
                const end = {
                    lat: parseFloat(points[i + 1].latitude),
                    lng: parseFloat(points[i + 1].longitude)
                };

                const routeCoordinates = await getRouteWithOSRM(start, end);
                
                routeSegments.push({
                    coordinates: routeCoordinates,
                    from: points[i],
                    to: points[i + 1],
                    segmentIndex: i
                });
            }
            
            return routeSegments;
        } catch (error) {
            console.error('Erro ao calcular rota real:', error);
            setError(error.message);
            
            // Fallback para linhas retas
            const fallbackSegments = points.slice(0, -1).map((point, index) => ({
                coordinates: [
                    [parseFloat(point.latitude), parseFloat(point.longitude)],
                    [parseFloat(points[index + 1].latitude), parseFloat(points[index + 1].longitude)]
                ],
                from: point,
                to: points[index + 1],
                segmentIndex: index
            }));
            
            return fallbackSegments;
        } finally {
            setLoading(false);
        }
    }, [getRouteWithOSRM]);

    /**
     * Combina todos os segmentos em uma única polyline
     */
    const combineRouteSegments = useCallback((segments) => {
        if (!segments || segments.length === 0) {
            return [];
        }

        const allCoordinates = [];
        
        segments.forEach((segment, index) => {
            if (segment.coordinates && segment.coordinates.length > 0) {
                // Para o primeiro segmento, adiciona todas as coordenadas
                if (index === 0) {
                    allCoordinates.push(...segment.coordinates);
                } else {
                    // Para segmentos subsequentes, adiciona apenas as coordenadas após o primeiro ponto
                    // (para evitar duplicação do ponto de conexão)
                    allCoordinates.push(...segment.coordinates.slice(1));
                }
            }
        });
        
        return allCoordinates;
    }, []);

    /**
     * Obtém estatísticas do cache
     */
    const getCacheStats = useCallback(() => {
        return {
            hits: cacheHits,
            apiCalls: apiCalls,
            hitRate: apiCalls > 0 ? ((cacheHits / (cacheHits + apiCalls)) * 100).toFixed(1) : 0,
            cacheSize: routeCache.size
        };
    }, [cacheHits, apiCalls]);

    return {
        loading,
        error,
        calculateRealRoute,
        combineRouteSegments,
        getRouteWithOSRM,
        getCacheStats,
        // Estatísticas do cache para compatibilidade
        cacheStats: {
            hits: cacheHits,
            apiCalls: apiCalls,
            hitRate: apiCalls > 0 ? ((cacheHits / (cacheHits + apiCalls)) * 100).toFixed(1) : 0,
            cacheSize: routeCache.size
        }
    };
};