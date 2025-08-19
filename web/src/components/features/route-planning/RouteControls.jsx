import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CacheStats } from './CacheStats';

/**
 * Componente para controlar opções de roteamento
 */
export const RouteControls = ({ 
    useRealRoutes, 
    onToggleRealRoutes, 
    routingLoading,
    cacheStats = { hits: 0, apiCalls: 0, hitRate: 0 },
    className = "",
    size = "normal" // "normal" ou "compact"
}) => {
    const [showCacheStats, setShowCacheStats] = useState(false);
    
    const sizeClasses = {
        normal: "form-check",
        compact: "form-check form-check-sm"
    };

    const labelSizeClasses = {
        normal: "form-check-label",
        compact: "form-check-label small"
    };

    const showCacheButton = cacheStats.hits > 0 || cacheStats.apiCalls > 0;

    return (
        <>
            <div className={`route-controls ${className}`}>
                <div className={sizeClasses[size]}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="useRealRoutes"
                        checked={useRealRoutes}
                        onChange={(e) => onToggleRealRoutes(e.target.checked)}
                        disabled={routingLoading}
                    />
                    <label className={labelSizeClasses[size]} htmlFor="useRealRoutes">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-map me-2"></i>
                            <span>Usar rotas reais</span>
                            {routingLoading && (
                                <div className="spinner-border spinner-border-sm ms-2" role="status">
                                    <span className="visually-hidden">Carregando rota...</span>
                                </div>
                            )}
                        </div>
                        {size === "normal" && (
                            <small className="text-muted d-block">
                                Quando ativado, as linhas seguem as ruas e avenidas
                            </small>
                        )}
                    </label>
                </div>

                {/* Botão de estatísticas do cache (só aparece se houver dados) */}
                {showCacheButton && (
                    <div className={`mt-2 ${size === "compact" ? "d-flex justify-content-between align-items-center" : ""}`}>
                        {size === "compact" && (
                            <small className="text-muted">
                                Cache: {cacheStats.hits} hits ({cacheStats.hitRate}%)
                            </small>
                        )}
                        <button
                            type="button"
                            className={`btn btn-outline-info ${size === "compact" ? "btn-sm" : ""}`}
                            onClick={() => setShowCacheStats(true)}
                            title="Ver estatísticas do cache"
                        >
                            <i className="bi bi-hdd-stack me-1"></i>
                            {size === "normal" && "Cache Stats"}
                        </button>
                    </div>
                )}

                {/* Informações adicionais para tamanho normal */}
                {size === "normal" && showCacheButton && (
                    <div className="mt-2">
                        <small className="text-muted d-block">
                            <i className="bi bi-info-circle me-1"></i>
                            Cache hits: {cacheStats.hits} | API calls: {cacheStats.apiCalls} | Hit rate: {cacheStats.hitRate}%
                        </small>
                    </div>
                )}
            </div>

            {/* Modal de estatísticas do cache */}
            <CacheStats
                cacheStats={cacheStats}
                show={showCacheStats}
                onClose={() => setShowCacheStats(false)}
            />
        </>
    );
};

RouteControls.propTypes = {
    useRealRoutes: PropTypes.bool.isRequired,
    onToggleRealRoutes: PropTypes.func.isRequired,
    routingLoading: PropTypes.bool,
    cacheStats: PropTypes.shape({
        hits: PropTypes.number,
        apiCalls: PropTypes.number,
        hitRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    className: PropTypes.string,
    size: PropTypes.oneOf(['normal', 'compact'])
};

RouteControls.defaultProps = {
    routingLoading: false,
    cacheStats: { hits: 0, apiCalls: 0, hitRate: 0 },
    className: "",
    size: "normal"
};
