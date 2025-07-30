import { useState, useEffect, useCallback } from 'react';

/**
 * Hook reutilizável para páginas de detalhes
 * Gerencia estado de loading, dados e erros de forma consistente
 */
export const useDetailPage = (fetchFunction, id, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id || !fetchFunction) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(id);
      
      if (result?.success) {
        setData(result.data);
      } else if (result?.error) {
        setError(result.error);
      } else {
        // Para APIs que retornam dados diretamente
        setData(result);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, id, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData // Para atualizações manuais após edições
  };
};
