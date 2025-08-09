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
    setRota 
}) => {
    return (
        <div className="d-lg-none">
            <div 
                className="offcanvas offcanvas-bottom" 
                tabIndex="-1" 
                id="mobileControls"
                data-bs-backdrop="false"
                style={{ height: CONSTANTS.FLOATING_ELEMENTS.MOBILE_PANEL_HEIGHT }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title">
                        <i className="fas fa-route me-2"></i>
                        Controles da Rota
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="offcanvas-body p-0">
                    <PainelControle
                        pontosSelecionados={pontosSelecionados}
                        setPontosSelecionados={setPontosSelecionados}
                        onSalvarRota={onSalvarRota}
                        onLimparTudo={onLimparTudo}
                        loading={loading}
                        rota={rota}
                        setRota={setRota}
                        instanceId="mobile"
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileControlPanel;
