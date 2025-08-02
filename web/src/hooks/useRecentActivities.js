import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@web/api/api';

export const useRecentActivities = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);    const fetchActivities = useCallback(async (limit = 50) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.recentActivity.get(limit);
            
            // A API retorna os dados diretamente como array, não em response.data
            if (response && Array.isArray(response)) {
                setActivities(response);
            } else if (response?.data && Array.isArray(response.data)) {
                setActivities(response.data);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error('Erro ao carregar atividades recentes:', error);
            setError(error);
            setActivities([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carregar dados iniciais
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { activities, isLoading, error, fetchActivities };
};
