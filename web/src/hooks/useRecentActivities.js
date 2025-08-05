import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '@web/api/api';

export const useRecentActivities = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const usersCacheRef = useRef(new Map());

    // Função para buscar informações do usuário e cachear
    const fetchUserInfo = useCallback(async (userId) => {
        if (!userId) return null;
        
        const cache = usersCacheRef.current;
        // Verifica se já ta no cache
        if (cache.has(userId)) {
            return cache.get(userId);
        }

        try {
            const userInfo = await api.enterpriseUsers.get(userId);
            const userData = {
                id: userId,
                nome: userInfo?.nome || userInfo?.full_name || `Usuário ${userId}`,
                email: userInfo?.email || ''
            };
            
            // Atualiza o cache
            cache.set(userId, userData);
            return userData;
        } catch (error) {
            console.warn(`Erro ao buscar informações do usuário ${userId}:`, error);
            const fallbackData = { id: userId, nome: `Usuário ${userId}`, email: '' };
            cache.set(userId, fallbackData);
            return fallbackData;
        }
    }, []);

    // Função para processar dados dos activities com informações do usuário
    const processActivitiesData = useCallback(async (rawActivities) => {
        if (!Array.isArray(rawActivities)) return [];

        const processedActivities = await Promise.all(
            rawActivities.map(async (activity) => {
                // Busca informações do usuário
                const userInfo = await fetchUserInfo(activity.usuario_id);
                
                // Processa dados antigos e novos
                const parseJsonSafely = (jsonString) => {
                    if (typeof jsonString === 'object') return jsonString;
                    try {
                        return jsonString ? JSON.parse(jsonString) : null;
                    } catch (error) {
                        console.warn('Erro ao fazer parse do JSON:', error);
                        return jsonString; // Retorna o valor original se não conseguir fazer parse
                    }
                };

                return {
                    ...activity,
                    usuario: userInfo,
                    dados_antigos: parseJsonSafely(activity.dados_antigos),
                    dados_novos: parseJsonSafely(activity.dados_novos)
                };
            })
        );

        return processedActivities;
    }, [fetchUserInfo]);

    const fetchActivities = useCallback(async (limit = 50) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await api.recentActivity.get(limit);
            
            // Normaliza a resposta da API
            let rawActivities = [];
            if (response && Array.isArray(response)) {
                rawActivities = response;
            } else if (response?.data && Array.isArray(response.data)) {
                rawActivities = response.data;
            }

            // Processa os dados com informações dos usuários
            const processedActivities = await processActivitiesData(rawActivities);
            setActivities(processedActivities);
            
        } catch (error) {
            console.error('Erro ao carregar atividades recentes:', error);
            setError(error);
            setActivities([]);
        } finally {
            setIsLoading(false);
        }
    }, [processActivitiesData]);

    // Carregar dados iniciais
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    // Função para refresh manual
    const refreshActivities = useCallback((limit) => {
        return fetchActivities(limit);
    }, [fetchActivities]);

    // Memoiza o retorno para evitar re-renders desnecessários
    return useMemo(() => ({
        activities,
        isLoading,
        error,
        fetchActivities: refreshActivities
    }), [activities, isLoading, error, refreshActivities]);
};
