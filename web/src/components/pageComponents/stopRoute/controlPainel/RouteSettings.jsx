import React from 'react';
import PropTypes from 'prop-types';
import { RouteControls } from '@web/components/pageComponents/stopRoute/RouteControls';
import { RouteComparison } from '@web/components/pageComponents/stopRoute/RouteComparison';

/**
 * Seção de configurações da rota no painel de controle
 */
function RouteSettings({ 
    pontosSelecionados, 
    useRealRoutes, 
    onToggleRealRoutes, 
    routingLoading,
    cacheStats = { hits: 0, apiCalls: 0, hitRate: 0 },
    advancedStats = null,
    currentSpeed = 50,
    onSpeedChange = () => {}
}) {
    if (pontosSelecionados.length < 2) {
        return null;
    }

    return (
        <>
            {/* <div className="mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-dark">
                            <i className="bi bi-gear me-2"></i>
                            Configurações da Rota
                        </h6>
                    </div>
                    <div className="card-body p-3">
                        <RouteControls
                            useRealRoutes={useRealRoutes}
                            onToggleRealRoutes={onToggleRealRoutes}
                            routingLoading={routingLoading}
                            cacheStats={cacheStats}
                            size="normal"
                        />
                        
                        {useRealRoutes && (
                            <div className="mt-2">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    As rotas são calculadas usando dados do OpenStreetMap através do OSRM.
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div> */}

            {/* Comparação de Tempos - só aparece se tiver estatísticas avançadas */}
            {advancedStats && pontosSelecionados.length >= 2 && (
                <RouteComparison 
                    advancedStats={advancedStats}
                    className="mb-3"
                    currentSpeed={currentSpeed}
                    onSpeedChange={onSpeedChange}
                />
            )}
        </>
    );
}

RouteSettings.propTypes = {
    pontosSelecionados: PropTypes.array.isRequired,
    useRealRoutes: PropTypes.bool.isRequired,
    onToggleRealRoutes: PropTypes.func.isRequired,
    routingLoading: PropTypes.bool,
    cacheStats: PropTypes.shape({
        hits: PropTypes.number,
        apiCalls: PropTypes.number,
        hitRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    advancedStats: PropTypes.object,
    currentSpeed: PropTypes.number,
    onSpeedChange: PropTypes.func
};

RouteSettings.defaultProps = {
    routingLoading: false,
    cacheStats: { hits: 0, apiCalls: 0, hitRate: 0 }
};

export default RouteSettings;
