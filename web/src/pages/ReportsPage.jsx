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
import { generateReportPDF } from "@web/utils/pdfReport";

// Componentes
import PopUpComponent from "@web/components/ui/PopUpComponent";

// Componentes modulares
import ReportHeader from "@web/components/pageComponents/reports/ReportHeader";
import StatsCards from "@web/components/pageComponents/reports/StatsCards";
import ChartsSection from "@web/components/pageComponents/reports/ChartsSection";
import PerformanceSection from "@web/components/pageComponents/reports/PerformanceSection";
import DetailedSummary from "@web/components/pageComponents/reports/DetailedSummary";


// Hooks customizados
import { useReportData, useChartData } from "@web/hooks";

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
      <div className= "reports-main py-2">
        <h1>Relatórios</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className= "reports-main py-2">
        <h1>Relatórios</h1>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className= "reports-main py-2">
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
    </div>
  );
}

export default Reports;