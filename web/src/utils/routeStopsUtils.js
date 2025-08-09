/**
 * Utilitários para página de criação de rotas com pontos
 */

/**
 * Verifica se um ponto já foi selecionado
 * @param {Array} pontosSelecionados - Lista de pontos selecionados
 * @param {Object} stop - Ponto a ser verificado
 * @returns {boolean}
 */
export const isStopAlreadySelected = (pontosSelecionados, stop) => {
    return pontosSelecionados.some(ponto => 
        ponto.ponto_id === stop.ponto_id || 
        (ponto.latitude === parseFloat(stop.latitude) && ponto.longitude === parseFloat(stop.longitude))
    );
};

/**
 * Cria um objeto de ponto selecionado
 * @param {Object} stop - Dados do ponto
 * @param {number} ordem - Ordem do ponto na rota
 * @returns {Object}
 */
export const createSelectedStop = (stop, ordem) => ({
    id: `stop-selected-${stop.ponto_id}`,
    ponto_id: stop.ponto_id,
    latitude: parseFloat(stop.latitude),
    longitude: parseFloat(stop.longitude),
    nome: stop.nome,
    logradouro: stop.logradouro,
    bairro: stop.bairro,
    cidade: stop.cidade,
    ordem
});

/**
 * Remove um ponto da lista e reordena os demais
 * @param {Array} pontosSelecionados - Lista atual de pontos
 * @param {number} index - Índice do ponto a ser removido
 * @returns {Array}
 */
export const removeStopAndReorder = (pontosSelecionados, index) => {
    return pontosSelecionados
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, ordem: i + 1 }));
};

/**
 * Formata endereço para exibição
 * @param {Object} ponto - Dados do ponto
 * @returns {string}
 */
export const formatAddress = (ponto) => {
    const partes = [];
    if (ponto.logradouro) partes.push(ponto.logradouro);
    if (ponto.bairro) partes.push(ponto.bairro);
    if (ponto.cidade) partes.push(ponto.cidade);
    return partes.length > 0 ? partes.join(', ') : 'Endereço não informado';
};

/**
 * Formata coordenadas para exibição
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} precision 
 * @returns {string}
 */
export const formatCoordinates = (latitude, longitude, precision = 6) => {
    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
};

/**
 * Centraliza o mapa com base nos pontos fornecidos
 * @param {Array} pontos - Lista de pontos (podem ser pontos existentes ou selecionados)
 * @returns {Array} Array [lat, lng] para centralizar o mapa
 */
export const centerMapWithStops = (pontos) => {
    if (!pontos || pontos.length === 0) {
        return [CONSTANTS.MAP_CENTER.lat, CONSTANTS.MAP_CENTER.lng]; // Retorna o centro padrão se não houver pontos
    }

    // Calcula a média das coordenadas dos pontos
    const avgLat = pontos.reduce((sum, ponto) => sum + parseFloat(ponto.latitude), 0) / pontos.length;
    const avgLng = pontos.reduce((sum, ponto) => sum + parseFloat(ponto.longitude), 0) / pontos.length;
    
    return [avgLat, avgLng];
};

/**
 * Constantes da aplicação
 */
export const CONSTANTS = {
    MAP_CENTER: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    MAP_ZOOM: 12,
    MARKER_COLORS: {
        EXISTING_STOP: 'blue',
        SELECTED_STOP: 'green'
    },
    MARKER_SIZES: {
        EXISTING: 28,
        SELECTED: 32
    },
    POLYLINE_CONFIG: {
        color: '#28a745',
        weight: 4,
        opacity: 0.8
    },
    FLOATING_ELEMENTS: {
        PANEL_WIDTH: '30%',
        PANEL_MIN_WIDTH: '350px',
        MOBILE_PANEL_HEIGHT: '60vh',
        MAX_INSTRUCTIONS_WIDTH: '300px',
        MIN_INSTRUCTIONS_WIDTH: '60px'
    }
};
