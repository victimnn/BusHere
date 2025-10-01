import { useState, useEffect, useCallback } from 'react';
import { MAP_CONSTANTS } from '../../utils/mapConstants';
import { useRouting } from './useRouting';
import MapPointPopup from '../../components/domain/maps/MapPointPopup';

/**
 * Hook para gerar marcadores e polylines do mapa com roteamento real
 */
export const useMapMarkers = (routes, useRealRoutes = true, onCenterMap = null) => {
    const { calculateRealRoute, combineRouteSegments, loading: routingLoading, cacheStats } = useRouting();
    const [realRouteCoordinates, setRealRouteCoordinates] = useState([]);
    const [routeSegments, setRouteSegments] = useState([]);

    // Efeito para calcular rota real quando os dados da rota mudam
    useEffect(() => {
        const calculateRoute = async () => {
            if (useRealRoutes && routes?.stops && routes.stops.length >= 2) {
                try {
                    // Ordenar stops pela ordem da rota se disponível
                    const sortedStops = [...routes.stops].sort((a, b) => {
                        if (a.ordem_rota !== undefined && b.ordem_rota !== undefined) {
                            return a.ordem_rota - b.ordem_rota;
                        }
                        return 0;
                    });

                    const segments = await calculateRealRoute(sortedStops, 'osrm');
                    const combinedCoordinates = combineRouteSegments(segments);
                    
                    setRealRouteCoordinates(combinedCoordinates);
                    setRouteSegments(segments);
                    
                } catch (error) {
                    console.error('Erro ao calcular rota real:', error);
                    // Fallback para linha reta
                    const sortedStops = [...routes.stops].sort((a, b) => {
                        if (a.ordem_rota !== undefined && b.ordem_rota !== undefined) {
                            return a.ordem_rota - b.ordem_rota;
                        }
                        return 0;
                    });
                    
                    setRealRouteCoordinates(
                        sortedStops.map(stop => [stop.latitude, stop.longitude])
                    );
                    setRouteSegments([]);
                }
            } else if (routes?.stops && routes.stops.length >= 2) {
                // Modo linha reta
                const sortedStops = [...routes.stops].sort((a, b) => {
                    if (a.ordem_rota !== undefined && b.ordem_rota !== undefined) {
                        return a.ordem_rota - b.ordem_rota;
                    }
                    return 0;
                });
                
                setRealRouteCoordinates(
                    sortedStops.map(stop => [stop.latitude, stop.longitude])
                );
                setRouteSegments([]);
            } else {
                setRealRouteCoordinates([]);
                setRouteSegments([]);
            }
        };

        calculateRoute();
    }, [routes, useRealRoutes, calculateRealRoute, combineRouteSegments]);

    // Handler para centralizar automaticamente ao clicar no marcador
    const handleMarkerClick = useCallback((stop) => {
        if (onCenterMap && stop.latitude && stop.longitude) {
            console.log('Centralizando automaticamente no ponto:', { lat: stop.latitude, lng: stop.longitude });
            onCenterMap(stop.latitude, stop.longitude);
        }
    }, [onCenterMap]);

    // Gerar marcadores dos pontos da rota
    const markers = (routes?.stops || []).map(stop => ({
        id: stop.ponto_id,
        position: [stop.latitude, stop.longitude, 0],
        color: stop.ponto_id === routes?.userStop 
            ? MAP_CONSTANTS.MARKER_COLORS.USER_STOP 
            : MAP_CONSTANTS.MARKER_COLORS.ROUTE_STOP,
        size: MAP_CONSTANTS.MARKER_SIZES.DEFAULT,
        popupContent: (
            <MapPointPopup 
                stop={stop} 
                isUserStop={stop.ponto_id === routes?.userStop}
            />
        ),
        onClick: () => handleMarkerClick(stop)
    }));

    // Gerar polylines para conectar os pontos da rota
    const polylines = [];
    if (routes?.stops && routes.stops.length >= 2) {
        // Usar coordenadas reais se disponíveis, senão usar linha reta
        const positions = useRealRoutes && realRouteCoordinates.length > 0 
            ? realRouteCoordinates 
            : (routes.stops || []).sort((a, b) => {
                if (a.ordem_rota !== undefined && b.ordem_rota !== undefined) {
                    return a.ordem_rota - b.ordem_rota;
                }
                return 0;
            }).map(stop => [stop.latitude, stop.longitude]);
        
        // Usar configuração baseada no status da rota e estado de carregamento
        let polylineConfig;
        if (routingLoading && useRealRoutes) {
            polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.LOADING;
        } else if (routes.ativo === 1) {
            polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.ROUTE_ACTIVE;
        } else {
            polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.ROUTE_INACTIVE;
        }
        
        polylines.push({
            positions: positions,
            ...polylineConfig
        });
    }

    return { 
        markers, 
        polylines, 
        routingLoading, 
        useRealRoutes: useRealRoutes && realRouteCoordinates.length > 0,
        cacheStats,
        routeSegments
    };
};
