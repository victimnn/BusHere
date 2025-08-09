import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStops } from '@web/hooks/useStops';
import { useNotification } from '@web/hooks/useNotification';
import { useRouteWithStops } from '@web/hooks/useRouteWithStops';
import { useMapMarkers } from '@web/hooks/useMapMarkers.jsx';
import { CONSTANTS, centerMapWithStops } from '@web/utils/routeStopsUtils';
import MapComponent from '@web/components/ui/MapComponent';
import PainelControle from '@web/components/pageComponents/stopRoute/PainelControle';
import LoadingSpinner from '@web/components/common/LoadingSpinner';
import ErrorAlert from '@web/components/common/ErrorAlert';
import PopUpComponent from '@web/components/ui/PopUpComponent';
import TutorialContent from '@web/components/pageComponents/stopRoute/TutorialContent';
import FloatingInstructions from '@web/components/pageComponents/stopRoute/FloatingInstructions';
import FloatingPointsCounter from '@web/components/pageComponents/stopRoute/FloatingPointsCounter';
import FloatingMobileButton from '@web/components/pageComponents/stopRoute/FloatingMobileButton';
import MobileControlPanel from '@web/components/pageComponents/stopRoute/MobileControlPanel';

/**
 * @typedef {Object} PontoSelecionado
 * @property {string} id
 * @property {number} [ponto_id]
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} nome
 * @property {number} ordem
 * @property {string} [logradouro]
 * @property {string} [bairro]
 * @property {string} [cidade]
 * @property {string} [horario_previsto_passagem] - Horário previsto de passagem no formato HH:MM
 */

/**
 * @typedef {Object} Rota
 * @property {string} nome
 * @property {PontoSelecionado[]} pontos
 * @property {number} distanciaTotal
 * @property {number} tempoEstimado
 */

