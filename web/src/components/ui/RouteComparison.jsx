import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para comparar estatísticas entre métodos de roteamento
 */
export const RouteComparison = ({ advancedStats, className = "" }) => {
    const [showComparison, setShowComparison] = useState(false);

    if (!advancedStats || !advancedStats.timeVariations) {
        return null;
    }

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${Math.round(minutes)}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}min`;
    };

    const speedComparisons = [
        {
            speed: 30,
            label: 'Conservador (30 km/h)',
            time: advancedStats.timeVariations.conservative,
            color: 'warning',
            icon: 'bi-speedometer'
        },
        {
            speed: 40,
            label: 'Moderado (40 km/h)',
            time: advancedStats.timeVariations.moderate,
            color: 'info',
            icon: 'bi-speedometer2'
        },
        {
            speed: 50,
            label: 'Atual (50 km/h)',
            time: advancedStats.timeVariations.current,
            color: 'success',
            icon: 'bi-check-circle'
        },
        {
            speed: 60,
            label: 'Otimista (60 km/h)',
            time: advancedStats.timeVariations.optimistic,
            color: 'primary',
            icon: 'bi-lightning'
        }
    ];

    return (
        <div className={`route-comparison ${className}`}>
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-light border-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold text-dark">
                            <i className="bi bi-graph-up me-2"></i>
                            Comparação de Tempos
                        </h6>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setShowComparison(!showComparison)}
                        >
                            <i className={`bi bi-chevron-${showComparison ? 'up' : 'down'}`}></i>
                        </button>
                    </div>
                </div>
                
                {showComparison && (
                    <div className="card-body p-3">
                        <div className="row g-2">
                            {speedComparisons.map((comparison, index) => (
                                <div key={index} className="col-6">
                                    <div className={`p-2 rounded border ${comparison.speed === 50 ? 'border-success bg-success bg-opacity-10' : ''}`}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className={`${comparison.icon} text-${comparison.color} me-2`}></i>
                                                    <small className="fw-medium">{comparison.label}</small>
                                                    {comparison.speed === 50 && (
                                                        <span className="badge bg-success ms-2 small">Atual</span>
                                                    )}
                                                </div>
                                                <div className={`fw-bold text-${comparison.color}`}>
                                                    {formatTime(comparison.time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-3 pt-2 border-top">
                            <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                <strong>Distância:</strong> {advancedStats.totalDistance.toFixed(2)} km |{' '}
                                <strong>Método:</strong> {advancedStats.method === 'real' ? 'Rota Real' : 'Linha Reta'} |{' '}
                                <strong>Precisão:</strong> {advancedStats.accuracy === 'precise' ? 'Alta' : 'Aproximada'}
                            </small>
                        </div>

                        {advancedStats.method === 'real' && (
                            <div className="mt-2">
                                <div className="alert alert-success py-2 mb-0">
                                    <small>
                                        <i className="bi bi-check-circle me-1"></i>
                                        <strong>Vantagem:</strong> Cálculo baseado em rotas reais seguindo ruas e avenidas, 
                                        proporcionando maior precisão para estimativas de tempo.
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

RouteComparison.propTypes = {
    advancedStats: PropTypes.object,
    className: PropTypes.string
};

RouteComparison.defaultProps = {
    className: ""
};
