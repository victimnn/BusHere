
/**
 * Formata um número de telefone no padrão (XX) XXXXX-XXXX
 * @param {string} phone  - Número de telefone
 * @returns {string} - Número de telefone formatado
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Formata um CPF no padrão XXX.XXX.XXX-XX
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
}

/**
 * Remove formatação de um CPF ou telefone
 * @param {string} value - Valor a ser desformatado
 * @returns {string} - Valor sem formatação
 */
export function removeFormatting(value: string): string {
  if (!value) return value;
  return value.replace(/\D/g, '');
}

/**
 * Formata um CEP no padrão XXXXX-XXX
 * @param {string} value - CEP a ser formatado
 * @returns {string} - CEP formatado
 */
export function formatCEP(value: string): string {
  if (!value) return '';
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  // Aplica a formatação 00000-000
  if (numbers.length <= 5) {
    return numbers;
  } else {
    return numbers.slice(0, 5) + '-' + numbers.slice(5, 8);
  }
}

/**
 * Formata uma data no formato DD/MM/AAAA
 * @param {string} value - Data a ser formatada
 * @returns {string} - Data formatada ou string vazia se inválida
 */
export function formatDate(value: string): string {
  if (!value) return '';
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  // Aplica a formatação DD/MM/AAAA
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return numbers.slice(0, 2) + '/' + numbers.slice(2);
  } else {
    return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
  }
}

/**
 * Converte uma data do formato DD/MM/AAAA para AAAA-MM-DD (formato ISO para banco)
 * @param {string} dateValue - Data no formato DD/MM/AAAA
 * @return {string} - Data no formato AAAA-MM-DD ou string vazia se inválida
 */
export function formatDateForDatabase(dateValue: string): string {
  if (!dateValue) return '';
  
  // Verifica se está no formato DD/MM/AAAA
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateValue)) return dateValue;
  
  // Extrai dia, mês e ano
  const [day, month, year] = dateValue.split('/');
  
  // Retorna no formato AAAA-MM-DD
  return `${year}-${month}-${day}`;
}

/**
 * Converte uma data do formato AAAA-MM-DD (formato ISO do banco) para DD/MM/AAAA
 * Também lida com formatos ISO completos como "2030-06-19T03:00:00.000Z"
 * @param {string} dateValue - Data no formato AAAA-MM-DD ou ISO completo
 * @return {string} - Data no formato DD/MM/AAAA ou string vazia se inválida
 */
export function formatDateFromDatabase(dateValue: any): string {
  if (!dateValue) return '';
  
  // Se for um objeto Date, converte para string ISO
  if (dateValue instanceof Date) {
    dateValue = dateValue.toISOString();
  }
  
  // Se for formato ISO completo (ex: "2030-06-19T03:00:00.000Z"), extrai apenas a data
  if (dateValue.includes('T')) {
    dateValue = dateValue.split('T')[0];
  }
  
  // Verifica se está no formato AAAA-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateValue)) return dateValue;
  
  // Extrai ano, mês e dia
  const [year, month, day] = dateValue.split('-');
  
  // Retorna no formato DD/MM/AAAA
  return `${day}/${month}/${year}`;
}
