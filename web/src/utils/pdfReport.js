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

  // Linha decorativa
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
  const statLines = [
    ['Total de Passageiros', stats.passengers?.total || 0],
    ['Ônibus Ativos', stats.buses?.ativos || 0],
    ['Total de Pontos de Parada', stats.stops?.total_pontos || 0],
    ['Rotas em Operação', stats.routes?.ativas || 0],
    ['Capacidade Total da Frota', stats.buses?.totalCapacity || 0],
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

  const perf = [
    ['Taxa de Utilização da Frota', `${((stats.passengers?.total || 0) / (stats.buses?.totalCapacity || 1) * 100).toFixed(1)}%`],
    ['Pontos Ativos', stats.stops?.pontos_ativos ? `${stats.stops.pontos_ativos} de ${stats.stops.total_pontos}` : 'N/A'],
    ['Eficiência de Rotas (Ativas/Total)', stats.routes?.total && stats.routes?.ativas ? `${((stats.routes.ativas / stats.routes.total) * 100).toFixed(1)}%` : 'N/A'],
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

// Adiciona os gráficos ao PDF, corrigindo a distorção e otimizando o espaço.
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

  // Define a área máxima para cada gráfico, permitindo 2 por página.
  const availablePageHeight = pageHeight - y - footerHeight;
  const maxChartHeight = (availablePageHeight / 2) - 20; // Altura máxima para cada gráfico, com margem
  const maxChartWidth = pageWidth - (margin * 2);
  const spaceBetweenCharts = 40;

  chartIds.forEach((chartId, i) => {
    const chartCanvas = document.getElementById(chartId);
    if (chartCanvas) {
      // --- Lógica de Redimensionamento para Manter a Proporção ---
      const canvasWidth = chartCanvas.width;
      const canvasHeight = chartCanvas.height;
      const widthRatio = maxChartWidth / canvasWidth;
      const heightRatio = maxChartHeight / canvasHeight;
      const scale = Math.min(widthRatio, heightRatio); // Usa a menor proporção para garantir que caiba

      const finalWidth = canvasWidth * scale;
      const finalHeight = canvasHeight * scale;
      // --- Fim da Lógica de Redimensionamento ---

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

  // 3. Gráficos
  const chartIds = [
    'chart-passengersByCity', 'chart-busStatus',
    'chart-stopsByCity', 'chart-routeStatus',
  ];
  const chartTitles = [
    'Passageiros por Cidade', 'Status da Frota de Ônibus',
    'Pontos de Parada por Cidade', 'Status das Rotas',
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