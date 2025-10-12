import { useState, useEffect, useCallback, useMemo } from 'react';
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

    // Memoizar os stops ordenados para evitar recalcular
    const sortedStops = useMemo(() => {
        if (!routes?.stops || routes.stops.length === 0) return [];
        
        return [...routes.stops].sort((a, b) => {
            if (a.ordem_rota !== undefined && b.ordem_rota !== undefined) {
                return a.ordem_rota - b.ordem_rota;
            }
            return 0;
        });
    }, [routes?.stops]);

    // Criar uma chave única baseada nos IDs dos pontos para detectar mudanças
    const routeKey = useMemo(() => {
        if (!sortedStops.length) return '';
        return sortedStops.map(s => `${s.ponto_id}-${s.latitude}-${s.longitude}`).join('|');
    }, [sortedStops]);

    // Efeito para calcular rota real quando os dados da rota mudam
    useEffect(() => {
        // Prevenir loop infinito - só executar se routeKey mudou de verdade
        let isCancelled = false;
        
        const calculateRoute = async () => {
            if (isCancelled) return;
            
            if (useRealRoutes && sortedStops.length >= 2) {
                try {
                    console.log(`🗺️ Calculando rota para ${sortedStops.length} pontos...`);
                    const segments = await calculateRealRoute(sortedStops, 'osrm');
                    
                    if (isCancelled) return; // Cancelar se o componente desmontou
                    
                    const combinedCoordinates = combineRouteSegments(segments);
                    
                    setRealRouteCoordinates(combinedCoordinates);
                    setRouteSegments(segments);
                    console.log(`✅ Rota calculada com sucesso: ${combinedCoordinates.length} coordenadas`);
                    
                } catch (error) {
                    if (isCancelled) return;
                    
                    console.error('❌ Erro ao calcular rota real:', error);
                    // Fallback para linha reta
                    setRealRouteCoordinates(
                        sortedStops.map(stop => [stop.latitude, stop.longitude])
                    );
                    setRouteSegments([]);
                }
            } else if (sortedStops.length >= 2) {
                // Modo linha reta
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
        
        // Cleanup function para cancelar operações pendentes
        return () => {
            isCancelled = true;
        };
    }, [routeKey, useRealRoutes]); // APENAS routeKey e useRealRoutes como dependências

    // Handler para centralizar automaticamente ao clicar no marcador
    const handleMarkerClick = useCallback((stop) => {
        if (onCenterMap && stop.latitude && stop.longitude) {
            console.log('Centralizando automaticamente no ponto:', { lat: stop.latitude, lng: stop.longitude });
            onCenterMap(stop.latitude, stop.longitude);
        }
    }, [onCenterMap]);

    // Gerar marcadores dos pontos da rota (memoizado)
    const markers = useMemo(() => {
        return (routes?.stops || []).map(stop => ({
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
    }, [routes?.stops, routes?.userStop, handleMarkerClick]);

    // Gerar polylines para conectar os pontos da rota (memoizado)
    const polylines = useMemo(() => {
        const result = [];
        
        if (sortedStops.length >= 2) {
            // Usar coordenadas reais se disponíveis, senão usar linha reta
            const positions = useRealRoutes && realRouteCoordinates.length > 0 
                ? realRouteCoordinates 
                : sortedStops.map(stop => [stop.latitude, stop.longitude]);
            
            // Usar configuração baseada no status da rota e estado de carregamento
            let polylineConfig;
            if (routingLoading && useRealRoutes) {
                polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.LOADING;
            } else if (routes?.ativo === 1) {
                polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.ROUTE_ACTIVE;
            } else {
                polylineConfig = MAP_CONSTANTS.POLYLINE_CONFIG.ROUTE_INACTIVE;
            }
            
            result.push({
                positions: positions,
                ...polylineConfig
            });
        }
        
        return result;
    }, [sortedStops, useRealRoutes, realRouteCoordinates, routingLoading, routes?.ativo]);

    return { 
        markers, 
        polylines, 
        routingLoading, 
        useRealRoutes: useRealRoutes && realRouteCoordinates.length > 0,
        cacheStats,
        routeSegments
    };
};
