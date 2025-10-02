/**
 * Constantes para configuração de mapas e polylines
 * Baseado na implementação do web para manter consistência
 */

export const MAP_CONSTANTS = {
    // Configurações de marcadores
    MARKER_COLORS: {
        USER_STOP: 'green',        // Ponto do usuário
        ROUTE_STOP: 'purple',       // Pontos da rota
        CURRENT_POSITION: 'blue'   // Posição atual
    },
    
    MARKER_SIZES: {
        DEFAULT: 32,
        SMALL: 24,
        LARGE: 40
    },
    
    // Configurações de polylines
    POLYLINE_CONFIG: {
        ROUTE_ACTIVE: {
            color: '#800080',     // Purple para rota ativa
            weight: 6,
            opacity: 0.7
        },
        ROUTE_INACTIVE: {
            color: '#6c757d',     // Cinza para rota inativa
            weight: 3,
            opacity: 0.6
        },
        LOADING: {
            color: '#ffc107',     // Amarelo para carregamento
            weight: 3,
            opacity: 0.6,
            dashArray: '5, 10'    // Mantém tracejado apenas para carregamento
        }
    },
    
    // Configurações do mapa
    MAP_CONFIG: {
        DEFAULT_ZOOM: 15,
        MIN_ZOOM: 3,
        MAX_ZOOM: 18,
        DEFAULT_CENTER: [-22.7065182, -46.7651778]
    }
};
