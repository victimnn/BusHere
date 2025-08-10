/**
 * Sistema de cache para rotas calculadas
 */
class RouteCache {
    constructor(maxSize = 100, ttlMinutes = 30) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttlMinutes * 60 * 1000; // Converter para millisegundos
    }

    /**
     * Gera uma chave única baseada nos pontos da rota
     * @param {Object} start - Ponto inicial { lat, lng }
     * @param {Object} end - Ponto final { lat, lng }
     * @param {string} service - Serviço usado ('osrm' ou 'openrouteservice')
     * @returns {string} Chave única para o cache
     */
    generateKey(start, end, service = 'osrm') {
        // Arredondar coordenadas para 6 casas decimais para criar chaves consistentes
        const startKey = `${parseFloat(start.lat).toFixed(6)},${parseFloat(start.lng).toFixed(6)}`;
        const endKey = `${parseFloat(end.lat).toFixed(6)},${parseFloat(end.lng).toFixed(6)}`;
        return `${service}:${startKey}-${endKey}`;
    }

    /**
     * Gera chave para uma sequência de pontos
     * @param {Array} points - Array de pontos
     * @param {string} service - Serviço usado
     * @returns {string} Chave única para a sequência
     */
    generateSequenceKey(points, service = 'osrm') {
        const coordsString = points
            .map(p => `${parseFloat(p.latitude).toFixed(6)},${parseFloat(p.longitude).toFixed(6)}`)
            .join('|');
        return `${service}:sequence:${coordsString}`;
    }

    /**
     * Verifica se uma entrada do cache ainda é válida
     * @param {Object} entry - Entrada do cache
     * @returns {boolean} true se ainda válida
     */
    isValid(entry) {
        return Date.now() - entry.timestamp < this.ttl;
    }

    /**
     * Obtém uma rota do cache
     * @param {string} key - Chave da rota
     * @returns {Array|null} Coordenadas da rota ou null se não encontrada/expirada
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        if (!this.isValid(entry)) {
            this.cache.delete(key);
            return null;
        }

        // Atualizar timestamp para LRU
        entry.lastAccessed = Date.now();
        return entry.data;
    }

    /**
     * Armazena uma rota no cache
     * @param {string} key - Chave da rota
     * @param {Array} data - Coordenadas da rota
     */
    set(key, data) {
        // Verificar se precisa remover entradas antigas
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
        const now = Date.now();
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

            const toRemove = Math.ceil(this.maxSize * 0.2); // Remove 20%
            for (let i = 0; i < toRemove && sortedEntries[i]; i++) {
                this.cache.delete(sortedEntries[i][0]);
            }
        }
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Obtém estatísticas do cache
     * @returns {Object} Estatísticas
     */
    getStats() {
        const now = Date.now();
        const entries = Array.from(this.cache.values());
        const validEntries = entries.filter(entry => this.isValid(entry));

        return {
            total: this.cache.size,
            valid: validEntries.length,
            expired: this.cache.size - validEntries.length,
            maxSize: this.maxSize,
            usage: (this.cache.size / this.maxSize * 100).toFixed(1) + '%',
            oldestEntry: entries.length > 0 
                ? Math.max(...entries.map(e => now - e.timestamp)) 
                : 0
        };
    }

    /**
     * Pré-aquece o cache com rotas comuns
     * @param {Array} commonRoutes - Array de rotas comuns
     */
    async preWarm(commonRoutes) {
        console.log('Pré-aquecendo cache de rotas...');
        
        for (const route of commonRoutes) {
            const key = this.generateKey(route.start, route.end, route.service || 'osrm');
            
            if (!this.get(key)) {
                // Simular delay para não sobrecarregar APIs
                await new Promise(resolve => setTimeout(resolve, 200));
                // Aqui você implementaria a chamada real da API
                console.log(`Cache pré-aquecido para rota: ${key}`);
            }
        }
    }
}

// Instância singleton do cache
export const routeCache = new RouteCache(150, 60); // 150 entradas, TTL de 1 hora

// Cache específico para sequências de pontos (rotas completas)
export const sequenceCache = new RouteCache(50, 120); // 50 sequências, TTL de 2 horas

/**
 * Hook personalizado para gerenciar cache de coordenadas
 */
export const useCacheManager = () => {
    const clearCache = () => {
        routeCache.clear();
        sequenceCache.clear();
        localStorage.removeItem('routeCache_backup');
        console.log('Cache de rotas limpo');
    };

    const getStats = () => {
        return {
            segmentCache: routeCache.getStats(),
            sequenceCache: sequenceCache.getStats()
        };
    };

    const saveToLocalStorage = () => {
        try {
            const cacheData = {
                segments: Array.from(routeCache.cache.entries()),
                sequences: Array.from(sequenceCache.cache.entries()),
                timestamp: Date.now()
            };
            localStorage.setItem('routeCache_backup', JSON.stringify(cacheData));
            console.log('Cache salvo no localStorage');
        } catch (error) {
            console.warn('Erro ao salvar cache no localStorage:', error);
        }
    };

    const loadFromLocalStorage = () => {
        try {
            const cached = localStorage.getItem('routeCache_backup');
            if (!cached) return false;

            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            // Só carregar se o backup for recente (menos de 6 horas)
            if (age > 6 * 60 * 60 * 1000) {
                localStorage.removeItem('routeCache_backup');
                return false;
            }

            // Restaurar cache de segmentos
            cacheData.segments.forEach(([key, entry]) => {
                if (routeCache.isValid(entry)) {
                    routeCache.cache.set(key, entry);
                }
            });

            // Restaurar cache de sequências
            cacheData.sequences.forEach(([key, entry]) => {
                if (sequenceCache.isValid(entry)) {
                    sequenceCache.cache.set(key, entry);
                }
            });

            console.log('Cache restaurado do localStorage');
            return true;
        } catch (error) {
            console.warn('Erro ao carregar cache do localStorage:', error);
            localStorage.removeItem('routeCache_backup');
            return false;
        }
    };

    return {
        clearCache,
        getStats,
        saveToLocalStorage,
        loadFromLocalStorage
    };
};
