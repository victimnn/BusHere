import React from 'react';

const DetailedSummary = ({ reportData }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{borderRadius: '20px'}}>
          <div className="card-header bg-transparent border-0 p-4">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-table text-primary"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Resumo Detalhado</h5>
                <small className="text-muted">Análise completa dos dados do sistema</small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="bg-light bg-opacity-50 rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-primary">
                    <i className="fas fa-users me-2"></i>
                    Estatísticas de Passageiros
                  </h6>
                  <div className="list-group list-group-flush bg-transparent">
                    {reportData.chartData?.passengersByCity?.map((item, index) => (
                      <div key={index} className="list-group-item bg-transparent border-0 px-0 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-user text-primary" style={{fontSize: '12px'}}></i>
                          </div>
                          <span className="fw-medium">{item.label}</span>
                        </div>
                        <span className="badge bg-primary rounded-pill px-3 py-2">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="bg-light bg-opacity-50 rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-success">
                    <i className="fas fa-chart-bar me-2"></i>
                    Métricas Operacionais
                  </h6>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Capacidade Total da Frota</span>
                      <i className="fas fa-bus text-success"></i>
                    </div>
                    <h4 className="text-success fw-bold mb-0">
                      {(reportData.stats?.buses?.totalCapacity || 
                       reportData.buses.reduce((total, bus) => total + (parseInt(bus.capacidade) || 0), 0)).toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> passageiros</small>
                    </h4>
                  </div>
                  
                  <div className="border-top pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Total de Pontos</span>
                      <i className="fas fa-map-marker-alt text-warning"></i>
                    </div>
                    <h4 className="text-warning fw-bold mb-0">
                      {(reportData.stats?.stops?.total_pontos || 
                        reportData.stops?.length || 
                        0).toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> pontos</small>
                    </h4>
                    {reportData.stats?.stops?.pontos_ativos && (
                      <small className="text-success">
                        {reportData.stats.stops.pontos_ativos} ativos
                      </small>
                    )}
                  </div>
                  
                  <div className="border-top pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Distância Total das Rotas</span>
                      <i className="fas fa-route text-info"></i>
                    </div>
                    <h4 className="text-info fw-bold mb-0">
                      {(reportData.stats?.routes?.totalDistance || 
                        reportData.routes.reduce((total, route) => total + (parseFloat(route.distancia_km) || 0), 0)).toFixed(2)} 
                      <small className="text-muted fs-6 fw-normal"> km</small>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedSummary;
