import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Funções Auxiliares ---

// Carrega uma imagem e a converte para Base64
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

// Adiciona o cabeçalho em cada página
const addHeader = (doc, logoBase64) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Adiciona a logo
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 40, 25, 50, 50);
  }

  // Adiciona o título do sistema
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor('#2c3e50'); // Cor escura
  doc.text("BusHere!", 100, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#34495e'); // Cor um pouco mais clara
  doc.text("Relatório de Desempenho", 100, 60);

  // Linha decorativa
  doc.setDrawColor('#1abc9c'); // Verde água
  doc.setLineWidth(1.5);
  doc.line(40, 80, pageWidth - 40, 80);
};

// Adiciona o rodapé em cada página
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(8);
  doc.setTextColor('#7f8c8d'); // Cinza
  
  // Linha decorativa
  doc.setDrawColor('#1abc9c');
  doc.setLineWidth(0.5);
  doc.line(40, pageHeight - 35, pageWidth - 40, pageHeight - 35);

  // Informações do rodapé
  const reportDate = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${reportDate}`, 40, pageHeight - 20);
  doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text("Relatório Confidencial", pageWidth - 40, pageHeight - 20, { align: 'right' });
};

// --- Funções de Geração de Conteúdo ---

// Cria a página de rosto
const createTitlePage = (doc, reportData, logoBase64) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background sutil
  doc.setFillColor('#f5f5f5');
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Logo Central
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 50, pageHeight * 0.2, 100, 100);
  }

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor('#2c3e50');
  doc.text("Relatório de Desempenho", pageWidth / 2, pageHeight * 0.45, { align: 'center' });

  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor('#34495e');
  doc.text("Análise Operacional Completa", pageWidth / 2, pageHeight * 0.52, { align: 'center' });

  // Linha 
  doc.setDrawColor('#1abc9c');
  doc.setLineWidth(1);
  doc.line(pageWidth * 0.3, pageHeight * 0.56, pageWidth * 0.7, pageHeight * 0.56);

  // Informações do Relatório
  const reportDate = new Date();
  const infoY = pageHeight * 0.7;
  autoTable(doc, {
    startY: infoY,
    body: [
      ['Data de Geração:', `${reportDate.toLocaleDateString('pt-BR')} às ${reportDate.toLocaleTimeString('pt-BR')}`],
      ['Período Analisado:', `${reportData.period || reportDate.getFullYear()}`],
      ['ID do Relatório:', `REP-${Date.now().toString().slice(-6)}`],
    ],
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 12,
      cellPadding: 8,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: '#2c3e50' },
    },
    margin: { left: pageWidth * 0.25 },
    tableWidth: pageWidth * 0.5,
  });
};

// Cria a seção de resumo e estatísticas
const createSummarySection = (doc, reportData) => {
  doc.addPage();
  let y = 100; // Posição inicial após o cabeçalho

  // Título da Seção
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#16a085'); // Verde mais escuro
  doc.text("Resumo Geral", 40, y);
  y += 20;

  const stats = reportData.stats || {};
  
  // Função para obter dados corretos com fallbacks
  const getVehicleData = () => {
    if (stats.vehicles?.total) return stats.vehicles.total;
    if (stats.vehicles?.byStatus && Array.isArray(stats.vehicles.byStatus)) {
      return stats.vehicles.byStatus.reduce((total, status) => total + (status.total_veiculos || 0), 0);
    }
    if (reportData.vehicles && Array.isArray(reportData.vehicles)) {
      return reportData.vehicles.length;
    }
    return 0;
  };

  const getActiveVehicleData = () => {
    if (stats.vehicles?.ativos) return stats.vehicles.ativos;
    if (stats.vehicles?.byStatus && Array.isArray(stats.vehicles.byStatus)) {
      const activeStatuses = ['Ativo', 'Em Operação', 'Disponível'];
      return stats.vehicles.byStatus
        .filter(status => activeStatuses.includes(status.status_nome))
        .reduce((total, status) => total + (status.total_veiculos || 0), 0);
    }
    if (reportData.vehicles && Array.isArray(reportData.vehicles)) {
      return reportData.vehicles.filter(vehicle => vehicle.ativo === true || vehicle.ativo === 1).length;
    }
    return 0;
  };

  const getRouteData = () => {
    if (stats.routes?.total) return stats.routes.total;
    if (stats.routes?.byStatus && Array.isArray(stats.routes.byStatus)) {
      return stats.routes.byStatus.reduce((total, status) => total + (status.total_rotas || 0), 0);
    }
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.length;
    }
    return 0;
  };

  const getActiveRouteData = () => {
    if (stats.routes?.ativas) return stats.routes.ativas;
    if (stats.routes?.byStatus && Array.isArray(stats.routes.byStatus)) {
      const activeStatuses = ['Ativa', 'Em Operação', 'Disponível'];
      return stats.routes.byStatus
        .filter(status => activeStatuses.includes(status.status_nome))
        .reduce((total, status) => total + (status.total_rotas || 0), 0);
    }
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.filter(route => route.ativo === true || route.ativo === 1).length;
    }
    return 0;
  };

  const getDriverData = () => {
    if (stats.drivers?.total) return stats.drivers.total;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.length;
    }
    return 0;
  };

  const getActiveDriverData = () => {
    if (stats.drivers?.ativos) return stats.drivers.ativos;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.filter(driver => 
        (driver.ativo === true || driver.ativo === 1) && 
        (driver.status_nome === 'Ativo' || driver.status_motorista_id === 1)
      ).length;
    }
    return 0;
  };

  const statLines = [
    ['Total de Passageiros', stats.passengers?.total || reportData.passengers?.length || 0],
    ['Total de Veículos', getVehicleData()],
    ['Veículos Ativos', getActiveVehicleData()],
    ['Total de Pontos de Parada', stats.stops?.total_pontos || reportData.stops?.length || 0],
    ['Total de Rotas', getRouteData()],
    ['Rotas em Operação', getActiveRouteData()],
    ['Total de Motoristas', getDriverData()],
    ['Motoristas Ativos', getActiveDriverData()],
    ['Capacidade Total da Frota', stats.vehicles?.totalCapacity || 0],
    ['Distância Total das Rotas (km)', stats.routes?.totalDistance?.toFixed(2) || 0],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Indicador Chave', 'Valor']],
    body: statLines,
    theme: 'grid',
    headStyles: { fillColor: '#1abc9c', textColor: '#ffffff', fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 6, halign: 'left' },
    alternateRowStyles: { fillColor: '#f0f9f7' }, // Verde bem claro
    margin: { left: 40, right: 40 },
  });
  
  y = doc.lastAutoTable.finalY + 30;

  // Indicadores de Performance
  doc.setFontSize(18);
  doc.setTextColor('#2980b9'); // Azul
  doc.text("Indicadores de Performance (KPIs)", 40, y);
  y += 20;

  const totalPassengers = stats.passengers?.total || reportData.passengers?.length || 0;
  const totalCapacity = stats.buses?.totalCapacity || 0;
  const totalStops = stats.stops?.total_pontos || reportData.stops?.length || 0;
  const activeStops = stats.stops?.pontos_ativos || 0;
  const totalRoutes = getRouteData();
  const activeRoutes = getActiveRouteData();
  const totalDrivers = getDriverData();
  const activeDrivers = getActiveDriverData();

  const perf = [
    ['Taxa de Utilização da Frota', totalCapacity > 0 ? `${((totalPassengers / totalCapacity) * 100).toFixed(1)}%` : 'N/A'],
    ['Pontos Ativos', totalStops > 0 ? `${activeStops} de ${totalStops} (${((activeStops / totalStops) * 100).toFixed(1)}%)` : 'N/A'],
    ['Eficiência de Rotas', totalRoutes > 0 ? `${activeRoutes} de ${totalRoutes} (${((activeRoutes / totalRoutes) * 100).toFixed(1)}%)` : 'N/A'],
    ['Eficiência de Motoristas', totalDrivers > 0 ? `${activeDrivers} de ${totalDrivers} (${((activeDrivers / totalDrivers) * 100).toFixed(1)}%)` : 'N/A'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Indicador de Performance', 'Valor']],
    body: perf,
    theme: 'grid',
    headStyles: { fillColor: '#3498db', textColor: '#ffffff', fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 6 },
    alternateRowStyles: { fillColor: '#eaf4fb' }, // Azul bem claro
    margin: { left: 40, right: 40 },
  });
};

// Cria a seção de estatísticas detalhadas de motoristas
const createDriversSection = (doc, reportData) => {
  doc.addPage();
  let y = 100; // Posição inicial após o cabeçalho

  // Título da Seção
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#e74c3c'); // Vermelho para motoristas
  doc.text("Estatísticas de Motoristas", 40, y);
  y += 20;

  const stats = reportData.stats || {};
  
  // Função para obter dados de motoristas com fallbacks
  const getDriverData = () => {
    if (stats.drivers?.total) return stats.drivers.total;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.length;
    }
    return 0;
  };

  const getActiveDriverData = () => {
    if (stats.drivers?.ativos) return stats.drivers.ativos;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.filter(driver => 
        (driver.ativo === true || driver.ativo === 1) && 
        (driver.status_nome === 'Ativo' || driver.status_motorista_id === 1)
      ).length;
    }
    return 0;
  };

  const getDriversByStatus = () => {
    if (stats.drivers?.byStatus && Array.isArray(stats.drivers.byStatus)) {
      return stats.drivers.byStatus;
    }
    
    // Fallback: calcular a partir dos dados brutos
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      const statusCount = {};
      reportData.drivers.forEach(driver => {
        const status = driver.status_nome || 'Desconhecido';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      
      return Object.entries(statusCount).map(([status, count]) => ({
        status_nome: status,
        total_motoristas: count
      }));
    }
    
    return [];
  };

  const totalDrivers = getDriverData();
  const activeDrivers = getActiveDriverData();
  const driversByStatus = getDriversByStatus();

  // Estatísticas principais de motoristas
  const driverStats = [
    ['Total de Motoristas', totalDrivers],
    ['Motoristas Ativos', activeDrivers],
    ['Motoristas Inativos', totalDrivers - activeDrivers],
    ['Taxa de Atividade', totalDrivers > 0 ? `${((activeDrivers / totalDrivers) * 100).toFixed(1)}%` : 'N/A'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Indicador', 'Valor']],
    body: driverStats,
    theme: 'grid',
    headStyles: { fillColor: '#e74c3c', textColor: '#ffffff', fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 6, halign: 'left' },
    alternateRowStyles: { fillColor: '#fdf2f2' }, // Vermelho bem claro
    margin: { left: 40, right: 40 },
  });
  
  y = doc.lastAutoTable.finalY + 30;

  // Distribuição por status (se houver dados)
  if (driversByStatus.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor('#c0392b'); // Vermelho mais escuro
    doc.text("Distribuição por Status", 40, y);
    y += 20;

    const statusData = driversByStatus.map(status => [
      status.status_nome,
      status.total_motoristas || status.total || 0
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Status', 'Quantidade']],
      body: statusData,
      theme: 'grid',
      headStyles: { fillColor: '#c0392b', textColor: '#ffffff', fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 6, halign: 'left' },
      alternateRowStyles: { fillColor: '#fdf2f2' },
      margin: { left: 40, right: 40 },
    });
    
    y = doc.lastAutoTable.finalY + 30;
  }

  // Análise de eficiência
  doc.setFontSize(16);
  doc.setTextColor('#c0392b');
  doc.text("Análise de Eficiência", 40, y);
  y += 20;

  const efficiencyData = [
    ['Motoristas Disponíveis', activeDrivers],
    ['Taxa de Disponibilidade', totalDrivers > 0 ? `${((activeDrivers / totalDrivers) * 100).toFixed(1)}%` : 'N/A'],
    ['Motoristas por Rota Ativa', (() => {
      const activeRoutes = reportData.stats?.routes?.ativas || 
                          (reportData.routes && Array.isArray(reportData.routes) ? 
                           reportData.routes.filter(route => route.ativo === true || route.ativo === 1).length : 0);
      return activeRoutes > 0 ? (activeDrivers / activeRoutes).toFixed(1) : 'N/A';
    })()],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Métrica', 'Valor']],
    body: efficiencyData,
    theme: 'grid',
    headStyles: { fillColor: '#c0392b', textColor: '#ffffff', fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 6, halign: 'left' },
    alternateRowStyles: { fillColor: '#fdf2f2' },
    margin: { left: 40, right: 40 },
  });
};

// Adiciona os gráficos ao PDF com um gráfico por linha seguindo a ordem
const addCharts = (doc, chartIds, chartTitles) => {
  doc.addPage();
  let y = 100; // Posição Y inicial, após o cabeçalho
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerHeight = 50; // Espaço reservado para o rodapé

  // Título da Seção de Gráficos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#16a085');
  doc.text("Análise Gráfica", margin, y);
  y += 30;

  // Define a área máxima para cada gráfico (1 por página)
  const availablePageHeight = pageHeight - y - footerHeight;
  const maxChartHeight = availablePageHeight - 40; // Altura máxima para cada gráfico
  const maxChartWidth = pageWidth - (margin * 2);
  const spaceBetweenCharts = 40;

  chartIds.forEach((chartId, i) => {
    const chartCanvas = document.getElementById(chartId);
    if (chartCanvas) {
      // Lógica de Redimensionamento para Manter a Proporção
      const canvasWidth = chartCanvas.width;
      const canvasHeight = chartCanvas.height;
      const widthRatio = maxChartWidth / canvasWidth;
      const heightRatio = maxChartHeight / canvasHeight;
      const scale = Math.min(widthRatio, heightRatio);

      const finalWidth = canvasWidth * scale;
      const finalHeight = canvasHeight * scale;

      // Verifica se há espaço para o próximo gráfico na página atual
      if (y + finalHeight + spaceBetweenCharts > pageHeight - footerHeight) {
        doc.addPage();
        y = 100; // Reinicia o Y na nova página
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor('#16a085');
        doc.text("Análise Gráfica (Continuação)", margin, y);
        y += 30;
      }

      // Título do Gráfico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor('#2c3e50');
      doc.text(chartTitles[i] || `Gráfico ${i + 1}`, margin, y);
      y += 20;

      const imgData = chartCanvas.toDataURL('image/png', 1.0);
      
      // Centraliza o gráfico horizontalmente
      const xPos = (pageWidth - finalWidth) / 2;

      doc.addImage(imgData, 'PNG', xPos, y, finalWidth, finalHeight);
      y += finalHeight + spaceBetweenCharts; // Atualiza a posição Y
    }
  });
};

// Cria a seção de tipos de veículos
const createVehicleTypesSection = (doc, reportData) => {
  doc.addPage();
  let y = 100; // Posição inicial após o cabeçalho

  // Título da Seção
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#16a085'); // Verde mais escuro
  doc.text("Tipos de Veículos", 40, y);
  y += 20;

  const stats = reportData.stats || {};
  const chartData = reportData.chartData || {};

  // Função para obter dados de tipos de veículos
  const getVehicleTypesData = () => {
    if (stats.vehicles?.byType && Array.isArray(stats.vehicles.byType)) {
      return stats.vehicles.byType;
    }
    if (chartData.vehiclesByType && Array.isArray(chartData.vehiclesByType)) {
      return chartData.vehiclesByType.map(item => ({
        tipo_nome: item.label,
        total_veiculos: item.value,
        capacidade_total: 0 // Não disponível nos dados do gráfico
      }));
    }
    return [];
  };

  const vehicleTypesData = getVehicleTypesData();

  if (vehicleTypesData.length > 0) {
    // Cabeçalho da tabela
    const tableHeaders = ['Tipo de Veículo', 'Quantidade', 'Capacidade Total'];
    const tableBody = vehicleTypesData.map(type => [
      type.tipo_nome || 'Não informado',
      type.total_veiculos || 0,
      type.capacidade_total ? `${type.capacidade_total} passageiros` : 'N/A'
    ]);

    autoTable(doc, {
      startY: y,
      head: [tableHeaders],
      body: tableBody,
      styles: {
        fontSize: 10,
        cellPadding: 8,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fillColor: '#16a085',
        textColor: '#ffffff',
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: '#f8f9fa'
      },
      margin: { left: 40, right: 40 },
      tableWidth: 'auto',
    });
  } else {
    // Mensagem quando não há dados
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#7f8c8d');
    doc.text("Nenhum dado de tipos de veículos disponível.", 40, y);
  }
};

// --- Função Principal de Geração ---

export async function generateReportPDF(reportData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  let logoBase64 = null;

  try {
    logoBase64 = await loadImageAsBase64('/logo.png');
  } catch (error) {
    console.warn('Não foi possível carregar a logo:', error);
  }

  // 1. Página de Rosto
  createTitlePage(doc, reportData, logoBase64);

  // 2. Resumo e Estatísticas
  createSummarySection(doc, reportData);

  // 3. Estatísticas de Motoristas (Análise de Eficiência)
  createDriversSection(doc, reportData);

  // 4. Estatísticas de Tipos de Veículos (após análise de eficiência)
  createVehicleTypesSection(doc, reportData);

  // 5. Gráficos
  const chartIds = [
    'chart-passengersByCity', 'chart-driversStatus',
    'chart-vehicleStatus', 'chart-vehicleTypes',
    'chart-stopsByCity', 'chart-routeStatus',
  ];
  const chartTitles = [
    'Passageiros por Cidade', 'Status dos Motoristas',
    'Status dos Veículos', 'Tipos de Veículos',
    'Pontos por Cidade', 'Rotas por Status',
  ];
  addCharts(doc, chartIds, chartTitles);

  // Adiciona cabeçalho e rodapé em todas as páginas
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Não adiciona cabeçalho e rodapé na página de rosto
    if (i > 1) {
      addHeader(doc, logoBase64);
    }
    addFooter(doc);
  }

  // Salva o PDF
  doc.save(`relatorio-desempenho-${new Date().toISOString().split('T')[0]}.pdf`);
}