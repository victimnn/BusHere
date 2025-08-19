import React from 'react';

const DetailedSummary = ({ reportData }) => {
  // Funções auxiliares para obter dados de motoristas
  const getDriverData = () => {
    if (reportData.stats?.drivers?.total) return reportData.stats.drivers.total;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.length;
    }
    return 0;
  };

  const getActiveDriverData = () => {
    if (reportData.stats?.drivers?.ativos) return reportData.stats.drivers.ativos;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.filter(driver => 
        (driver.ativo === true || driver.ativo === 1) && 
        (driver.status_nome === 'Ativo' || driver.status_motorista_id === 1)
      ).length;
    }
    return 0;
  };

  const getDriversByStatus = () => {
    if (reportData.stats?.drivers?.byStatus && Array.isArray(reportData.stats.drivers.byStatus)) {
      return reportData.stats.drivers.byStatus;
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
              <div className="col-lg-4">
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
              
              <div className="col-lg-4">
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
                       (reportData.buses && Array.isArray(reportData.buses) ? 
                        reportData.buses.reduce((total, bus) => total + (parseInt(bus.capacidade) || 0), 0) : 0)).toLocaleString()} 
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
                        (reportData.routes && Array.isArray(reportData.routes) ? 
                         reportData.routes.reduce((total, route) => total + (parseFloat(route.distancia_km) || 0), 0) : 0)).toFixed(2)} 
                      <small className="text-muted fs-6 fw-normal"> km</small>
                    </h4>
                  </div>
                </div>
              </div>

              {/* Nova seção de motoristas */}
              <div className="col-lg-4">
                <div className="bg-light bg-opacity-50 rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-danger">
                    <i className="fas fa-user-tie me-2"></i>
                    Estatísticas de Motoristas
                  </h6>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Total de Motoristas</span>
                      <i className="fas fa-users text-danger"></i>
                    </div>
                    <h4 className="text-danger fw-bold mb-0">
                      {totalDrivers.toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> motoristas</small>
                    </h4>
                  </div>
                  
                  <div className="border-top pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Motoristas Ativos</span>
                      <i className="fas fa-user-check text-success"></i>
                    </div>
                    <h4 className="text-success fw-bold mb-0">
                      {activeDrivers.toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> ativos</small>
                    </h4>
                    {totalDrivers > 0 && (
                      <small className="text-success">
                        {((activeDrivers / totalDrivers) * 100).toFixed(1)}% da equipe
                      </small>
                    )}
                  </div>
                  
                  <div className="border-top pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Distribuição por Status</span>
                      <i className="fas fa-chart-pie text-info"></i>
                    </div>
                    <div className="list-group list-group-flush bg-transparent">
                      {driversByStatus.map((status, index) => (
                        <div key={index} className="list-group-item bg-transparent border-0 px-0 d-flex justify-content-between align-items-center">
                          <span className="fw-medium">{status.status_nome}</span>
                          <span className="badge bg-info rounded-pill px-3 py-2">
                            {status.total_motoristas || status.total || 0}
                          </span>
                        </div>
                      ))}
                    </div>
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
