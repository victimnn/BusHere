import { useState, useCallback, useEffect } from 'react';
import { routeCache, sequenceCache, useCacheManager } from './useRouteCache';

/**
 * Hook para calcular rotas reais entre pontos usando OSRM
 */
export const useRouting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cacheHits, setCacheHits] = useState(0);
    const [apiCalls, setApiCalls] = useState(0);
    const { loadFromLocalStorage, saveToLocalStorage } = useCacheManager();

    // Carregar cache do localStorage na inicialização
    useEffect(() => {
        loadFromLocalStorage();
        
        // Salvar cache periodicamente (a cada 5 minutos)
        const interval = setInterval(() => {
            saveToLocalStorage();
        }, 5 * 60 * 1000);

        // Salvar cache antes de sair da página
        const handleBeforeUnload = () => {
            saveToLocalStorage();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            saveToLocalStorage();
        };
    }, [loadFromLocalStorage, saveToLocalStorage]);

    /**
     * Busca a rota real entre dois pontos usando OSRM
     * @param {Object} start - Ponto inicial { lat, lng }
     * @param {Object} end - Ponto final { lat, lng }
     * @returns {Array} Array de coordenadas da rota
     */
    const getRouteWithOSRM = useCallback(async (start, end) => {
        const cacheKey = routeCache.generateKey(start, end, 'osrm');
        
        // Verificar cache primeiro
        const cachedRoute = routeCache.get(cacheKey);
        if (cachedRoute) {
            setCacheHits(prev => prev + 1);
            console.log(`✅ Cache HIT para: ${cacheKey}`);
            return cachedRoute;
        }

        try {
            setApiCalls(prev => prev + 1);
            console.log(`🌐 Fazendo chamada OSRM para: ${cacheKey}`);
            
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
                console.log(`💾 Salvando no cache: ${cacheKey}`);
                
                return routeCoordinates;
            }
            
            return [];
        } catch (error) {
            console.warn('⚠️ Erro ao buscar rota OSRM:', error);
            // Fallback para linha reta se a API falhar
            const fallbackRoute = [[start.lat, start.lng], [end.lat, end.lng]];
            
            // Salvar fallback no cache com TTL menor
            routeCache.set(cacheKey, fallbackRoute);
            
            return fallbackRoute;
        }
    }, []);

    /**
     * Calcula rotas reais para uma sequência de pontos
     * @param {Array} points - Array de pontos { latitude, longitude }
     * @param {string} service - Serviço a usar ('osrm')
     * @returns {Array} Array de segmentos de rota
     */
    const calculateRealRoute = useCallback(async (points, service = 'osrm') => {
        if (!points || points.length < 2) {
            return [];
        }

        // Verificar cache para sequência completa
        const sequenceKey = sequenceCache.generateSequenceKey(points, service);
        const cachedSequence = sequenceCache.get(sequenceKey);
        
        if (cachedSequence) {
            setCacheHits(prev => prev + 1);
            console.log(`✅ Cache HIT para sequência completa: ${sequenceKey}`);
            return cachedSequence;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`🚀 Iniciando cálculo de rota com ${points.length} pontos...`);
            const startTime = performance.now();
            
            const routeSegments = [];
            
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

                if (routeCoordinates.length > 0) {
                    routeSegments.push({
                        coordinates: routeCoordinates,
                        from: points[i],
                        to: points[i + 1],
                        segmentIndex: i
                    });
                }

                // Pequeno delay para evitar rate limiting (só se não vier do cache)
                if (i < points.length - 2) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            const endTime = performance.now();
            console.log(`⏱️ Rota calculada em ${(endTime - startTime).toFixed(0)}ms`);

            // Salvar sequência completa no cache
            sequenceCache.set(sequenceKey, routeSegments);
            
            return routeSegments;
        } catch (error) {
            console.error('❌ Erro ao calcular rota real:', error);
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
            
            // Salvar fallback no cache
            sequenceCache.set(sequenceKey, fallbackSegments);
            
            return fallbackSegments;
        } finally {
            setLoading(false);
        }
    }, [getRouteWithOSRM]);

    /**
     * Combina todos os segmentos em uma única polyline
     * @param {Array} segments - Array de segmentos de rota
     * @returns {Array} Array de coordenadas para polyline
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
                    // Para segmentos subsequentes, pula a primeira coordenada para evitar duplicação
                    allCoordinates.push(...segment.coordinates.slice(1));
                }
            }
        });
        
        return allCoordinates;
    }, []);

    return {
        loading,
        error,
        calculateRealRoute,
        combineRouteSegments,
        getRouteWithOSRM,
        // Estatísticas do cache
        cacheStats: {
            hits: cacheHits,
            apiCalls: apiCalls,
            hitRate: apiCalls > 0 ? ((cacheHits / (cacheHits + apiCalls)) * 100).toFixed(1) : 0
        }
    };
};