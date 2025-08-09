import React from 'react';
import { formatAddress, formatCoordinates } from '@web/utils/routeStopsUtils';

/**
 * Componente para exibir popup de ponto existente
 */
export const ExistingStopPopup = ({ stop, onAddToRoute }) => (
    <div className="p-2">
        <h6 className="mb-2 text-primary">{stop.nome}</h6>
        <div className="small text-muted">
            <div>
                <i className="fas fa-map-marker-alt me-1"></i>
                {formatAddress(stop)}
            </div>
            <div className="mt-1">
                <i className="fas fa-crosshairs me-1"></i>
                {formatCoordinates(parseFloat(stop.latitude), parseFloat(stop.longitude))}
            </div>
        </div>
        <button 
            className="btn btn-sm btn-primary mt-2 w-100"
            onClick={() => onAddToRoute(stop)}
        >
            <i className="fas fa-plus me-1"></i>
            Adicionar à Rota
        </button>
    </div>
);

/**
 * Componente para exibir popup de ponto selecionado
 */
export const SelectedStopPopup = ({ ponto, index, onRemoveFromRoute }) => (
    <div className="p-2">
        <h6 className="mb-2 text-success">
            <span className="badge bg-success me-2">{index + 1}</span>
            {ponto.nome}
        </h6>
        <div className="small text-muted mb-2">
            <i className="fas fa-crosshairs me-1"></i>
            {formatCoordinates(ponto.latitude, ponto.longitude)}
        </div>
        <button 
            className="btn btn-sm btn-outline-danger w-100"
            onClick={() => onRemoveFromRoute(index)}
        >
            <i className="fas fa-trash me-1"></i>
            Remover da Rota
        </button>
    </div>
);
