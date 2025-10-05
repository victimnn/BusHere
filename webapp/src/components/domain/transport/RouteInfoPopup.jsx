import React from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../../../../../shared/timeUtils';

const RouteInfoPopup = ({ route, fullRouteData, close }) => {
    if (!route) {
        return (
            <div className="route-popup-container route-popup-scrollable">
                <div className="route-popup-content">
                    <div className="empty-state">
                        <i className="bi bi-exclamation-circle text-muted"></i>
                        <p className="text-muted">Nenhuma informação disponível.</p>
                    </div>
                </div>
            </div>
        );
    }

    const routeStops = fullRouteData?.stops || [];
    const userStopId = fullRouteData?.userStop;

    return (
        <div className="route-popup-container route-popup-scrollable">
            <div className="route-popup-content">
                {/* Cabeçalho principal */}
                <div className="route-header">
                    <div className="vehicle-info-card">
                        <div className="vehicle-avatar">
                            <i className="bi bi-bus-front-fill"></i>
                        </div>
                        <div className="vehicle-details">
                            <h4 className="vehicle-name">{route.name}</h4>
                            <div className="route-code">{route.codigo_rota}</div>
                            <div className={`status-indicator ${route.status.toLowerCase()}`}>
                                <i className="bi bi-circle-fill"></i>
                                {route.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informações principais da rota */}
                <div className="route-main-section">
                <div className="route-path-card">
                    <div className="path-header">
                        <i className="bi bi-signpost text-primary"></i>
                        <h6>Trajeto</h6>
                    </div>
                    <p className="route-description">{route.route}</p>
                </div>

                <div className="route-timing-grid">
                    <div className="timing-card primary">
                        <div className="timing-icon">
                            <i className="bi bi-clock"></i>
                        </div>
                        <div className="timing-content">
                            <span className="timing-label">Horário</span>
                            <span className="timing-value">{route.time}</span>
                        </div>
                    </div>
                    
                    <div className="timing-card secondary">
                        <div className="timing-icon">
                            <i className="bi bi-geo-alt"></i>
                        </div>
                        <div className="timing-content">
                            <span className="timing-label">Ponto</span>
                            <span className="timing-value">{route.ponto_embarque}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pontos da rota */}
            {routeStops.length > 0 && (
                <div className="route-stops-section">
                    <div className="section-header">
                        <div className="left-content">
                            <i className="bi bi-map text-success"></i>
                            <h6>Pontos da Rota</h6>
                        </div>
                        <span className="stops-count">{routeStops.length} pontos</span>
                    </div>
                    
                    <div className="stops-timeline">
                        {routeStops.map((stop, index) => {
                            const isUserStop = stop.ponto_id === userStopId;
                            const isFirst = index === 0;
                            const isLast = index === routeStops.length - 1;
                            
                            return (
                                <div key={stop.ponto_id} className={`stop-item ${isUserStop ? 'user-stop' : ''}`}>
                                    <div className="stop-marker">
                                        {isFirst && <i className="bi bi-play-circle-fill text-success"></i>}
                                        {isLast && <i className="bi bi-stop-circle-fill text-danger"></i>}
                                        {!isFirst && !isLast && <div className="stop-dot"></div>}
                                    </div>
                                    
                                    <div className="stop-content">
                                        <div className="stop-name">
                                            {stop.nome}
                                            {isUserStop && <span className="user-badge">Seu ponto</span>}
                                        </div>
                                        
                                        {(stop.horario_previsto_passagem || stop.horario) && (
                                            <div className="stop-time">
                                                <i className="bi bi-clock"></i>
                                                {formatTime(stop.horario_previsto_passagem || stop.horario)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Seção de informações técnicas */}
            {(route.distancia_km || route.tempo_estimado) && (
                <div className="technical-info-section">
                    <div className="section-header">
                        <div className="left-content">
                            <i className="bi bi-graph-up text-warning"></i>
                            <h6>Informações Técnicas</h6>
                        </div>
                    </div>
                    
                    <div className="technical-grid">
                        {route.distancia_km && (
                            <div className="tech-card distance">
                                <div className="tech-icon">
                                    <i className="bi bi-speedometer2"></i>
                                </div>
                                <div className="tech-content">
                                    <span className="tech-label">Distância</span>
                                    <span className="tech-value">{route.distancia_km}</span>
                                    <span className="tech-unit">km</span>
                                </div>
                                <div className="tech-visual">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${Math.min((route.distancia_km / 50) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {route.tempo_estimado && (
                            <div className="tech-card duration">
                                <div className="tech-icon">
                                    <i className="bi bi-stopwatch"></i>
                                </div>
                                <div className="tech-content">
                                    <span className="tech-label">Duração</span>
                                    <span className="tech-value">{route.tempo_estimado}</span>
                                    <span className="tech-unit">min</span>
                                </div>
                                <div className="tech-visual">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${Math.min((route.tempo_estimado / 120) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            </div>

            {/* Botão de ação */}
            <div className="action-section">
                <button 
                    className="action-button"
                    onClick={close}
                >
                    <i className="bi bi-x-circle"></i>
                    Fechar
                </button>
            </div>
        </div>
    );
};

RouteInfoPopup.propTypes = {
    route: PropTypes.object,
    fullRouteData: PropTypes.object,
    close: PropTypes.func.isRequired
};

RouteInfoPopup.defaultProps = {
    route: null,
    fullRouteData: null
};

export default RouteInfoPopup;