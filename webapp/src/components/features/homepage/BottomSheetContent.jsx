import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusCard, RouteInfoPopup, VehicleDetails } from '../../domain';
import ActionButton from '../../common/buttons/ActionButton';
import PopUpComponent from '../../PopUpComponent';
import { useVehiclesWithDrivers } from '../../../hooks/data/useVehiclesWithDrivers';
import { useMapMarkers } from '../../../hooks/map/useMapMarkers.jsx';
import { useRoutes } from '../../../hooks/data/useRoutes';
import { formatTime } from '../../../../../shared/timeUtils';

/**
 * Transforma dados da API de rotas no formato do BusCard
 * @param {Object} route - Dados da rota da API
 * @param {Array} vehicles - Array de veículos
 * @returns {Array} Array com dados de ida e volta formatados para BusCard
 */
const transformRouteApiToBusCard = (route, vehiclesWithDrivers) => {
    if (!route?.stops?.length) return [];
    
    const veiculoComMotorista = vehiclesWithDrivers?.[0] || {};
    const origem = route.stops.find(s => s.ponto_id === route.userStop) || route.stops[0];
    const destino = route.stops[route.stops.length - 1];
    
    // Função para extrair nome do motorista dos dados corretos
    const getMotoristaName = () => {
        return veiculoComMotorista.motorista_nome || 
               veiculoComMotorista.motorista?.nome || 
               'Motorista não informado';
    };

    const createRouteData = (from, to, isReturn = false) => ({
        id: `${route.rota_id}${isReturn ? '_volta' : ''}`,
        name: veiculoComMotorista.veiculo_nome || veiculoComMotorista.nome || 'Veículo',
        route: `${from.nome || route.origem_descricao} para ${to.nome || route.destino_descricao}`,
        time: isReturn ? '--/--' : formatTime(from.horario_previsto_passagem || from.horario || ''),
        status: route.ativo === 1 ? 'ATIVA' : 'INATIVA',
        codigo_rota: route.codigo_rota,
        ponto_embarque: from.nome,
        distancia_km: route.distancia_km,
        tempo_estimado: route.tempo_viagem_estimado_minutos,
        motorista: getMotoristaName(),
        capacidade: veiculoComMotorista.capacidade || '',
    });

    // Ida
    const ida = createRouteData(origem, destino);
    
    // Volta (inverte stops)
    const stopsReversed = [...route.stops].reverse();
    const origemVolta = stopsReversed[0];
    const destinoVolta = stopsReversed[stopsReversed.length - 1];
    const volta = createRouteData(origemVolta, destinoVolta, true);

    return [ida, volta];
};

/**
 * Componente para exibir indicador de carregamento
 */
const LoadingIndicator = ({ message = "Calculando..." }) => (
    <div className="alert alert-warning py-2 px-3 mb-2 small">
        <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">{message}</span>
            </div>
            {message}
        </div>
    </div>
);

/**
 * Componente para exibir estatísticas do cache
 */
const CacheStats = ({ cacheStats, variant = "info" }) => {
    if (!cacheStats) return null;
    
    return (
        <div className={`alert alert-${variant} py-2 px-3 mb-2 small`}>
            <i className="bi bi-info-circle me-1"></i>
            Cache: {cacheStats.hitRate}% hits ({cacheStats.hits}/{cacheStats.hits + cacheStats.apiCalls})
        </div>
    );
};

/**
 * Componente para exibir status da rota
 */
const RouteStatus = ({ routes, showDetails = false }) => {
    if (!routes) return null;
    
    return (
        <div className="alert alert-success py-2 px-3 mb-2 small">
            <div className="d-flex justify-content-between align-items-center">
                <span>
                    <i className="bi bi-bus-front me-1"></i>
                    Rota {routes.ativo === 1 ? 'ATIVA' : 'INATIVA'}
                    {!showDetails && ` - ${routes.stops?.length || 0} pontos`}
                </span>
                {showDetails && (
                    <span className="badge bg-success">{routes.stops?.length || 0} pontos</span>
                )}
            </div>
            {showDetails && routes.codigo_rota && (
                <div className="mt-1 small text-muted">
                    Código: {routes.codigo_rota}
                </div>
            )}
        </div>
    );
};

