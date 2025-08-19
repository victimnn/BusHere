import { useCallback } from 'react';
import { 
    useApiOperation, 
    useCoordinateUtils, 
    prepareRouteBackendData
} from '../operations/useRouteOperations';
import { 
    isStopAlreadySelected, 
    createSelectedStop, 
    removeStopAndReorder
} from '@web/utils/routeStopsUtils';
import api from '@web/api/api';

/**
 * Hook customizado para gerenciar rotas com pontos
 */
export function useRouteWithStops(
    pontosSelecionados = null, 
    setPontosSelecionados = null, 
    showNotification = null, 
    mapRef = null
) {
    const { loading, error, setError, executeOperation } = useApiOperation();
    const { calculateDistance, calculateRouteStats, validateCoordinates, formatCoordinates } = useCoordinateUtils();

    // Função para fechar popup do mapa
    const closeMapPopup = useCallback(() => {
        if (mapRef && mapRef.current && mapRef.current.closePopup) {
            mapRef.current.closePopup();
        }
    }, [mapRef]);

    // Handlers para gerenciar pontos da rota (só disponíveis quando os parâmetros são fornecidos)
    const handleSelectExistingStop = useCallback((stop) => {
        if (!pontosSelecionados || !setPontosSelecionados) return;
        
        // Verificar se o ponto já foi selecionado
        if (isStopAlreadySelected(pontosSelecionados, stop)) {
            showNotification && showNotification('Este ponto já foi adicionado à rota', 'warning');
            return;
        }

        const pontoSelecionado = createSelectedStop(stop, pontosSelecionados.length + 1);
        setPontosSelecionados(prev => [...prev, pontoSelecionado]);
        showNotification && showNotification(`Ponto "${stop.nome}" adicionado à rota`, 'success');
        closeMapPopup();
    }, [pontosSelecionados, setPontosSelecionados, showNotification, closeMapPopup]);

    const handleRemoveStop = useCallback((index) => {
        if (!pontosSelecionados || !setPontosSelecionados) return;
        
        const ponto = pontosSelecionados[index];
        const novosPotnos = removeStopAndReorder(pontosSelecionados, index);
        setPontosSelecionados(novosPotnos);
        showNotification && showNotification(`Ponto "${ponto.nome}" removido da rota`, 'info');
        closeMapPopup();
    }, [pontosSelecionados, setPontosSelecionados, showNotification, closeMapPopup]);

    const handleClearAll = useCallback(() => {
        if (!pontosSelecionados || !setPontosSelecionados) return;
        if (pontosSelecionados.length === 0) return;
        
        // Nota: Este hook não pode usar ConfirmDialog diretamente
        // O componente pai deve implementar a confirmação
        if (window.confirm('Tem certeza que deseja remover todos os pontos selecionados?')) {
            setPontosSelecionados([]);
            showNotification && showNotification('Todos os pontos foram removidos', 'info');
        }
    }, [pontosSelecionados, setPontosSelecionados, showNotification]);

    // Função para criar rota com pontos
    const createRouteWithStops = useCallback(async (routeData) => {
        return executeOperation(
            async () => {
                // Validação dos dados
                if (!routeData.nome || !routeData.codigo_rota) {
                    throw new Error('Nome e código da rota são obrigatórios');
                }

                if (!routeData.origem_descricao || !routeData.destino_descricao) {
                    throw new Error('Descrição da origem e destino são obrigatórias');
                }

                if (!routeData.pontos || routeData.pontos.length < 2) {
                    throw new Error('Selecione pelo menos 2 pontos para criar uma rota');
                }

                // Usar função centralizada para preparar dados básicos da rota
                const baseRouteData = prepareRouteBackendData(routeData);
                
                // Adicionar pontos aos dados
                const dataToSend = {
                    ...baseRouteData,
                    pontos: routeData.pontos
                };

                const result = await api.routes.createWithStops(dataToSend);
                
                // Se ônibus e motorista foram selecionados, criar a associação
                if (routeData.onibus_id && routeData.motorista_id && result.rota_id) {
                    const assignmentData = {
                        onibus_id: routeData.onibus_id,
                        motorista_id: routeData.motorista_id,
                        observacoes: routeData.observacoes_assignment || null
                    };
                    
                    try {
                        await api.routes.createAssignment(result.rota_id, assignmentData);
                    } catch (assignmentError) {
                        console.error('Erro na criação da associação:', assignmentError);
                        // Não falhar toda a operação se apenas a associação falhar
                        console.warn('Rota criada, mas associação falhou. Continuando...');
                    }
                }

                return result;
            },
            `Rota "${routeData.nome}" criada com sucesso!`
        );
    }, [executeOperation]);

    // Função para atualizar rota existente
    const updateRouteWithAssignment = useCallback(async (routeId, routeData) => {
        return executeOperation(
            async () => {
                // Preparar dados da rota com pontos
                const routeUpdateData = {
                    ...prepareRouteBackendData(routeData),
                    pontos: routeData.pontos || []
                };

                // Remover campos undefined
                Object.keys(routeUpdateData).forEach(key => {
                    if (routeUpdateData[key] === undefined) {
                        delete routeUpdateData[key];
                    }
                });

                // Atualizar rota com pontos
                const routeResult = await api.routes.updateWithStops(routeId, routeUpdateData);

                // Gerenciar associação de ônibus e motorista
                if (routeData.onibus_id && routeData.motorista_id) {
                    // Buscar associações existentes
                    const assignmentsResponse = await api.routes.getAssignments(routeId);
                    const existingAssignments = assignmentsResponse.data || [];
                    
                    // Verificar se já existe uma associação ativa
                    const activeAssignment = existingAssignments.find(assignment => assignment.ativo);
                    
                    if (activeAssignment) {
                        // Atualizar associação existente
                        const assignmentData = {
                            onibus_id: routeData.onibus_id,
                            motorista_id: routeData.motorista_id,
                            observacoes: routeData.observacoes_assignment || null
                        };
                        
                        await api.routes.updateAssignment(routeId, activeAssignment.onibus_rota_id, assignmentData);
                    } else {
                        // Criar nova associação
                        const assignmentData = {
                            onibus_id: routeData.onibus_id,
                            motorista_id: routeData.motorista_id,
                            observacoes: routeData.observacoes_assignment || null
                        };
                        
                        await api.routes.createAssignment(routeId, assignmentData);
                    }
                } else {
                    // Se ônibus ou motorista foram removidos, desativar associação existente
                    const assignmentsResponse = await api.routes.getAssignments(routeId);
                    const existingAssignments = assignmentsResponse.data || [];
                    const activeAssignment = existingAssignments.find(assignment => assignment.ativo);
                    
                    if (activeAssignment) {
                        await api.routes.deleteAssignment(routeId, activeAssignment.onibus_rota_id);
                    }
                }

                return routeResult;
            },
            `Rota "${routeData.nome}" atualizada com sucesso!`
        );
    }, [executeOperation]);

    // Função para buscar dados completos da rota incluindo associações
    const getRouteWithAssignments = useCallback(async (routeId) => {
        return executeOperation(
            async () => {
                const [routeResponse, assignmentsResponse] = await Promise.all([
                    api.routes.getByIdWithStops(routeId),
                    api.routes.getAssignments(routeId)
                ]);

                const route = routeResponse;
                const assignments = assignmentsResponse.data || [];
                const activeAssignment = assignments.find(assignment => assignment.ativo);

                // Combinar dados da rota com a associação ativa
                const routeWithAssignment = {
                    ...route,
                    onibus_id: activeAssignment?.onibus_id || null,
                    motorista_id: activeAssignment?.motorista_id || null,
                    observacoes_assignment: activeAssignment?.observacoes || '',
                    assignment_id: activeAssignment?.onibus_rota_id || null,
                    onibus_nome: activeAssignment?.onibus_nome || null,
                    onibus_placa: activeAssignment?.onibus_placa || null,
                    motorista_nome: activeAssignment?.motorista_nome || null,
                    motorista_cnh: activeAssignment?.motorista_cnh || null
                };

                return routeWithAssignment;
            },
            null // Sem mensagem de sucesso para operação de busca
        );
    }, [executeOperation]);

    // Função para excluir rota com tratamento de dependências
    const deleteRouteWithStops = useCallback(async (routeId) => {
        return executeOperation(
            async () => {
                // 1. Buscar informações da rota
                const route = await api.routes.getById(routeId);
                
                // 2. Remover associações de ônibus/motorista se existirem
                try {
                    const assignmentsResponse = await api.routes.getAssignments(routeId);
                    const assignments = assignmentsResponse.data || [];
                    
                    for (const assignment of assignments) {
                        if (assignment.ativo) {
                            await api.routes.deleteAssignment(routeId, assignment.onibus_rota_id);
                        }
                    }
                } catch (assignmentError) {
                    console.warn('Erro ao remover associações:', assignmentError);
                    // Continuar mesmo se a remoção de associações falhar
                }
                
                // 3. Tentar excluir a rota
                await api.routes.delete(routeId);
                
                return { 
                    success: true,
                    deletedRoute: route
                };
            },
            `Rota "${route?.nome || 'ID: ' + routeId}" excluída com sucesso!`
        );
    }, [executeOperation]);

    const baseReturn = {
        loading,
        error,
        createRouteWithStops,
        updateRouteWithAssignment,
        getRouteWithAssignments,
        deleteRouteWithStops,
        calculateDistance,
        calculateRouteStats,
        validateCoordinates,
        formatCoordinates,
        setError
    };

    // Adicionar handlers apenas quando os parâmetros necessários são fornecidos
    if (pontosSelecionados !== null && setPontosSelecionados !== null) {
        return {
            ...baseReturn,
            handleSelectExistingStop,
            handleRemoveStop,
            handleClearAll
        };
    }

    return baseReturn;
}
