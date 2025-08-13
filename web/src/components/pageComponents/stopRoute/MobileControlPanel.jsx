import React from 'react';
import PainelControle from '@web/components/pageComponents/stopRoute/PainelControle';
import { CONSTANTS } from '@web/utils/routeStopsUtils';

/**
 * Componente para painel de controle mobile (offcanvas)
 */
const MobileControlPanel = ({ 
    pontosSelecionados, 
    setPontosSelecionados, 
    onSalvarRota, 
    onLimparTudo, 
    loading, 
    rota, 
    setRota,
    initialData = null,
    isEditMode = false,
    useRealRoutes = true,
    onToggleRealRoutes = () => {},
    routingLoading = false,
    cacheStats = { hits: 0, apiCalls: 0, hitRate: 0 },
    advancedStats = null
}) => {
    return (
        <div className="d-lg-none">
            <div 
                className="offcanvas offcanvas-bottom" 
                tabIndex="-1" 
                id="mobileControls"
                data-bs-backdrop="true"
                data-bs-scroll="false"
                data-bs-keyboard="true"
                style={{ 
                    height: CONSTANTS.FLOATING_ELEMENTS.MOBILE_PANEL_HEIGHT,
                    zIndex: 1055
                }}
            >
                <div className="offcanvas-header border-bottom bg-medium">
                    <h5 className="offcanvas-title fw-bold text-primary">
                        <i className="fas fa-route me-2"></i>
                        {isEditMode ? 'Editar Rota' : 'Controles da Rota'}
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="offcanvas"
                        aria-label="Fechar"
                    ></button>
                </div>
                <div className="offcanvas-body p-0" style={{ overflowY: 'auto' }}>
                    <PainelControle
                        pontosSelecionados={pontosSelecionados}
                        setPontosSelecionados={setPontosSelecionados}
                        onSalvarRota={onSalvarRota}
                        onLimparTudo={onLimparTudo}
                        loading={loading}
                        rota={rota}
                        setRota={setRota}
                        instanceId="mobile"
                        initialData={initialData}
                        isEditMode={isEditMode}
                        useRealRoutes={useRealRoutes}
                        onToggleRealRoutes={onToggleRealRoutes}
                        routingLoading={routingLoading}
                        cacheStats={cacheStats}
                        advancedStats={advancedStats}
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileControlPanel;
