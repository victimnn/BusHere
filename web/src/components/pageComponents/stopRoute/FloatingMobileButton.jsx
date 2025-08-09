import React from 'react';

/**
 * Componente para botão flutuante mobile
 */
const FloatingMobileButton = ({ pontosSelecionados }) => {
    return (
        <div className="floating-element d-lg-none position-absolute bottom-0 start-50 translate-middle-x mb-3">
            <button
                className="btn btn-primary btn-lg rounded-pill shadow-lg"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileControls"
            >
                <i className="fas fa-sliders-h me-2"></i>
                Controles ({pontosSelecionados.length})
            </button>
        </div>
    );
};

export default FloatingMobileButton;
