import React, { useEffect, useRef } from 'react';

function HelpModal({ onClose = null }) {
    const modalRef = useRef(null);

    // Função para fechar o modal programaticamente
    const closeModal = () => {
        if (modalRef.current) {
            const modal = window.bootstrap?.Modal?.getInstance(modalRef.current);
            if (modal) {
                modal.hide();
            } else {
                // Fallback para fechar o modal manualmente
                modalRef.current.classList.remove('show');
                modalRef.current.style.display = 'none';
                modalRef.current.setAttribute('aria-hidden', 'true');
                modalRef.current.removeAttribute('aria-modal');
                modalRef.current.removeAttribute('role');
                
                // Remove backdrop se existir
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                
                // Remove class do body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        }
        
        // Chama callback se fornecido
        if (onClose) {
            onClose();
        }
    };

    // Adiciona listener para tecla ESC
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <div 
            className="modal fade" 
            id="helpModal" 
            tabIndex="-1" 
            aria-labelledby="helpModalLabel" 
            aria-hidden="true"
            ref={modalRef}
            onClick={(e) => {
                // Fecha o modal se clicar no backdrop (fora do modal-content)
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title" id="helpModalLabel">
                            <i className="fas fa-question-circle me-2"></i>
                            Como criar uma rota com pontos
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={closeModal}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="text-primary mb-3">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    Adicionando Pontos
                                </h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-map-pin text-primary me-2"></i>
                                        <strong>Clique nos marcadores azuis</strong> para adicionar pontos existentes à rota
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-eye text-info me-2"></i>
                                        <strong>Clique nos marcadores verdes</strong> para ver detalhes dos pontos selecionados
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-search text-secondary me-2"></i>
                                        <strong>Use os pontos cadastrados</strong> no sistema para criar suas rotas
                                    </li>
                                </ul>

                                <h6 className="text-primary mb-3 mt-4">
                                    <i className="fas fa-route me-2"></i>
                                    Gerenciando a Rota
                                </h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-list-ol text-success me-2"></i>
                                        Os pontos são numerados na ordem de seleção
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-trash text-danger me-2"></i>
                                        Use o botão "×" para remover pontos específicos
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-undo text-warning me-2"></i>
                                        Use "Desfazer" para remover o último ponto
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-eraser text-secondary me-2"></i>
                                        Use "Limpar Tudo" para remover todos os pontos
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-grip-vertical text-primary me-2"></i>
                                        <strong>Arraste e solte</strong> pontos para reordenar a sequência
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="col-md-6">
                                <h6 className="text-primary mb-3">
                                    <i className="fas fa-edit me-2"></i>
                                    Preenchendo Dados
                                </h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-asterisk text-danger me-2" style={{fontSize: '8px'}}></i>
                                        <strong>Nome da Rota:</strong> Obrigatório - Ex: "Linha Centro-Bairro"
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-asterisk text-danger me-2" style={{fontSize: '8px'}}></i>
                                        <strong>Origem:</strong> Obrigatório - Descrição do ponto inicial
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-asterisk text-danger me-2" style={{fontSize: '8px'}}></i>
                                        <strong>Destino:</strong> Obrigatório - Descrição do ponto final
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-calculator text-info me-2"></i>
                                        <strong>Distância e Tempo:</strong> Calculados automaticamente
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-check-circle text-success me-2"></i>
                                        <strong>Status:</strong> Selecione o status da rota
                                    </li>
                                </ul>

                                <h6 className="text-primary mb-3 mt-4">
                                    <i className="fas fa-mobile-alt me-2"></i>
                                    Versão Mobile
                                </h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-hand-point-up text-primary me-2"></i>
                                        Toque no botão "Controles" para acessar as opções
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-expand-arrows-alt text-success me-2"></i>
                                        O mapa ocupa toda a tela em dispositivos móveis
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="alert alert-info">
                                    <h6 className="alert-heading">
                                        <i className="fas fa-lightbulb me-2"></i>
                                        Dicas Importantes:
                                    </h6>
                                    <ul className="mb-0">
                                        <li>É necessário <strong>mínimo de 2 pontos</strong> para criar uma rota</li>
                                        <li>A <strong>linha verde</strong> mostra o trajeto conectando os pontos</li>
                                        <li>As <strong>distâncias são calculadas</strong> em linha reta entre os pontos</li>
                                        <li>O <strong>tempo estimado</strong> considera velocidade média urbana de 30 km/h</li>
                                        <li>Você pode <strong>selecionar apenas pontos cadastrados</strong> no sistema</li>
                                        <li><strong>Arraste os pontos</strong> pela alça <i className="fas fa-grip-vertical"></i> para reordenar</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary me-2" 
                            onClick={closeModal}
                        >
                            <i className="fas fa-times me-2"></i>
                            Fechar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={closeModal}
                        >
                            <i className="fas fa-check me-2"></i>
                            Entendi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpModal;
