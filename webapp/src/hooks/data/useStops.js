import { useState, useEffect } from "react";
import api from '../../api/api';

export const useStops = () => { 
  const [stops, setStops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.stops.getAll();
      setStops(response.data || []);
    } catch (err) {
      setError('Erro ao buscar paradas');
      setStops([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  return {
    stops,
    isLoading,
    error,
    refetch: fetchStops
  };
};
