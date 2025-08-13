import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouteWithStops } from '@web/hooks';
import { useRouteForm } from './controlPainel/useRouteForm';
import { validateTimeOrder } from '@web/utils/routeStopsUtils';
import RouteForm from './controlPainel/RouteForm';
import RouteStatistics from './controlPainel/RouteStatistics';
import SelectedStopsList from './controlPainel/SelectedStopsList';
import ActionButtons from './controlPainel/ActionButtons';
import RouteSettings from './controlPainel/RouteSettings';

function PainelControle({ 
    pontosSelecionados, 
    setPontosSelecionados, 
    onSalvarRota, 
    onLimparTudo, 
    loading,
    rota,
    setRota,
    instanceId = 'default',
    initialData = null, // Adicionar dados iniciais para modo de edição
    isEditMode = false, // Indicar se está em modo de edição
    useRealRoutes = true, // Controle de rotas reais
    onToggleRealRoutes = () => {}, // Handler para toggle de rotas reais
    routingLoading = false, // Loading de roteamento
    cacheStats = { hits: 0, apiCalls: 0, hitRate: 0 }, // Estatísticas do cache
    advancedStats = null, // Estatísticas avançadas
    currentSpeed = 50, // Velocidade atual
    onSpeedChange = () => {} // Handler para mudança de velocidade
}) {
    const { calculateRouteStats } = useRouteWithStops();
    const stats = calculateRouteStats(pontosSelecionados);
    const { formData, statusOptions, handleInputChange, validateForm } = useRouteForm(stats, initialData, pontosSelecionados, advancedStats);

    // Função para mover pontos (drag and drop)
    const moveStop = useCallback((dragIndex, hoverIndex) => {
        const draggedStop = pontosSelecionados[dragIndex];
        const newStops = [...pontosSelecionados];
        newStops.splice(dragIndex, 1);
        newStops.splice(hoverIndex, 0, draggedStop);

        // Atualizar a ordem dos pontos após o movimento
        const stopsWithUpdatedOrder = newStops.map((ponto, index) => ({
            ...ponto,
            ordem: index + 1
        }));

        console.log('Ordem atualizada após movimento:', stopsWithUpdatedOrder.map(p => ({ nome: p.nome, ordem: p.ordem })));
        setPontosSelecionados(stopsWithUpdatedOrder);
    }, [pontosSelecionados, setPontosSelecionados]);

    // Remover ponto específico
    const removerPonto = (index) => {
        const novosPontos = pontosSelecionados.filter((_, i) => i !== index);
        
        // Atualizar a ordem dos pontos restantes
        const pontosComOrdemAtualizada = novosPontos.map((ponto, newIndex) => ({
            ...ponto,
            ordem: newIndex + 1
        }));
        
        setPontosSelecionados(pontosComOrdemAtualizada);
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
            <div className="p-3 h-100 d-flex flex-column">
                {/* Cabeçalho do Painel */}
                <div className="mb-4">
                    <h4 className="text-primary mb-0 fw-bold text-center">
                        <i className="bi bi-map me-2"></i>
                        {isEditMode ? 'Editar Rota' : 'Nova Rota com Pontos'}
                    </h4>
                </div>

                {/* Formulário da Rota */}
                <RouteForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    statusOptions={statusOptions}
                    instanceId={instanceId}
                    useRealRoutes={useRealRoutes}
                    advancedStats={advancedStats}
                    pontosSelecionados={pontosSelecionados}
                />

                {/* Configurações da Rota */}
                <RouteSettings 
                    pontosSelecionados={pontosSelecionados}
                    useRealRoutes={useRealRoutes}
                    onToggleRealRoutes={onToggleRealRoutes}
                    routingLoading={routingLoading}
                    cacheStats={cacheStats}
                    advancedStats={advancedStats}
                    currentSpeed={currentSpeed}
                    onSpeedChange={onSpeedChange}
                />

                {/* Estatísticas da Rota */}
                <RouteStatistics 
                    stats={stats}
                    pontosSelecionados={pontosSelecionados}
                    advancedStats={advancedStats}
                />

                {/* Lista de Pontos Selecionados */}
                <SelectedStopsList 
                    pontosSelecionados={pontosSelecionados}
                    stats={stats}
                    moveStop={moveStop}
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
                    isEditMode={isEditMode}
                />
            </div>
        </DndProvider>
    );
}

export default PainelControle;