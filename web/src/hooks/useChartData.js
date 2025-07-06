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
  // Dados para gráfico de passageiros por tipo
  const passengersByTypeData = {
    labels: reportData.chartData?.passengersByType?.map(item => item.label) || 
            reportData.passengerTypes.map(type => type.nome),
    datasets: [{
      label: 'Número de Passageiros',
      data: reportData.chartData?.passengersByType?.map(item => item.value) ||
            reportData.passengerTypes.map(type => 
              reportData.passengers.filter(p => p.tipo_passageiro_id === type.tipo_passageiro_id).length
            ),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  };

  // Dados para gráfico de status dos ônibus
  const busStatusData = {
    labels: reportData.chartData?.busesByStatus?.map(item => item.label) ||
            [...new Set(reportData.buses.map(bus => bus.status_nome || 'Não informado'))],
    datasets: [{
      label: 'Quantidade de Ônibus',
      data: reportData.chartData?.busesByStatus?.map(item => item.value) ||
            [...new Set(reportData.buses.map(bus => bus.status_nome || 'Não informado'))].map(status =>
              reportData.buses.filter(bus => (bus.status_nome || 'Não informado') === status).length
            ),
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1
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
      backgroundColor: 'rgba(153, 102, 255, 0.8)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
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
      backgroundColor: 'rgba(255, 159, 64, 0.8)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1
    }]
  };

  return {
    passengersByType: passengersByTypeData,
    busStatus: busStatusData,
    routeStatus: routeStatusData,
    stopsByCity: stopsByCityData
  };
};
