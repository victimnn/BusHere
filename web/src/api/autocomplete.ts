import api from './api.js';

/**
 * @param {*} query - O termo de pesquisa para o qual você deseja obter sugestões. 
 * @returns 
 */
function autoComplete(query: string): Promise<object[]> {
  console.log("usando typescript");
  return api.get(`/autocomplete?search=${encodeURIComponent(query)}`);
}

export default autoComplete;
