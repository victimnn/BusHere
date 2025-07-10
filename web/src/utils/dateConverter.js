/**
 * Utilitário simples para converter datas entre formatos
 */

/**
 * Converte data do formato DD/MM/AAAA para AAAA-MM-DD
 * @param {string} dateStr - Data no formato DD/MM/AAAA
 * @return {string} - Data no formato AAAA-MM-DD
 */
export function convertDateToDatabase(dateStr) {
  if (!dateStr) return '';
  
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateStr)) return dateStr;
  
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Converte data do formato AAAA-MM-DD para DD/MM/AAAA
 * @param {string} dateStr - Data no formato AAAA-MM-DD
 * @return {string} - Data no formato DD/MM/AAAA
 */
export function convertDateFromDatabase(dateStr) {
  if (!dateStr) return '';
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return dateStr;
  
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Processa dados do formulário convertendo datas para formato do banco
 * @param {Object} formData - Dados do formulário
 * @return {Object} - Dados processados
 */
export function processFormDataForDB(formData) {
  const processedData = { ...formData };
  
  // Converte campos de data específicos
  if (processedData.cnh_validade) {
    processedData.cnh_validade = convertDateToDatabase(processedData.cnh_validade);
  }
  
  if (processedData.data_admissao) {
    processedData.data_admissao = convertDateToDatabase(processedData.data_admissao);
  }
  
  return processedData;
}

/**
 * Processa dados vindos do banco convertendo datas para formato de exibição
 * @param {Object} dbData - Dados do banco
 * @return {Object} - Dados processados para exibição
 */
export function processDataFromDB(dbData) {
  const processedData = { ...dbData };
  
  // Converte campos de data específicos
  if (processedData.cnh_validade) {
    processedData.cnh_validade = convertDateFromDatabase(processedData.cnh_validade);
  }
  
  if (processedData.data_admissao) {
    processedData.data_admissao = convertDateFromDatabase(processedData.data_admissao);
  }
  
  return processedData;
}
