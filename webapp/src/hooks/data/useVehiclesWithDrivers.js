import { useState, useEffect } from "react";
import api from '../../api/api';

/**
 * Hook para buscar veículos com motoristas associados a uma rota específica
 * @param {number} rotaId - ID da rota
 * @returns {Object} { vehiclesWithDrivers, isLoading, error, refetch }
 */
export const useVehiclesWithDrivers = (rotaId) => {
  const [vehiclesWithDrivers, setVehiclesWithDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehiclesWithDrivers = async () => {
    if (!rotaId) {
      setVehiclesWithDrivers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.vehicles.getByRoute(rotaId);
      setVehiclesWithDrivers(response.data || []);
    } catch (err) {
      setError('Erro ao buscar veículos com motoristas');
      setVehiclesWithDrivers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesWithDrivers();
  }, [rotaId]);

  return {
    vehiclesWithDrivers,
    isLoading,
    error,
    refetch: fetchVehiclesWithDrivers
  };
};
