import { useState, useCallback, useEffect } from 'react';

/**
 * Sistema de cache simples para rotas calculadas
 */
class RouteCache {
    constructor(maxSize = 100, ttlMinutes = 30) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttlMinutes * 60 * 1000; // Converter para millisegundos
    }

    /**
     * Gera uma chave única baseada nos pontos da rota
     */
    generateKey(start, end, service = 'osrm') {
        const startKey = `${parseFloat(start.lat).toFixed(6)},${parseFloat(start.lng).toFixed(6)}`;
        const endKey = `${parseFloat(end.lat).toFixed(6)},${parseFloat(end.lng).toFixed(6)}`;
        return `${service}:${startKey}-${endKey}`;
    }

    /**
     * Gera chave para uma sequência de pontos
     */
    generateSequenceKey(points, service = 'osrm') {
        const coordsString = points
            .map(p => `${parseFloat(p.latitude).toFixed(6)},${parseFloat(p.longitude).toFixed(6)}`)
            .join('|');
        return `${service}:sequence:${coordsString}`;
    }

    /**
     * Verifica se uma entrada do cache ainda é válida
     */
    isValid(entry) {
        return Date.now() - entry.timestamp < this.ttl;
    }

    /**
     * Obtém uma rota do cache
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry || !this.isValid(entry)) {
            if (entry) this.cache.delete(key);
            return null;
        }

        entry.lastAccessed = Date.now();
        return entry.data;
    }

    /**
     * Armazena uma rota no cache
     */
    set(key, data) {
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        const entry = {
            data: data,
            timestamp: Date.now(),
            lastAccessed: Date.now()
        };

        this.cache.set(key, entry);
    }

    /**
     * Remove entradas expiradas e antigas (LRU)
     */
    cleanup() {
        const entries = Array.from(this.cache.entries());

        // Remover entradas expiradas
        entries.forEach(([key, entry]) => {
            if (!this.isValid(entry)) {
                this.cache.delete(key);
            }
        });

        // Se ainda estiver cheio, remover as menos acessadas
        if (this.cache.size >= this.maxSize) {
            const sortedEntries = Array.from(this.cache.entries())
                .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

            const toRemove = Math.ceil(this.maxSize * 0.2);
            for (let i = 0; i < toRemove && sortedEntries[i]; i++) {
                this.cache.delete(sortedEntries[i][0]);
            }
        }
    }
}

// Instâncias do cache
const routeCache = new RouteCache(150, 60); // 150 entradas, TTL de 1 hora
const sequenceCache = new RouteCache(50, 120); // 50 sequências, TTL de 2 horas

/**
 * Hook para calcular rotas reais entre pontos usando OSRM
 */
export const useRouting = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cacheHits, setCacheHits] = useState(0);
    const [apiCalls, setApiCalls] = useState(0);

    /**
     * Busca a rota real entre dois pontos usando OSRM
     */
    const getRouteWithOSRM = useCallback(async (start, end) => {
        const cacheKey = routeCache.generateKey(start, end, 'osrm');
        
        // Verificar cache primeiro
        const cachedRoute = routeCache.get(cacheKey);
        if (cachedRoute) {
            setCacheHits(prev => prev + 1);
            return cachedRoute;
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
            
            return [];
        } catch (error) {
            console.warn('Erro ao buscar rota OSRM:', error);
            // Fallback para linha reta se a API falhar
            const fallbackRoute = [[start.lat, start.lng], [end.lat, end.lng]];
            
            // Salvar fallback no cache com TTL menor
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

        // Verificar cache para sequência completa
        const sequenceKey = sequenceCache.generateSequenceKey(points, service);
        const cachedSequence = sequenceCache.get(sequenceKey);
        
        if (cachedSequence) {
            setCacheHits(prev => prev + 1);
            return cachedSequence;
        }

        setLoading(true);
        setError(null);

        try {
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

                // Pequeno delay para evitar rate limiting
                if (i < points.length - 2) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // Salvar sequência completa no cache
            sequenceCache.set(sequenceKey, routeSegments);
            
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
            
            sequenceCache.set(sequenceKey, fallbackSegments);
            
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
