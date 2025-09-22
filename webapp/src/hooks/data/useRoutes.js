import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';


export const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.routes.get();
      setRoutes(response.data || []);
    } catch (err) {
      setError('Erro ao buscar rotas');
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return {
    routes,
    isLoading,
    error,
    refetch: fetchRoutes
  };
};
