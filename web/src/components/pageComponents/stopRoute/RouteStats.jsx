import React from 'react';

/**
 * Componente para exibir estatísticas da rota
 */
const RouteStats = ({ stats, pontosSelecionados }) => {
    if (pontosSelecionados.length < 2) {
        return (
            <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                Selecione pelo menos 2 pontos para ver as estatísticas da rota.
            </div>
        );
    }

    return (
        <div className="bg-light rounded p-3 mb-3">
            <h6 className="text-primary mb-3">
                <i className="fas fa-chart-line me-2"></i>
                Estatísticas da Rota
            </h6>
            <div className="row g-3">
                <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-route text-primary"></i>
                        </div>
                        <div>
                            <div className="small text-muted">Distância Total</div>
                            <div className="fw-bold">{stats.totalDistance.toFixed(2)} km</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-clock text-success"></i>
                        </div>
                        <div>
                            <div className="small text-muted">Tempo Estimado</div>
                            <div className="fw-bold">{Math.round(stats.estimatedTime)} min</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-map-marker-alt text-warning"></i>
                        </div>
                        <div>
                            <div className="small text-muted">Pontos</div>
                            <div className="fw-bold">{pontosSelecionados.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-tachometer-alt text-info"></i>
                        </div>
                        <div>
                            <div className="small text-muted">Velocidade Média</div>
                            <div className="fw-bold">{stats.averageSpeed} km/h</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteStats;
