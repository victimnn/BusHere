import React from 'react';

// Função para extrair cidade do endereço
const extractCity = (address) => {
  if (!address) return 'Não informado';
  
  // Tentar diferentes padrões de endereço
  const parts = address.split(',');
  
  if (parts.length >= 2) {
    // Pega a última parte (cidade) e remove espaços extras
    const city = parts[parts.length - 1].trim();
    if (city && city !== '') {
      return city;
    }
    
    // Se a última parte estiver vazia, tenta a penúltima
    const secondLast = parts[parts.length - 2].trim();
    if (secondLast && secondLast !== '') {
      return secondLast;
    }
  }
  
  // Se não conseguir extrair, retorna o endereço completo limitado
  return address.length > 20 ? address.substring(0, 20) + '...' : address;
};

export const useChartData = (reportData) => {
  // Dados para gráfico de passageiros por cidade
  const passengersByCityData = {
    labels: reportData.chartData?.passengersByCity?.map(item => item.label) || [],
    datasets: [{
      label: 'Número de Passageiros',
      data: reportData.chartData?.passengersByCity?.map(item => item.value) || [],
      backgroundColor: [
        'rgba(18, 190, 77, 0.8)',   // Primary green
        'rgba(18, 190, 160, 0.8)',  // Analogous 1
        'rgba(18, 190, 24, 0.8)',   // Analogous 2
        'rgba(30, 144, 255, 0.8)',  // Info blue
        'rgba(255, 107, 107, 0.8)', // Accent red
      ],
      borderColor: [
        'rgba(18, 190, 77, 1)',
        'rgba(18, 190, 160, 1)',
        'rgba(18, 190, 24, 1)',
        'rgba(30, 144, 255, 1)',
        'rgba(255, 107, 107, 1)',
      ],
      borderWidth: 2
    }]
  };

  // Dados para gráfico de status dos veículos
  const vehicleStatusData = {
    labels: reportData.chartData?.vehiclesByStatus?.map(item => item.label) ||
            [...new Set(reportData.vehicles.map(vehicle => vehicle.status_nome || 'Não informado'))],
    datasets: [{
      label: 'Quantidade de Veículos',
      data: reportData.chartData?.vehiclesByStatus?.map(item => item.value) ||
            [...new Set(reportData.vehicles.map(vehicle => vehicle.status_nome || 'Não informado'))].map(status =>
              reportData.vehicles.filter(vehicle => (vehicle.status_nome || 'Não informado') === status).length
            ),
      backgroundColor: [
        'rgba(18, 190, 77, 0.8)',   // Primary green
        'rgba(255, 107, 107, 0.8)', // Accent red  
        'rgba(255, 193, 7, 0.8)',   // Warning yellow
        'rgba(30, 144, 255, 0.8)',  // Info blue
      ],
      borderColor: [
        'rgba(18, 190, 77, 1)',
        'rgba(255, 107, 107, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(30, 144, 255, 1)',
      ],
      borderWidth: 2
    }]
  };

  // Dados para gráfico de rotas por status
  const routeStatusData = {
    labels: reportData.chartData?.routesByStatus?.map(item => item.label) ||
            [...new Set(reportData.routes.map(route => route.status_nome || 'Não informado'))],
    datasets: [{
      label: 'Número de Rotas',
      data: reportData.chartData?.routesByStatus?.map(item => item.value) ||
            [...new Set(reportData.routes.map(route => route.status_nome || 'Não informado'))].map(status =>
              reportData.routes.filter(route => (route.status_nome || 'Não informado') === status).length
            ),
      backgroundColor: 'rgba(255, 107, 107, 0.8)', // Accent red
      borderColor: 'rgba(255, 107, 107, 1)',
      borderWidth: 2
    }]
  };

  // Dados para gráfico de pontos por cidade
  const stopsByCityData = {
    labels: reportData.chartData?.stopsByCity?.map(item => item.label) ||
            reportData.stats?.stops?.byCity?.map(item => item.cidade || item.label) ||
            [...new Set(reportData.stops.map(stop => extractCity(stop.endereco || stop.address || '')))]
              .filter(city => city && city !== 'Não informado'),
    datasets: [{
      label: 'Número de Pontos',
      data: reportData.chartData?.stopsByCity?.map(item => item.value) ||
            reportData.stats?.stops?.byCity?.map(item => item.total_pontos || item.value) ||
            [...new Set(reportData.stops.map(stop => extractCity(stop.endereco || stop.address || '')))]
              .filter(city => city && city !== 'Não informado')
              .map(city =>
                reportData.stops.filter(stop => extractCity(stop.endereco || stop.address || '') === city).length
              ),
      backgroundColor: 'rgba(30, 144, 255, 0.8)', // Info blue
      borderColor: 'rgba(30, 144, 255, 1)',
      borderWidth: 2
    }]
  };

  // Dados para gráfico de status dos motoristas
  const driversStatusData = {
    labels: reportData.chartData?.driversByStatus?.map(item => item.label) ||
            reportData.stats?.drivers?.byStatus?.map(item => item.status_nome || item.label) ||
            [...new Set(reportData.drivers?.map(driver => driver.status_nome || 'Não informado') || [])]
              .filter(status => status && status !== 'Não informado'),
    datasets: [{
      label: 'Quantidade de Motoristas',
      data: reportData.chartData?.driversByStatus?.map(item => item.value) ||
            reportData.stats?.drivers?.byStatus?.map(item => item.total_motoristas || item.value) ||
            [...new Set(reportData.drivers?.map(driver => driver.status_nome || 'Não informado') || [])]
              .filter(status => status && status !== 'Não informado')
              .map(status =>
                reportData.drivers?.filter(driver => (driver.status_nome || 'Não informado') === status).length || 0
              ),
      backgroundColor: [
        'rgba(231, 76, 60, 0.8)',   // Red (Ativo)
        'rgba(52, 152, 219, 0.8)',  // Blue (Férias)
        'rgba(155, 89, 182, 0.8)',  // Purple (Afastado)
        'rgba(149, 165, 166, 0.8)', // Gray (Inativo)
        'rgba(46, 204, 113, 0.8)',  // Green (Disponível)
      ],
      borderColor: [
        'rgba(231, 76, 60, 1)',
        'rgba(52, 152, 219, 1)',
        'rgba(155, 89, 182, 1)',
        'rgba(149, 165, 166, 1)',
        'rgba(46, 204, 113, 1)',
      ],
      borderWidth: 2
    }]
  };

  // Dados para gráfico de tipos de veículos
  const vehicleTypesData = {
    labels: reportData.chartData?.vehiclesByType?.map(item => item.label) || [],
    datasets: [{
      label: 'Quantidade de Veículos',
      data: reportData.chartData?.vehiclesByType?.map(item => item.value) || [],
      backgroundColor: [
        'rgba(18, 190, 77, 0.8)',   // Primary green
        'rgba(255, 107, 107, 0.8)', // Accent red  
        'rgba(255, 193, 7, 0.8)',   // Warning yellow
        'rgba(30, 144, 255, 0.8)',  // Info blue
        'rgba(155, 89, 182, 0.8)',  // Purple
      ],
      borderColor: [
        'rgba(18, 190, 77, 1)',
        'rgba(255, 107, 107, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(30, 144, 255, 1)',
        'rgba(155, 89, 182, 1)',
      ],
      borderWidth: 2
    }]
  };

  return {
    passengersByCity: passengersByCityData,
    vehicleStatus: vehicleStatusData,
    vehicleTypes: vehicleTypesData,
    routeStatus: routeStatusData,
    stopsByCity: stopsByCityData,
    driversStatus: driversStatusData
  };
};
