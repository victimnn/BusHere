import React from 'react';
import { formatAddress, formatCoordinates } from '@web/utils/routeStopsUtils';

/**
 * Componente para exibir popup de ponto existente
 */
export const ExistingStopPopup = ({ stop, onAddToRoute }) => (
    <div className="card shadow-sm border-0 p-3" style={{ minWidth: '280px', maxWidth: '320px' }}>
        {/* Header com nome e status */}
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
                <h5 className="mb-1 text-primary fw-bold">{stop.nome}</h5>
                <span className={`badge ${stop.ativo ? 'bg-success' : 'bg-secondary'} mb-2`}>
                    {stop.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </div>
        </div>

        {/* Informações do endereço */}
        <div className="mb-3">
            <div className="d-flex align-items-start mb-2">
                <i className="bi bi-geo-alt-fill text-danger me-2 mt-1"></i>
                <div className="flex-grow-1">
                    <small className="text-muted d-block">Endereço:</small>
                    <span className="fw-medium text-dark">
                        {formatAddress(stop)}
                    </span>
                </div>
            </div>

            {/* Coordenadas */}
            <div className="d-flex align-items-start">
                <i className="bi bi-crosshair text-secondary me-2 mt-1"></i>
                <div className="flex-grow-1">
                    <small className="text-muted d-block">Coordenadas:</small>
                    <code className="small bg-medium text-dark px-2 py-1 rounded coordinates-code">
                        {formatCoordinates(parseFloat(stop.latitude), parseFloat(stop.longitude))}
                    </code>
                </div>
            </div>
        </div>

        {/* Botão */}
        <div className="d-grid">
            <button 
                className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2"
                onClick={() => onAddToRoute(stop)}
            >
                <i className="bi bi-plus-circle-fill"></i>
                Adicionar à Rota
            </button>
        </div>
    </div>
);

/**
 * Componente para exibir popup de ponto selecionado
 */
export const SelectedStopPopup = ({ ponto, index, onRemoveFromRoute }) => (
    <div className="card shadow-sm border-0 p-3" style={{ minWidth: '280px', maxWidth: '320px' }}>
        {/* Header com nome e posição na rota */}
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
                <h5 className="mb-1 text-success fw-bold">
                    <span className="badge bg-success me-2">{index + 1}</span>
                    {ponto.nome}
                </h5>
                <span className="badge bg-info mb-2">
                    Adicionado à Rota
                </span>
            </div>
        </div>

        {/* Informações das coordenadas */}
        <div className="mb-3">
            <div className="d-flex align-items-start">
                <i className="bi bi-crosshair text-secondary me-2 mt-1"></i>
                <div className="flex-grow-1">
                    <small className="text-muted d-block">Coordenadas:</small>
                    <code className="small bg-medium text-dark px-2 py-1 rounded coordinates-code">
                        {formatCoordinates(ponto.latitude, ponto.longitude)}
                    </code>
                </div>
            </div>
        </div>

        {/* Botão */}
        <div className="d-grid">
            <button 
                className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2"
                onClick={() => onRemoveFromRoute(index)}
            >
                <i className="bi bi-trash-fill"></i>
                Remover da Rota
            </button>
        </div>
    </div>
);
