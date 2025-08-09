import React from 'react';

function RouteStatistics({ stats, pontosSelecionados }) {
    return (
        <div className="mb-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary border-0">
                    <h6 className="card-title mb-0 text-white fw-bold">
                        <i className="fas fa-chart-line me-2"></i>
                        Estatísticas da Rota
                    </h6>
                </div>
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-6">
                            <div className="text-center p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <i className="bi bi-sign-turn-slight-right text-success me-2"></i>
                                    <small className="text-muted fw-medium">Distância</small>
                                </div>
                                <div className="fw-bold text-success fs-5">
                                    {stats.totalDistance.toFixed(2)} <small className="text-muted">km</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="text-center p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <i className="bi bi-clock text-info me-2"></i>
                                    <small className="text-muted fw-medium">Tempo</small>
                                </div>
                                <div className="fw-bold text-info fs-5">
                                    {Math.floor(stats.estimatedTime / 60)}h{' '}
                                    {Math.round(stats.estimatedTime % 60)}<small className="text-muted">min</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {pontosSelecionados.length >= 2 && (
                        <div className="mt-3 pt-2 border-top">
                            <div className="row text-center">
                                <div className="col-6">
                                    <small className="text-muted">Velocidade Média</small>
                                    <div className="fw-medium text-dark">30 km/h</div>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted">Segmentos</small>
                                    <div className="fw-medium text-dark">{stats.segments.length}</div>
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
