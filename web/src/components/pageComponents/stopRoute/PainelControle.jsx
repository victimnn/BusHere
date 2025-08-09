import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouteWithStops } from '@web/hooks/useRouteWithStops';
import { useRouteForm } from './controlPainel/useRouteForm';
import { validateTimeOrder } from '@web/utils/routeStopsUtils';
import RouteForm from './controlPainel/RouteForm';
import RouteStatistics from './controlPainel/RouteStatistics';
import SelectedPointsList from './controlPainel/SelectedPointsList';
import ActionButtons from './controlPainel/ActionButtons';

function PainelControle({ 
    pontosSelecionados, 
    setPontosSelecionados, 
    onSalvarRota, 
    onLimparTudo, 
    loading,
    rota,
    setRota,
    instanceId = 'default'
}) {
    const { calculateRouteStats } = useRouteWithStops();
    const stats = calculateRouteStats(pontosSelecionados);
    const { formData, statusOptions, handleInputChange, validateForm } = useRouteForm(stats);

    // Função para mover pontos (drag and drop)
    const movePoint = useCallback((dragIndex, hoverIndex) => {
        const draggedPoint = pontosSelecionados[dragIndex];
        const newPoints = [...pontosSelecionados];
        newPoints.splice(dragIndex, 1);
        newPoints.splice(hoverIndex, 0, draggedPoint);
        setPontosSelecionados(newPoints);
    }, [pontosSelecionados, setPontosSelecionados]);

    // Remover ponto específico
    const removerPonto = (index) => {
        const novosPontos = pontosSelecionados.filter((_, i) => i !== index);
        setPontosSelecionados(novosPontos);
    };

    // Atualizar horário de um ponto específico
    const handleTimeChange = useCallback((index, horario) => {
        const novosPotnos = pontosSelecionados.map((ponto, i) => 
            i === index 
                ? { ...ponto, horario_previsto_passagem: horario }
                : ponto
        );
        setPontosSelecionados(novosPotnos);
    }, [pontosSelecionados, setPontosSelecionados]);

    // Salvar rota
    const handleSalvarRota = () => {
        if (!validateForm()) return;

        if (pontosSelecionados.length < 2) {
            alert('Selecione pelo menos 2 pontos para criar uma rota');
            return;
        }

        // Validar ordem dos horários
        const timeValidation = validateTimeOrder(pontosSelecionados);
        if (!timeValidation.isValid) {
            alert(`Erro na validação dos horários:\n${timeValidation.error}`);
            return;
        }

        const dadosRota = {
            ...formData,
            pontos: pontosSelecionados.map(ponto => ({
                ponto_id: ponto.ponto_id,
                horario_previsto_passagem: ponto.horario_previsto_passagem || null
            })),
            ativo: true
        };

        onSalvarRota(dadosRota);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-3 h-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Cabeçalho do Painel */}
                <div className="mb-4">
                    <h4 className="text-primary mb-0 fw-bold text-center">
                        <i className="bi bi-map me-2"></i>
                        Nova Rota com Pontos
                    </h4>
                </div>

                {/* Formulário da Rota */}
                <RouteForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    statusOptions={statusOptions}
                    instanceId={instanceId}
                />

                {/* Estatísticas da Rota */}
                <RouteStatistics 
                    stats={stats}
                    pontosSelecionados={pontosSelecionados}
                />

                {/* Lista de Pontos Selecionados */}
                <SelectedPointsList 
                    pontosSelecionados={pontosSelecionados}
                    stats={stats}
                    movePoint={movePoint}
                    removerPonto={removerPonto}
                    onTimeChange={handleTimeChange}
                />

                {/* Botões de Ação */}
                <ActionButtons 
                    pontosSelecionados={pontosSelecionados}
                    setPontosSelecionados={setPontosSelecionados}
                    onLimparTudo={onLimparTudo}
                    loading={loading}
                    formData={formData}
                    handleSalvarRota={handleSalvarRota}
                />
            </div>
        </DndProvider>
    );
}

export default PainelControle;