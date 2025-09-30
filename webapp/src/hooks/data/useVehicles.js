import { useState, useEffect } from "react";
import api from '../../api/api';

export const useVehicles = (page = 1, limit = 10, search = '') => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.vehicles.list(page, limit, search);
      setVehicles(response.data || []);
    } catch (err) {
      setError('Erro ao buscar veículos');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, limit, search]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles
  };
};
