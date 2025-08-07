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

// Utils
import { generateReportPDF } from "../utils/pdfReport";

// Componentes
import PopUpComponent from "../components/ui/PopUpComponent";

// Componentes modulares
import ReportHeader from "../components/pageComponents/reports/ReportHeader";
import StatsCards from "../components/pageComponents/reports/StatsCards";
import ChartsSection from "../components/pageComponents/reports/ChartsSection";
import PerformanceSection from "../components/pageComponents/reports/PerformanceSection";
import DetailedSummary from "../components/pageComponents/reports/DetailedSummary";


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

  useEffect(() => {
    pageFunctions.set("Relatórios", true, true);
  }, [pageFunctions]);

  // Função para exportar dados
  const handleExport = () => {
    generateReportPDF(reportData);
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
    <main className="reports-main py-2">
      <div className="container-fluid px-4" id="relatorio-pdf">
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
    </main>
  );
}

export default Reports;