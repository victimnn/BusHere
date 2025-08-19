import React from 'react';

/**
 * Componente para contador de pontos flutuante
 */
const FloatingPointsCounter = ({ pontosSelecionados }) => {
    if (pontosSelecionados.length === 0) return null;

    return (
        <div className="floating-element position-absolute top-0 end-0 m-3">
            <div className="bg-success text-white rounded-3 px-3 py-2 shadow-sm">
                <i className="fas fa-map-marker-alt me-2"></i>
                <span className="d-none d-sm-inline">
                    {pontosSelecionados.length} ponto{pontosSelecionados.length !== 1 ? 's' : ''} selecionado{pontosSelecionados.length !== 1 ? 's' : ''}
                </span>
                <span className="d-sm-none">
                    {pontosSelecionados.length}
                </span>
            </div>
        </div>
    );
};

export default FloatingPointsCounter;
