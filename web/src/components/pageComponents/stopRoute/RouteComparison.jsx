import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para comparar estatísticas entre métodos de roteamento
 */
export const RouteComparison = ({ advancedStats, className = "", onSpeedChange, currentSpeed = 50 }) => {
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
            label: 'Conservador',
            sublabel: '30 km/h',
            time: advancedStats.timeVariations.conservative,
            color: 'warning',
            icon: 'bi-speedometer'
        },
        {
            speed: 40,
            label: 'Moderado',
            sublabel: '40 km/h',
            time: advancedStats.timeVariations.moderate,
            color: 'info',
            icon: 'bi-speedometer2'
        },
        {
            speed: 50,
            label: 'Balanceado',
            sublabel: '50 km/h',
            time: advancedStats.timeVariations.current,
            color: 'success',
            icon: 'bi-check-circle'
        },
        {
            speed: 60,
            label: 'Otimista',
            sublabel: '60 km/h',
            time: advancedStats.timeVariations.optimistic,
            color: 'primary',
            icon: 'bi-lightning'
        }
    ];

    const handleSpeedSelect = (speed) => {
        if (onSpeedChange) {
            onSpeedChange(speed);
        }
    };

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
                                    <button
                                        type="button"
                                        className={`btn w-100 d-flex flex-column justify-content-center align-items-center p-2 position-relative ${
                                            comparison.speed === currentSpeed 
                                                ? `btn-${comparison.color}` 
                                                : `btn-outline-${comparison.color}`
                                        }`}
                                        onClick={() => handleSpeedSelect(comparison.speed)}
                                        style={{ minHeight: '65px' }}
                                    >
                                        {comparison.speed === currentSpeed && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success" style={{ fontSize: '0.6rem' }}>
                                                <i className="bi bi-check" style={{ fontSize: '0.7rem' }}></i>
                                            </span>
                                        )}
                                        
                                        <div className="d-flex align-items-center mb-1">
                                            <i className={`${comparison.icon} me-1`} style={{ fontSize: '1rem' }}></i>
                                            <span className="fw-bold small">{comparison.label}</span>
                                        </div>
                                        
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{comparison.sublabel}</div>
                                        
                                        <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                                            {formatTime(comparison.time)}
                                        </div>
                                    </button>
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
    className: PropTypes.string,
    onSpeedChange: PropTypes.func,
    currentSpeed: PropTypes.number
};

RouteComparison.defaultProps = {
    className: "",
    currentSpeed: 50
};
