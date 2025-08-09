import React, { useState, useEffect } from 'react';

/**
 * Componente para botão flutuante mobile
 */
const FloatingMobileButton = ({ pontosSelecionados }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Verificar se está em dispositivo mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsVisible(window.innerWidth < 992);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="floating-element d-lg-none position-fixed bottom-0 start-50 translate-middle-x" 
             style={{ 
                 bottom: '20px', 
                 zIndex: 1050,
                 left: '50%',
                 transform: 'translateX(-50%)'
             }}>
            <button
                className="btn btn-primary btn-lg rounded-pill shadow-lg px-4 py-3"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileControls"
                aria-controls="mobileControls"
                style={{ 
                    fontSize: '1rem',
                    fontWeight: '600',
                    minWidth: '180px',
                    whiteSpace: 'nowrap'
                }}
            >
                <i className="fas fa-sliders-h me-2"></i>
                Controles ({pontosSelecionados.length})
            </button>
        </div>
    );
};

export default FloatingMobileButton;
