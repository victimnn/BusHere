import React from 'react';

/**
 * Componente para instruções flutuantes
 */
const FloatingInstructions = ({ 
    instructionsMinimized, 
    onToggleInstructions, 
    onOpenTutorial 
}) => {
    return (
        <div className="floating-element position-absolute bottom-0 start-0 m-3 d-none d-md-block">
            <div 
                className={`card border-0 shadow-sm transition-all ${
                    instructionsMinimized ? 'p-2' : 'p-3'
                }`} 
                style={{ 
                    maxWidth: instructionsMinimized ? '60px' : '300px',
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                {!instructionsMinimized ? (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-primary mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Como usar:
                            </h6>
                            <button 
                                className="btn btn-sm btn-outline-secondary p-1"
                                onClick={onToggleInstructions}
                                title="Minimizar instruções"
                                style={{ width: '28px', height: '28px' }}
                            >
                                <i className="fas fa-minus" style={{ fontSize: '12px' }}></i>
                            </button>
                        </div>
                        <ul className="small mb-2 ps-3 text-dark">
                            <li>Clique nos marcadores azuis para adicionar pontos existentes à rota</li>
                            <li className="d-lg-none">Use o botão "Controles" para gerenciar a rota</li>
                            <li className="d-none d-lg-block">Use o painel lateral para gerenciar a rota</li>
                            <li>Mínimo de 2 pontos necessários</li>
                        </ul>
                        <button 
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={onOpenTutorial}
                        >
                            <i className="fas fa-question-circle me-1"></i>
                            Ver Tutorial Completo
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={onToggleInstructions}
                            title="Expandir instruções"
                            style={{ width: '44px', height: '44px' }}
                        >
                            <i className="fas fa-info-circle"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingInstructions;
