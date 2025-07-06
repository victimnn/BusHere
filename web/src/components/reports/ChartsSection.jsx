import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const ChartCard = ({ title, subtitle, iconClass, iconBg, children }) => {
  return (
    <div className="col-xl-6 col-lg-12">
      <div className="card border-0 shadow-sm h-100 chart-card card-hover">
        <div className="card-header bg-transparent border-0 p-3">
          <div className="d-flex align-items-center">
            <div className={`${iconBg} bg-opacity-10 rounded-circle p-2 me-2`}>
              <i className={`${iconClass} ${iconBg.replace('bg-', 'text-')}`}></i>
            </div>
            <div>
              <h6 className="mb-0 fw-bold text-primary">{title}</h6>
              <small className="text-muted">{subtitle}</small>
            </div>
          </div>
        </div>
        <div className="card-body p-3 chart-container">
          {children}
        </div>
      </div>
    </div>
  );
};

const ChartsSection = ({ chartData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="row g-3 mb-4">
      <ChartCard
        title="Passageiros por Cidade"
        subtitle="Distribuição de categorias"
        iconClass="fas fa-chart-pie"
        iconBg="bg-primary"
      >
        <Pie data={chartData.passengersByCity} options={pieOptions} />
      </ChartCard>

      <ChartCard
        title="Status dos Ônibus"
        subtitle="Estado operacional da frota"
        iconClass="fas fa-chart-bar"
        iconBg="bg-success"
      >
        <Bar data={chartData.busStatus} options={chartOptions} />
      </ChartCard>

      <ChartCard
        title="Pontos por Cidade"
        subtitle="Distribuição geográfica"
        iconClass="fas fa-map"
        iconBg="bg-info"
      >
        <Bar data={chartData.stopsByCity} options={chartOptions} />
      </ChartCard>

      <ChartCard
        title="Rotas por Status"
        subtitle="Estado das rotas cadastradas"
        iconClass="fas fa-route"
        iconBg="bg-warning"
      >
        <Bar data={chartData.routeStatus} options={chartOptions} />
      </ChartCard>
    </div>
  );
};

export default ChartsSection;
