import React from 'react';

function RouteStatistics({ stats, pontosSelecionados, advancedStats = null }) {
    // Usar estatísticas avançadas se disponíveis, senão usar as antigas
    const displayStats = advancedStats || stats;
    const isAdvanced = Boolean(advancedStats);
    
    return (
        <div className="mb-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary border-0">
                    <h6 className="card-title mb-0 text-white fw-bold">
                        <i className="fas fa-chart-line me-2"></i>
                        Estatísticas da Rota
                        {isAdvanced && (
                            <span className="badge bg-success ms-2 small">
                                {advancedStats.method === 'real' ? 'Rota Real' : 'Linha Reta'}
                            </span>
                        )}
                    </h6>
                </div>
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-6">
                            <div className="text-center p-2 rounded bg-medium route-stat-card">
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <i className="bi bi-sign-turn-slight-right text-success me-2"></i>
                                    <small className="text-muted fw-medium">
                                        Distância
                                        {isAdvanced && advancedStats.accuracy === 'precise' && (
                                            <i className="bi bi-check-circle-fill text-success ms-1" title="Precisão alta"></i>
                                        )}
                                    </small>
                                </div>
                                <div className="fw-bold text-success fs-5">
                                    {displayStats.totalDistance.toFixed(2)} <small className="text-muted">km</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="text-center p-2 rounded bg-medium route-stat-card">
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <i className="bi bi-clock text-info me-2"></i>
                                    <small className="text-muted fw-medium">Tempo</small>
                                </div>
                                <div className="fw-bold text-info fs-5">
                                    {isAdvanced 
                                        ? advancedStats.details.estimatedTimeFormatted
                                        : `${Math.floor(displayStats.estimatedTime / 60)}h ${Math.round(displayStats.estimatedTime % 60)}min`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {pontosSelecionados.length >= 2 && (
                        <div className="mt-3 pt-2 border-top">
                            <div className="row text-center">
                                <div className="col-4">
                                    <small className="text-muted">Velocidade Média</small>
                                    <div className="fw-medium text-dark">
                                        {isAdvanced ? advancedStats.averageSpeed : '30'} km/h
                                    </div>
                                </div>
                                <div className="col-4">
                                    <small className="text-muted">Segmentos</small>
                                    <div className="fw-medium text-dark">{displayStats.segments.length}</div>
                                </div>
                                <div className="col-4">
                                    <small className="text-muted">Pontos</small>
                                    <div className="fw-medium text-dark">{pontosSelecionados.length}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações detalhadas para estatísticas avançadas */}
                    {isAdvanced && advancedStats.details && (
                        <div className="mt-3 pt-2 border-top">
                            <div className="row">
                                <div className="col-12">
                                    <small className="text-muted d-block mb-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Detalhes do Cálculo
                                    </small>
                                    <div className="row text-center">
                                        <div className="col-6">
                                            <small className="text-muted">Dist. Média/Segmento</small>
                                            <div className="small fw-medium">
                                                {advancedStats.details.averageSegmentDistance.toFixed(2)} km
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted">Método</small>
                                            <div className="small fw-medium">
                                                {advancedStats.method === 'real' ? 'Rota Real (OSRM)' : 'Linha Direta'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RouteStatistics;
