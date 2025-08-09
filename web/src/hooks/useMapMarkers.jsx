import React from 'react';
import { CONSTANTS } from '@web/utils/routeStopsUtils';
import { ExistingStopPopup, SelectedStopPopup } from '@web/components/pageComponents/stopRoute/StopPopups';

/**
 * Hook para gerar marcadores do mapa
 */
export const useMapMarkers = (stops, pontosSelecionados, handlers) => {
    const { handleSelectExistingStop, handleRemoveStop } = handlers;

    const markers = [
        // Pontos existentes (azuis)
        ...(stops || []).map(stop => ({
            id: `stop-${stop.ponto_id}`,
            position: { lat: parseFloat(stop.latitude), lng: parseFloat(stop.longitude) },
            title: stop.nome,
            color: CONSTANTS.MARKER_COLORS.EXISTING_STOP,
            size: CONSTANTS.MARKER_SIZES.EXISTING,
            popupContent: (
                <ExistingStopPopup 
                    stop={stop} 
                    onAddToRoute={handleSelectExistingStop} 
                />
            ),
            data: stop
        })),
        // Pontos selecionados (verdes, com numeração)
        ...pontosSelecionados.map((ponto, index) => ({
            id: `selected-${ponto.id}`,
            position: { lat: ponto.latitude, lng: ponto.longitude },
            title: `${index + 1}. ${ponto.nome}`,
            color: CONSTANTS.MARKER_COLORS.SELECTED_STOP,
            size: CONSTANTS.MARKER_SIZES.SELECTED,
            popupContent: (
                <SelectedStopPopup 
                    ponto={ponto} 
                    index={index} 
                    onRemoveFromRoute={handleRemoveStop} 
                />
            ),
            data: ponto
        }))
    ];

    // Polylines para conectar os pontos selecionados
    const polylines = pontosSelecionados.length >= 2 ? [{
        positions: pontosSelecionados.map(ponto => [ponto.latitude, ponto.longitude]),
        ...CONSTANTS.POLYLINE_CONFIG
    }] : [];

    return { markers, polylines };
};
