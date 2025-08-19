import React from 'react';
import { ActionButton } from '@web/components/common';

function ActionButtons({ 
    pontosSelecionados, 
    setPontosSelecionados, 
    onLimparTudo, 
    loading, 
    formData, 
    handleSalvarRota,
    isEditMode = false
}) {
    const isFormValid = formData.nome && 
                       formData.codigo_rota && 
                       formData.origem_descricao && 
                       formData.destino_descricao;

    const handleUndo = () => {
        if (pontosSelecionados.length > 0) {
            setPontosSelecionados(prev => prev.slice(0, -1));
        }
    };

    return (
        <div className="mt-auto">
            <div className="d-grid gap-2 mb-3">
                <div className="row g-2 mb-2">
                    <div className="col-6">
                        <ActionButton
                            variant="outline-secondary"
                            size="md"
                            onClick={onLimparTudo}
                            disabled={pontosSelecionados.length === 0 || loading}
                            icon="bi bi-trash"
                            text="Limpar"
                            className="w-100 justify-content-center"
                            style={{ minHeight: '40px' }}
                        />
                    </div>
                    <div className="col-6">
                        <ActionButton
                            variant="outline-warning"
                            size="md"
                            onClick={handleUndo}
                            disabled={pontosSelecionados.length === 0 || loading}
                            icon="bi bi-arrow-counterclockwise"
                            text="Desfazer"
                            className="w-100 justify-content-center"
                            style={{ minHeight: '40px' }}
                        />
                    </div>
                </div>
                
                <ActionButton
                    variant="primary"
                    size="lg"
                    onClick={handleSalvarRota}
                    disabled={pontosSelecionados.length < 2 || loading || !isFormValid}
                    loading={loading}
                    icon={isEditMode ? "bi bi-pencil-square" : "bi bi-plus-circle"}
                    text={isEditMode ? "Atualizar Rota" : "Criar Rota"}
                    className="w-100 justify-content-center"
                    style={{ minHeight: '50px' }}
                />
            </div>
        </div>
    );
}

export default ActionButtons;
