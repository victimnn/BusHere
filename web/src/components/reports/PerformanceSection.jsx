import React from 'react';
import { isRouteActive, getActiveCountFromStats, getActiveRoutes, getActiveStops } from '../../utils/reportFilters';

const PerformanceIndicator = ({ title, percentage, gradient, description }) => {
  return (
    <div className="col-lg-4">
      <div className="text-center p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="text-muted mb-0 fw-semibold">{title}</h6>
          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
            {percentage}%
          </span>
        </div>
        <div className="progress mb-3" style={{height: '12px', borderRadius: '10px'}}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{
              width: `${Math.min(100, percentage)}%`,
              background: gradient,
              borderRadius: '10px'
            }}
          ></div>
        </div>
        <small className="text-muted">{description}</small>
      </div>
    </div>
  );
};

const PerformanceSection = ({ reportData }) => {
  const indicators = [
    {
      title: "Taxa de Utilização da Frota",
      percentage: (() => {
        const totalPassageiros = reportData.stats?.passengers?.total || reportData.passengers.length;
        const capacidadeTotal = reportData.stats?.buses?.totalCapacity || 
                               reportData.buses.reduce((total, bus) => total + (parseInt(bus.capacidade) || 0), 0);
        
        if (capacidadeTotal === 0) return 0;
        return ((totalPassageiros / capacidadeTotal) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #12BE4D 0%, #5CE98B 100%)", // Primary gradient
      description: "Passageiros vs Capacidade Total"
    },
    {
      title: "Pontos Ativos",
      percentage: (() => {
        const totalPontos = reportData.stats?.stops?.total_pontos || reportData.stops?.length || 0;
        const pontosAtivos = reportData.stats?.stops?.pontos_ativos || 
                            getActiveStops(reportData.stops || []).length;
        
        if (totalPontos === 0) return 0;
        return ((pontosAtivos / totalPontos) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #1E90FF 0%, #12BEA0 100%)", // Info to analogous
      description: (() => {
        const totalPontos = reportData.stats?.stops?.total_pontos || reportData.stops?.length || 0;
        const pontosAtivos = reportData.stats?.stops?.pontos_ativos || 
                            getActiveStops(reportData.stops || []).length;
        return `${pontosAtivos} de ${totalPontos} pontos`;
      })()
    },
    {
      title: "Eficiência de Rotas",
      percentage: (() => {
        const rotasAtivas = getActiveCountFromStats(reportData.stats?.routes?.byStatus, isRouteActive) || 
                           getActiveRoutes(reportData.routes || []).length;
        const totalRotas = reportData.stats?.routes?.total || reportData.routes?.length || 0;
        
        if (totalRotas === 0) return 0;
        return ((rotasAtivas / totalRotas) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #FF6B6B 0%, #FFC107 100%)", // Accent to warning
      description: "Rotas Ativas vs Total"
    }
  ];

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card border-0 shadow-sm performance-card">
          <div className="card-header bg-transparent border-0 p-4">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-tachometer-alt text-success"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-primary">Indicadores de Performance</h5>
                <small className="text-muted">Métricas de eficiência operacional</small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-4">
              {indicators.map((indicator, index) => (
                <PerformanceIndicator
                  key={index}
                  title={indicator.title}
                  percentage={indicator.percentage}
                  gradient={indicator.gradient}
                  description={indicator.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
