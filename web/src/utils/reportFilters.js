// Utilitários para filtros de status nos relatórios

/**
 * Verifica se um veículo está em operação (ativo)
 * @param {string} statusNome - Nome do status do veículo
 * @returns {boolean}
 */
export const isVehicleActive = (statusNome) => {
  if (!statusNome) return false;
  const status = statusNome.toLowerCase();
  return status.includes('operação') || 
         status === 'ativo';
};

/**
 * Verifica se uma rota está ativa
 * @param {string} statusNome - Nome do status da rota
 * @returns {boolean}
 */
export const isRouteActive = (statusNome) => {
  if (!statusNome) return false;
  const status = statusNome.toLowerCase();
  return status === 'ativa' || 
         status.includes('operação');
};

/**
 * Verifica se um ponto está ativo
 * @param {boolean|number} ativo - Valor do campo ativo
 * @returns {boolean}
 */
export const isStopActive = (ativo) => {
  return ativo === true || ativo === 1;
};

/**
 * Filtra veículos ativos de uma lista
 * @param {Array} vehicles - Lista de veículos
 * @returns {Array}
 */
export const getActiveVehicles = (vehicles) => {
  return vehicles.filter(vehicle => isVehicleActive(vehicle.status_nome));
};

/**
 * Filtra rotas ativas de uma lista
 * @param {Array} routes - Lista de rotas
 * @returns {Array}
 */
export const getActiveRoutes = (routes) => {
  return routes.filter(route => isRouteActive(route.status_nome));
};

/**
 * Filtra pontos ativos de uma lista
 * @param {Array} stops - Lista de pontos
 * @returns {Array}
 */
export const getActiveStops = (stops) => {
  return stops.filter(stop => isStopActive(stop.ativo));
};

/**
 * Calcula totais de entidades ativas a partir de estatísticas do backend
 * @param {Array} statusArray - Array de status com contadores
 * @param {Function} filterFn - Função de filtro (isVehicleActive ou isRouteActive)
 * @returns {number}
 */
export const getActiveCountFromStats = (statusArray, filterFn) => {
  if (!Array.isArray(statusArray)) return 0;
  
  return statusArray
    .filter(status => filterFn(status.status_nome))
    .reduce((sum, status) => sum + (status.total_veiculos || status.total_rotas || 0), 0);
};