/**
 * Hook customizado para dados compartilhados entre componentes
 */
const useBottomSheetData = () => {
    const { routes: routesData } = useRoutes();
    
    // Determina se routesData é um array ou um objeto único
    let routes;
    if (Array.isArray(routesData)) {
        routes = routesData.length > 0 ? routesData[0] : null;
    } else {
        routes = routesData;
    }
    
    const { vehiclesWithDrivers } = useVehiclesWithDrivers(routes?.rota_id);
    const { routingLoading, cacheStats } = useMapMarkers(routes, true);
    
    const busCardRoutes = routes ? transformRouteApiToBusCard(routes, vehiclesWithDrivers) : [];
    
    return {
        routes,
        vehiclesWithDrivers,
        routingLoading,
        cacheStats,
        busCardRoutes
    };
};

// Componente BottomSheet na versão Mini - mostra apenas próximos ônibus
const BottomSheetMini = ({ isDark }) => {
    const { routes: fullRouteData, routingLoading, cacheStats, busCardRoutes } = useBottomSheetData();
    const popupRef = useRef();
    
    const handleBusClick = useCallback((route) => {
        console.log('Bus clicked:', route);
        popupRef.current?.show({
            content: (props) => <RouteInfoPopup route={route} fullRouteData={fullRouteData} {...props} />,
            title: '',
            props: { route, fullRouteData }
        });
    }, [fullRouteData]);
    
    return (
        <div className="mt-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0 fw-bold text-dark">Próximos Ônibus</h6>
                <div className="d-flex align-items-center gap-2">
                    {routingLoading && (
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Calculando...</span>
                        </div>
                    )}
                    <small className="text-muted">
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Agora
                    </small>
                </div>
            </div>

            {busCardRoutes.map(route => (
                <BusCard
                    key={route.id}
                    route={route}
                    onClick={handleBusClick}
                />
            ))}
            
            {/* Popup para informações da rota */}
            <PopUpComponent 
                ref={popupRef}
                variant="card"
                size="lg"
                theme={isDark ? "dark" : "light"}
                borderRadius={20}
                overlayOpacity={0.6}
                animation="zoom"
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
                customStyles={{
                    content: {
                        height: '100%'
                    },
                    dialog: {
                        margin: '1rem',
                        maxHeight: '90vh'
                    },
                    body: {
                        padding: 0,
                        overflow: 'visible'
                    }
                }}
            />
        </div>
    );
};

// Componente BottomSheet na versão Média - inclui debug e sugestões
const BottomSheetMedium = ({ isDark }) => {
    const navigate = useNavigate();
    const { routes: fullRouteData, routingLoading, cacheStats, busCardRoutes, vehiclesWithDrivers } = useBottomSheetData();
    const popupRef = useRef();
    
    const handleBusClick = useCallback((route) => {
        console.log('Bus clicked:', route);
        popupRef.current?.show({
            content: (props) => <RouteInfoPopup route={route} fullRouteData={fullRouteData} {...props} />,
            title: '',
            props: { route, fullRouteData }
        });
    }, [fullRouteData]);
    
    return (
        <div className="overflow-y-auto overflow-x-hidden">
            {/* Seção de Sugestões */}
            <div className="mt-3 bg-light text-dark">
                <div className="mb-3">
                    <h5 className="mb-2 fw-bold text-dark">Sugestões</h5>
                    {fullRouteData?.stops && fullRouteData.userStop ? (
                        (() => {
                            const userStop = fullRouteData.stops.find(stop => stop.ponto_id === fullRouteData.userStop);
                            const horarioRaw = userStop?.horario_previsto_passagem || userStop?.horario || '5h45';
                            const horario = formatTime(horarioRaw);
                            const pontoNome = userStop?.nome || 'A. Zeus';
                            
                            return (
                                <p className="mb-3 text-dark small">
                                    Seu transporte escolar sai do {pontoNome} às {horario}.
                                </p>
                            );
                        })()
                    ) : (
                        <p className="mb-3 text-dark small">
                            Seu transporte escolar sai de A. Zeus às 05:45.
                        </p>
                    )}
                </div>
                <div className="d-flex flex-column">
                    {busCardRoutes.map(route => (
                        <BusCard
                            key={route.id}
                            route={route}
                            onClick={handleBusClick}
                        />
                    ))}
                </div>
            </div>

            {/* Seção de Detalhes do Veículo */}
            <div className="mt-2">
                <VehicleDetails 
                    vehicle={vehiclesWithDrivers?.[0]} 
                    driver={vehiclesWithDrivers?.[0]} 
                />
            </div>
            
            {/* Popup para informações da rota */}
            <PopUpComponent 
                ref={popupRef}
                variant="card"
                size="lg"
                theme={isDark ? "dark" : "light"}
                borderRadius={20}
                overlayOpacity={0.6}
                animation="zoom"
                showCloseButton={true}
                closeOnOverlayClick={true}
                closeOnEscape={true}
                customStyles={{
                    content: {
                        height: '100%'
                    },
                    dialog: {
                        margin: '1rem',
                        maxHeight: '90vh'
                    },
                    body: {
                        padding: 0,
                        overflow: 'visible'
                    }
                }}
            />
        </div>
    );
};

