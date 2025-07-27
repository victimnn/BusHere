import { useState, useEffect } from 'react';
import api from '../api/api';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    passengers: 0,
    drivers: 0,
    buses: 0,
    routes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar estatísticas principais e contagem de motoristas em paralelo
      const [statsResponse, driversResponse] = await Promise.all([
        api.reports.getStats(),
        api.drivers.list(1, 1) // Apenas para obter o total
      ]);
      
      const statsData = statsResponse.data;
      
      setStats({
        passengers: statsData.passengers?.total || 0,
        drivers: driversResponse.total || 0,
        buses: statsData.buses?.total || 0,
        routes: statsData.routes?.total || 0
      });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do painel');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { stats, isLoading, error, refetch: fetchDashboardData };
}; 