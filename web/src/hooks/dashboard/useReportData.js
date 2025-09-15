import { useState, useEffect } from 'react';
import api from '@web/api/api';

export const useReportData = () => {
  const [reportData, setReportData] = useState({
    passengers: [],
    vehicles: [],
    stops: [],
    routes: [],
    drivers: [],
    passengerCities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Usar os novos endpoints otimizados
      const [chartsRes, statsRes, driversRes, routesRes] = await Promise.all([
        api.reports.getCharts(),
        api.reports.getStats(),
        api.drivers.list(1, 1000), // Buscar dados de motoristas
        api.routes.list(1, 1000) // Buscar dados de rotas
      ]);

      // Preparar dados dos gráficos
      const chartData = chartsRes?.data || {};
      const stats = statsRes?.data || {};
      const drivers = driversRes?.data || [];
      const routes = routesRes?.data || [];

      setReportData({
        passengers: [], // Não precisamos mais dos dados completos
        vehicles: [],
        stops: chartData.stopsByCity || [],  // Carregar dados dos pontos do chartData
        routes: routes, // Adicionar dados de rotas
        drivers: drivers, // Adicionar dados de motoristas
        passengerCities: chartData.passengersByCity || [],
        chartData,
        stats
      });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados dos relatórios:', err);
      setError('Erro ao carregar dados dos relatórios');
      
      // Fallback para a API antiga se a nova falhar
      try {
        const [passengersRes, vehiclesRes, stopsRes, routesRes, driversRes] = await Promise.all([
          api.passengers.list(1, 1000),
          api.vehicles.list(1, 1000),
          api.stops.list(),
          api.routes.list(1, 1000),
          api.drivers.list(1, 1000), // Adicionar motoristas no fallback
        ]);

        setReportData({
          passengers: passengersRes?.data || [],
          vehicles: vehiclesRes?.data || [],
          stops: stopsRes?.data || [],
          routes: routesRes?.data || [],
          drivers: driversRes?.data || [], // Adicionar dados de motoristas
          passengerCities: []
        });
        
        setError(null);
      } catch (fallbackErr) {
        console.error('Erro no fallback:', fallbackErr);
        setError('Erro ao carregar dados dos relatórios');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return { reportData, isLoading, error, refetch: fetchReportData };
};
