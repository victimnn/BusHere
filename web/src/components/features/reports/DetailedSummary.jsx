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

  // Funções auxiliares para obter dados de rotas
  const getRouteData = () => {
    if (reportData.stats?.routes?.total) return reportData.stats.routes.total;
    if (reportData.stats?.routes?.byStatus && Array.isArray(reportData.stats.routes.byStatus)) {
      return reportData.stats.routes.byStatus.reduce((total, status) => total + (status.total_rotas || 0), 0);
    }
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.length;
    }
    return 0;
  };

  const getActiveRouteData = () => {
    if (reportData.stats?.routes?.ativas) return reportData.stats.routes.ativas;
    if (reportData.stats?.routes?.byStatus && Array.isArray(reportData.stats.routes.byStatus)) {
      const activeStatuses = ['Ativa', 'Em Operação', 'Disponível'];
      return reportData.stats.routes.byStatus
        .filter(status => activeStatuses.includes(status.status_nome))
        .reduce((total, status) => total + (status.total_rotas || 0), 0);
    }
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.filter(route => route.ativo === true || route.ativo === 1).length;
    }
    return 0;
  };

  const getRoutesByStatus = () => {
    if (reportData.stats?.routes?.byStatus && Array.isArray(reportData.stats.routes.byStatus)) {
      return reportData.stats.routes.byStatus;
    }
    
    // Fallback: calcular a partir dos dados brutos
    if (reportData.routes && Array.isArray(reportData.routes)) {
      const statusCount = {};
      reportData.routes.forEach(route => {
        const status = route.status_nome || 'Desconhecido';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      
      return Object.entries(statusCount).map(([status, count]) => ({
        status_nome: status,
        total_rotas: count
      }));
    }
    
    return [];
  };

  const getPassengersByRoute = () => {
    if (reportData.stats?.routes?.passengersByRoute && Array.isArray(reportData.stats.routes.passengersByRoute)) {
      return reportData.stats.routes.passengersByRoute.map(route => ({
        rota_nome: route.rota_nome || 'Rota sem nome',
        total_passageiros: route.total_passageiros || 0,
        capacidade_rota: route.capacidade_total || 0
      }));
    }
    
    // Fallback: calcular a partir dos dados brutos se disponível
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.map(route => ({
        rota_nome: route.nome || 'Rota sem nome',
        total_passageiros: route.total_passageiros || 0,
        capacidade_rota: route.capacidade_total || 0
      })).filter(route => route.total_passageiros > 0);
    }
    
    return [];
  };

  const totalRoutes = getRouteData();
  const activeRoutes = getActiveRouteData();
  const routesByStatus = getRoutesByStatus();
  const passengersByRoute = getPassengersByRoute();

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
              <div className="col-lg-3">
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
              
              <div className="col-lg-3">
                <div className="bg-light bg-opacity-50 rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-success">
                    <i className="fas fa-chart-bar me-2"></i>
                    Métricas Operacionais
                  </h6>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Capacidade Total da Frota</span>
                      <i className="fas fa-car text-success"></i>
                    </div>
                    <h4 className="text-success fw-bold mb-0">
                      {(reportData.stats?.vehicles?.totalCapacity || 
                       (reportData.vehicles && Array.isArray(reportData.vehicles) ? 
                        reportData.vehicles.reduce((total, vehicle) => total + (parseInt(vehicle.capacidade) || 0), 0) : 0)).toLocaleString()} 
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
              <div className="col-lg-3">
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

              {/* Nova seção de rotas */}
              <div className="col-lg-3">
                <div className="bg-light bg-opacity-50 rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-warning">
                    <i className="fas fa-route me-2"></i>
                    Estatísticas de Rotas
                  </h6>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Total de Rotas</span>
                      <i className="fas fa-route text-warning"></i>
                    </div>
                    <h4 className="text-warning fw-bold mb-0">
                      {totalRoutes.toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> rotas</small>
                    </h4>
                  </div>
                  
                  <div className="border-top pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Rotas Ativas</span>
                      <i className="fas fa-check-circle text-success"></i>
                    </div>
                    <h4 className="text-success fw-bold mb-0">
                      {activeRoutes.toLocaleString()} 
                      <small className="text-muted fs-6 fw-normal"> ativas</small>
                    </h4>
                    {totalRoutes > 0 && (
                      <small className="text-success">
                        {((activeRoutes / totalRoutes) * 100).toFixed(1)}% em operação
                      </small>
                    )}
                  </div>
                  
                  <div className="border-top pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Distribuição por Status</span>
                      <i className="fas fa-chart-pie text-info"></i>
                    </div>
                    <div className="list-group list-group-flush bg-transparent">
                      {routesByStatus.map((status, index) => (
                        <div key={index} className="list-group-item bg-transparent border-0 px-0 d-flex justify-content-between align-items-center">
                          <span className="fw-medium">{status.status_nome}</span>
                          <span className="badge bg-warning rounded-pill px-3 py-2">
                            {status.total_rotas || status.total || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nova linha para informações detalhadas de rotas */}
            {passengersByRoute.length > 0 && (
              <div className="row mt-4">
                <div className="col-12">
                  <div className="bg-light bg-opacity-50 rounded-4 p-4">
                    <h6 className="fw-bold mb-4 text-info">
                      <i className="fas fa-users-cog me-2"></i>
                      Passageiros por Rota (Resumo)
                    </h6>
                    <div className="row g-3">
                      {passengersByRoute.slice(0, 6).map((route, index) => (
                        <div key={index} className="col-md-4 col-sm-6">
                          <div className="bg-white rounded-3 p-3 border">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0 text-truncate" title={route.rota_nome}>
                                {route.rota_nome}
                              </h6>
                              <i className="fas fa-bus text-info"></i>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted small">Passageiros:</span>
                              <span className="badge bg-info rounded-pill px-3 py-2">
                                {route.total_passageiros}
                              </span>
                            </div>
                            {route.capacidade_rota > 0 && (
                              <div className="mt-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="text-muted small">Capacidade:</span>
                                  <span className="text-muted small">
                                    {route.capacidade_rota} lugares
                                  </span>
                                </div>
                                <div className="progress mt-1" style={{height: '4px'}}>
                                  <div 
                                    className="progress-bar bg-info" 
                                    style={{
                                      width: `${Math.min((route.total_passageiros / route.capacidade_rota) * 100, 100)}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {passengersByRoute.length > 6 && (
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          E mais {passengersByRoute.length - 6} rota(s) com passageiros
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Nova seção com tabela detalhada de passageiros por rota */}
            {/* <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{borderRadius: '20px'}}>
                  <div className="card-header bg-transparent border-0 p-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="fas fa-table text-info"></i>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Lista Detalhada de Passageiros por Rota</h5>
                        <small className="text-muted">Informações completas sobre distribuição de passageiros</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    {passengersByRoute.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th scope="col" className="fw-bold">
                                <i className="fas fa-route me-2 text-warning"></i>
                                Nome da Rota
                              </th>
                              <th scope="col" className="fw-bold text-center">
                                <i className="fas fa-users me-2 text-primary"></i>
                                Total de Passageiros
                              </th>
                              <th scope="col" className="fw-bold text-center">
                                <i className="fas fa-chair me-2 text-success"></i>
                                Capacidade
                              </th>
                              <th scope="col" className="fw-bold text-center">
                                <i className="fas fa-percentage me-2 text-info"></i>
                                Taxa de Ocupação
                              </th>
                              <th scope="col" className="fw-bold text-center">
                                <i className="fas fa-chart-bar me-2 text-secondary"></i>
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {passengersByRoute.map((route, index) => {
                              const ocupacao = route.capacidade_rota > 0 
                                ? (route.total_passageiros / route.capacidade_rota) * 100 
                                : 0;
                              const statusClass = ocupacao >= 90 ? 'danger' : 
                                               ocupacao >= 70 ? 'warning' : 
                                               ocupacao >= 50 ? 'info' : 'success';
                              const statusText = ocupacao >= 90 ? 'Lotada' : 
                                               ocupacao >= 70 ? 'Quase Lotada' : 
                                               ocupacao >= 50 ? 'Moderada' : 'Disponível';
                              
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                                        <i className="fas fa-bus text-warning" style={{fontSize: '14px'}}></i>
                                      </div>
                                      <div>
                                        <div className="fw-medium">{route.rota_nome}</div>
                                        <small className="text-muted">Rota #{index + 1}</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                                      {route.total_passageiros.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    {route.capacidade_rota > 0 ? (
                                      <span className="text-success fw-medium">
                                        {route.capacidade_rota.toLocaleString()} lugares
                                      </span>
                                    ) : (
                                      <span className="text-muted">N/A</span>
                                    )}
                                  </td>
                                  <td className="text-center">
                                    {route.capacidade_rota > 0 ? (
                                      <div>
                                        <div className={`fw-medium text-${statusClass}`}>
                                          {ocupacao.toFixed(1)}%
                                        </div>
                                        <div className="progress mt-1" style={{height: '6px', width: '80px', margin: '0 auto'}}>
                                          <div 
                                            className={`progress-bar bg-${statusClass}`}
                                            style={{width: `${Math.min(ocupacao, 100)}%`}}
                                          ></div>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-muted">N/A</span>
                                    )}
                                  </td>
                                  <td className="text-center">
                                    <span className={`badge bg-${statusClass} rounded-pill px-3 py-2`}>
                                      {statusText}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-route text-muted" style={{fontSize: '3rem'}}></i>
                        <h5 className="text-muted mt-3">Nenhuma rota com passageiros encontrada</h5>
                        <p className="text-muted">Não há dados de passageiros por rota disponíveis no momento.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedSummary;
