import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import PopUpComponent from "../components/PopUpComponent";

// Componentes modulares
import ReportHeader from "../components/reports/ReportHeader";
import StatsCards from "../components/reports/StatsCards";
import ChartsSection from "../components/reports/ChartsSection";
import PerformanceSection from "../components/reports/PerformanceSection";
import DetailedSummary from "../components/reports/DetailedSummary";


// Hooks customizados
import { useReportData } from "../hooks/useReportData";
import { useChartData } from "../hooks/useChartData";

// Estilos
import "../../styles/reportStyles.scss";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

function Reports({ pageFunctions }) {
  const popUpRef = useRef(null);
  const { reportData, isLoading, error, refetch } = useReportData();
  const chartData = useChartData(reportData);

  pageFunctions.set("Relatórios", true, true);

  // Função para exportar dados
  const handleExport = () => {
    const dataToExport = {
      geradoEm: new Date().toLocaleString('pt-BR'),
      estatisticas: reportData.stats || {},
      dadosGraficos: reportData.chartData || {}
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <main>
        <h1>Relatórios</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Relatórios</h1>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </main>
    );
  }

  return (
    <div className="container-fluid px-4 reports-main">
      <ReportHeader 
        isLoading={isLoading}
        onRefresh={() => window.location.reload()}
        onExport={handleExport}
      />
      
      <StatsCards reportData={reportData} />
      
      <ChartsSection chartData={chartData} />
      
      <PerformanceSection reportData={reportData} />
      
      <DetailedSummary reportData={reportData} />

      
      <PopUpComponent ref={popUpRef} />
    </div>
  );
}

export default Reports;