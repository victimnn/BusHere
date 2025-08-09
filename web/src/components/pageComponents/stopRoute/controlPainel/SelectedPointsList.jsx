import React from 'react';
import DraggableRoutePoint from '../DraggableRoutePoint';

function SelectedPointsList({ 
    pontosSelecionados, 
    stats, 
    movePoint, 
    removerPonto 
}) {
    const EmptyState = () => (
        <div className="d-flex align-items-center justify-content-center h-100 text-center text-muted py-5">
            <div>
                <i className="bi bi-geo-alt fa-3x mb-3 text-muted opacity-50"></i>
                <p className="mb-2 fw-medium">Nenhum ponto selecionado</p>
                <small className="text-muted">
                    Clique nos marcadores azuis do mapa para adicionar pontos
                    <br />
                    <strong>Mínimo de 2 pontos necessários</strong>
                </small>
            </div>
        </div>
    );

    return (
        <div className="flex-grow-1 mb-4">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-light border-0 py-3">
                    <h6 className="mb-0 fw-bold text-dark">
                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                        Pontos Selecionados 
                        <span className="badge bg-primary ms-2">{pontosSelecionados.length}</span>
                    </h6>
                </div>
                <div className="card-body p-0" style={{ minHeight: '200px' }}>
                    {pontosSelecionados.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="list-group route-points-list list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {pontosSelecionados.map((ponto, index) => {
                                const segmentInfo = stats.segments.find(seg => seg.index === index);
                                
                                return (
                                    <DraggableRoutePoint
                                        key={`${ponto.id || ponto.ponto_id}-${index}`}
                                        ponto={ponto}
                                        index={index}
                                        movePoint={movePoint}
                                        onRemove={removerPonto}
                                        segmentInfo={segmentInfo}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SelectedPointsList;
