import { useCallback } from 'react';
import { useApiOperation, useCoordinateUtils } from '@web/hooks/useCommonOperations';
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

                // Preparar dados para o backend
                const dataToSend = {
                    nome: routeData.nome,
                    codigo_rota: routeData.codigo_rota,
                    origem_descricao: routeData.origem_descricao || null,
                    destino_descricao: routeData.destino_descricao || null,
                    distancia_km: routeData.distancia_km || null,
                    tempo_viagem_estimado_minutos: routeData.tempo_viagem_estimado_minutos || null,
                    status_rota_id: routeData.status_rota_id || 1,
                    ativo: routeData.ativo !== false,
                    pontos: routeData.pontos
                };

                console.log('Enviando dados da rota:', dataToSend);
                console.log('Pontos específicos:', routeData.pontos);

                return await api.routes.createWithStops(dataToSend);
            },
            `Rota "${routeData.nome}" criada com sucesso!`
        );
    }, [executeOperation]);

    const baseReturn = {
        loading,
        error,
        createRouteWithStops,
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
