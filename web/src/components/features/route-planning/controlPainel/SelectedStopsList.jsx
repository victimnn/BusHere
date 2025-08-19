import React, { useMemo } from 'react';
import DraggableRouteStop from '../DraggableRouteStop';
import { validateTimeOrder } from '@web/utils/routeStopsUtils';

function SelectedStopsList({ 
    pontosSelecionados, 
    stats, 
    moveStop, 
    removerPonto,
    onTimeChange
}) {
    // Memoizar o cálculo dos erros de validação para melhor performance
    const timeValidationErrors = useMemo(() => {
        const errors = {};
        
        pontosSelecionados.forEach((ponto, index) => {
            if (ponto.horario_previsto_passagem && ponto.horario_previsto_passagem.trim() !== '') {
                // Verificar se o horário anterior é posterior a este
                if (index > 0) {
                    const pontoAnterior = pontosSelecionados[index - 1];
                    if (pontoAnterior.horario_previsto_passagem && 
                        pontoAnterior.horario_previsto_passagem.trim() !== '' &&
                        ponto.horario_previsto_passagem <= pontoAnterior.horario_previsto_passagem) {
                        errors[index] = 'Horário deve ser posterior ao ponto anterior';
                        return;
                    }
                }
                
                // Verificar se o próximo horário é anterior a este
                if (index < pontosSelecionados.length - 1) {
                    const proximoPonto = pontosSelecionados[index + 1];
                    if (proximoPonto.horario_previsto_passagem && 
                        proximoPonto.horario_previsto_passagem.trim() !== '' &&
                        proximoPonto.horario_previsto_passagem <= ponto.horario_previsto_passagem) {
                        errors[index] = 'Horário deve ser anterior ao próximo ponto';
                    }
                }
            }
        });
        
        return errors;
    }, [pontosSelecionados]);

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
                <div className="card-header bg-medium border-0 py-3">
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
                                const timeValidationError = timeValidationErrors[index] || null;
                                
                                return (
                                    <DraggableRouteStop
                                        key={`${ponto.id || ponto.ponto_id}-${index}`}
                                        ponto={ponto}
                                        index={index}
                                        moveStop={moveStop}
                                        onRemove={removerPonto}
                                        segmentInfo={segmentInfo}
                                        onTimeChange={onTimeChange}
                                        timeValidationError={timeValidationError}
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

export default SelectedStopsList;