function RouteStopsPage({ pageFunctions }) {
    const navigate = useNavigate();
    const { stops, loading: stopsLoading, error: stopsError } = useStops();
    const { showNotification } = useNotification();
    
    // Refs
    const popUpRef = useRef(null);
    const mapRef = useRef(null);

    // Estados da aplicação
    const [pontosSelecionados, setPontosSelecionados] = useState([]);
    const [rota, setRota] = useState(null);
    const [instructionsMinimized, setInstructionsMinimized] = useState(false);
    const [mapCenter, setMapCenter] = useState([CONSTANTS.MAP_CENTER.lat, CONSTANTS.MAP_CENTER.lng]);

    // Hook unificado para gerenciar rotas e handlers
    const { 
        loading: routeLoading, 
        error: routeError, 
        createRouteWithStops,
        calculateRouteStats,
        setError: setRouteError,
        handleSelectExistingStop,
        handleRemoveStop,
        handleClearAll
    } = useRouteWithStops(
        pontosSelecionados, 
        setPontosSelecionados, 
        showNotification, 
        mapRef
    );

    // Objeto de handlers para compatibilidade com useMapMarkers
    const routeHandlers = {
        handleSelectExistingStop,
        handleRemoveStop,
        handleClearAll
    };

    // Marcadores e polylines do mapa
    const { markers, polylines } = useMapMarkers(stops, pontosSelecionados, routeHandlers);

    // Handler para abrir o tutorial
    const handleOpenTutorial = () => {
        if (popUpRef.current) {
            popUpRef.current.show({
                content: (props) => <TutorialContent {...props} />,
                title: 'Tutorial - Criação de Rotas'
            });
        }
    };

    // Handler para minimizar/expandir instruções
    const toggleInstructions = () => {
        setInstructionsMinimized(prev => !prev);
    };

    // Efeito para configurar página
    useEffect(() => {
        pageFunctions.set("Nova Rota", true, true);
    }, [pageFunctions]);

    // Efeito para centralizar o mapa com base nos pontos existentes
    useEffect(() => {
        const novoCenter = centerMapWithStops(stops);
        setMapCenter(novoCenter);
    }, [stops]);

    // Handler para salvar rota
    const handleSalvarRota = async (dadosRota) => {
        try {
            setRouteError(null);

            // Calcular estatísticas da rota
            const stats = calculateRouteStats(pontosSelecionados);
            
            // Adicionar estatísticas aos dados da rota
            const rotaComEstatisticas = {
                ...dadosRota,
                distancia_km: stats.totalDistance,
                tempo_viagem_estimado_minutos: Math.round(stats.estimatedTime)
            };

            const resultado = await createRouteWithStops(rotaComEstatisticas);

            if (resultado.success) {
                showNotification(resultado.message, 'success');

                // Limpar formulário e voltar para página de rotas
                setPontosSelecionados([]);
                setRota(null);
                
                setTimeout(() => {
                    navigate('/routes');
                }, 1500);
            } else {
                showNotification(resultado.error, 'error');
            }

        } catch (error) {
            console.error('Erro inesperado ao salvar rota:', error);
            showNotification('Erro inesperado ao salvar rota', 'error');
        }
    };

    // Renderização
    if (stopsLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (stopsError) {
        return (
            <div className="container mt-4">
                <ErrorAlert 
                    message={`Erro ao carregar pontos: ${stopsError}`}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="route-stops-page w-100 h-100 d-flex flex-column flex-lg-row">
            {/* Painel de Controle Desktop */}
            <div 
                className="painel-controle d-none d-lg-block border-end" 
                style={{ 
                    width: CONSTANTS.FLOATING_ELEMENTS.PANEL_WIDTH, 
                    minWidth: CONSTANTS.FLOATING_ELEMENTS.PANEL_MIN_WIDTH 
                }}
            >
                <PainelControle
                    pontosSelecionados={pontosSelecionados}
                    setPontosSelecionados={setPontosSelecionados}
                    onSalvarRota={handleSalvarRota}
                    onLimparTudo={routeHandlers.handleClearAll}
                    loading={routeLoading}
                    rota={rota}
                    setRota={setRota}
                    instanceId="desktop"
                />
            </div>

            {/* Painel Mobile */}
            <MobileControlPanel
                pontosSelecionados={pontosSelecionados}
                setPontosSelecionados={setPontosSelecionados}
                onSalvarRota={handleSalvarRota}
                onLimparTudo={routeHandlers.handleClearAll}
                loading={routeLoading}
                rota={rota}
                setRota={setRota}
            />

            {/* Mapa */}
            <div className="map-container flex-grow-1 position-relative">
                {/* Alertas de erro */}
                {routeError && (
                    <div className="floating-element position-absolute top-0 start-0 end-0 p-3">
                        <ErrorAlert 
                            message={routeError}
                            onClose={() => setRouteError(null)}
                        />
                    </div>
                )}

                {/* Loading de salvamento */}
                {routeLoading && (
                    <div className="floating-element high-priority position-absolute top-50 start-50 translate-middle">
                        <div className="bg-white rounded p-3 shadow-lg text-center">
                            <LoadingSpinner size="sm" />
                            <div className="mt-2 text-primary fw-bold">Salvando rota...</div>
                        </div>
                    </div>
                )}

                {/* Componente do Mapa */}
                <MapComponent 
                    ref={mapRef}
                    className='w-100 h-100' 
                    center={mapCenter}
                    zoom={CONSTANTS.MAP_ZOOM}
                    markers={markers}
                    polylines={polylines}
                />

                {/* Elementos flutuantes */}
                <FloatingMobileButton pontosSelecionados={pontosSelecionados} />
                
                <FloatingInstructions
                    instructionsMinimized={instructionsMinimized}
                    onToggleInstructions={toggleInstructions}
                    onOpenTutorial={handleOpenTutorial}
                />

                <FloatingPointsCounter pontosSelecionados={pontosSelecionados} />
            </div>

            {/* PopUp Component para Tutorial */}
            <PopUpComponent ref={popUpRef} />
        </div>
    );
}

export default RouteStopsPage;