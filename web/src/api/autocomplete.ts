import api from './api.js';

/**
 * @param {string} query - O termo de pesquisa para o qual você deseja obter sugestões. 
 * @returns 
 */

function autoComplete(query: string): Promise<object[]> {
  return api.get(`/autocomplete?search=${encodeURIComponent(query)}`);
}

export default autoComplete;
