export function formatPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatCPF(cpf) {
  if (!cpf) return '';
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function removeFormatting(value) {
  if (!value) return value;
  return value.replace(/\D/g, '');
}

export function formatCEP(value) {
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

export function formatDate(value) {
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
export function formatDateForDatabase(dateValue) {
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
 * @param {string} dateValue - Data no formato AAAA-MM-DD
 * @return {string} - Data no formato DD/MM/AAAA ou string vazia se inválida
 */
export function formatDateFromDatabase(dateValue) {
  if (!dateValue) return '';
  
  // Verifica se está no formato AAAA-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateValue)) return dateValue;
  
  // Extrai ano, mês e dia
  const [year, month, day] = dateValue.split('-');
  
  // Retorna no formato DD/MM/AAAA
  return `${day}/${month}/${year}`;
}
