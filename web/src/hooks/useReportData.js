import { useState, useEffect } from 'react';
import api from '../api/api';

export const useReportData = () => {
  const [reportData, setReportData] = useState({
    passengers: [],
    buses: [],
    stops: [],
    routes: [],
    passengerCities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Usar os novos endpoints otimizados
      const [chartsRes, statsRes] = await Promise.all([
        api.reports.getCharts(),
        api.reports.getStats()
      ]);

      // Preparar dados dos gráficos
      const chartData = chartsRes?.data || {};
      const stats = statsRes?.data || {};

      setReportData({
        passengers: [], // Não precisamos mais dos dados completos
        buses: [],
        stops: chartData.stopsByCity || [],  // Carregar dados dos pontos do chartData
        routes: [],
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
        const [passengersRes, busesRes, stopsRes, routesRes] = await Promise.all([
          api.passengers.list(1, 1000),
          api.buses.list(1, 1000),
          api.stops.list(),
          api.routes.list(1, 1000),
        ]);

        setReportData({
          passengers: passengersRes?.data || [],
          buses: busesRes?.data || [],
          stops: stopsRes?.data || [],
          routes: routesRes?.data || [],
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