// Componente BottomSheetFull
const BottomSheetFull = () => {
    const navigate = useNavigate();
    const { routes, routingLoading, cacheStats } = useBottomSheetData();
    const [useRealRouting, setUseRealRouting] = useState(true);

    return (
        <div className="overflow-y-auto overflow-x-hidden">
            {/* Seção de Roteamento */}
            <div className="p-3 border-bottom">
                <h6 className="mb-3 text-dark">Roteamento</h6>
                
                {/* Controle de roteamento real */}
                <div className="mb-3">
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="realRoutingSwitch"
                            checked={useRealRouting}
                            onChange={(e) => setUseRealRouting(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="realRoutingSwitch">
                            Usar roteamento real (OSRM)
                        </label>
                    </div>
                    <small className="text-muted">
                        {useRealRouting ? 'Linhas seguem ruas reais' : 'Linhas retas entre pontos'}
                    </small>
                </div>

                {routingLoading && <LoadingIndicator message="Calculando rota real..." />}
                
                {/* Estatísticas do cache com layout melhorado */}
                {cacheStats && (
                    <div className="alert alert-info py-2 px-3 mb-3 small">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>
                                <i className="bi bi-info-circle me-1"></i>
                                Cache Performance
                            </span>
                            <span className="badge bg-primary">{cacheStats.hitRate}%</span>
                        </div>
                        <div className="mt-1 small text-muted">
                            Hits: {cacheStats.hits} | API Calls: {cacheStats.apiCalls}
                        </div>
                    </div>
                )}

                <RouteStatus routes={routes} showDetails />
            </div>

            {/* Botões de Debug */}
            <div className="p-3">
                <h6 className="mb-3 text-muted">Debug</h6>
                
                <div className="d-grid gap-2">
                    <ActionButton
                        icon="bi-box-arrow-in-right"
                        variant="outline-primary"
                        onClick={() => navigate('/login')}
                    >
                        Ir para Login
                    </ActionButton>
                    
                    <ActionButton
                        icon="bi-person-plus"
                        variant="outline-success"
                        onClick={() => navigate('/register')}
                    >
                        Ir para Register
                    </ActionButton>

                    <ActionButton
                        icon="bi-geo-alt"
                        variant="outline-info"
                        onClick={() => console.log('Route data:', routes)}
                    >
                        Log Route Data
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};

/**
 * Constantes para os estados do bottom sheet
 */
const BOTTOM_SHEET_STATES = {
    MINI: 0,
    MEDIUM: 1,
    FULL: 2
};

/**
 * Componente principal do BottomSheetContent
 * @param {Object} props - Propriedades do componente
 * @param {number} props.anchor - Estado atual do bottom sheet (0, 1, ou 2)
 */
const BottomSheetContent = ({ anchor, isDark }) => {
    const contentMap = {
        [BOTTOM_SHEET_STATES.MINI]: BottomSheetMini,
        [BOTTOM_SHEET_STATES.MEDIUM]: BottomSheetMedium,
        [BOTTOM_SHEET_STATES.FULL]: BottomSheetFull
    };
    
    const Content = contentMap[anchor] || BottomSheetMini;

    return <Content anchor={anchor} isDark={isDark} />;
};

export default BottomSheetContent;