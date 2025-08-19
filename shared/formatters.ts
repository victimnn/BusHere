
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
 * Remove formatação de uma placa de veículo (remove apenas hífen e espaços)
 * @param {string} value - Placa a ser desformatada
 * @returns {string} - Placa sem formatação (mantém letras e números)
 */
export function removePlateFormatting(value: string): string {
  if (!value) return value;
  return value.replace(/[-\s]/g, '').toUpperCase();
}

/**
 * Formata uma placa de veículo brasileira
 * Suporta formato antigo (ABC-1234) e Mercosul (ABC1D23)
 * @param {string} value - Placa a ser formatada
 * @returns {string} - Placa formatada com hífen quando aplicável
 */
export function formatPlate(value: string): string {
  if (!value) return '';
  
  // Remove formatação existente e converte para maiúsculo
  const cleanPlate = value.replace(/[-\s]/g, '').toUpperCase();
  
  // Verifica se tem o comprimento adequado (7 caracteres)
  if (cleanPlate.length !== 7) {
    return cleanPlate; // Retorna como está se não tiver 7 caracteres
  }
  
  // Verifica se é formato antigo (ABC1234 -> ABC-1234)
  const oldFormatRegex = /^[A-Z]{3}\d{4}$/;
  if (oldFormatRegex.test(cleanPlate)) {
    return cleanPlate.slice(0, 3) + '-' + cleanPlate.slice(3);
  }
  
  // Verifica se é formato Mercosul (ABC1D23)
  const mercosulFormatRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  if (mercosulFormatRegex.test(cleanPlate)) {
    // Formato Mercosul não usa hífen, retorna como está
    return cleanPlate;
  }
  
  // Se não se encaixa em nenhum formato, retorna como está
  return cleanPlate;
}

/**
 * Formata quilometragem no padrão brasileiro com "km"
 * @param {number} value - Valor da quilometragem
 * @returns {string} - Quilometragem formatada ou "N/A"
 */
export function formatKilometers(value: number): string {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(value) + ' km';
}

/**
 * Formata o tempo
 * @param {number} value - Valor da capacidade
 * @returns {string} - Capacidade formatada ou "N/A"
 */
export function formatTime(value: number): string {
  if (!value && value !== 0) return 'N/A';
  return `${value} minutos`;
}

/**
 * Formata capacidade de passageiros
 * @param {number} value - Valor da capacidade
 * @returns {string} - Capacidade formatada ou "N/A"
 */
export function formatCapacity(value: number): string {
  if (!value && value !== 0) return 'N/A';
  return `${value} passageiros`;
}

/**
 * Retorna informações de formatação para status (classe CSS e texto)
 * 
 * Exemplo de uso em React:
 * ```jsx
 * const { className, text } = getStatusFormat(status);
 * return <span className={className}>{text}</span>;
 * ```
 * 
 * @param {string} value - Valor do status
 * @returns {object} - Objeto com classe CSS e valor para renderização
 */
export function getStatusFormat(value: string): { className: string; text: string } {
  if (!value) return { className: 'bg-secondary', text: 'N/A' };
  
  let className = 'bg-secondary';
  const status = value.toLowerCase();
  
  if (status.includes('inativo') || status.includes('inativa') || status.includes('desativado') || status.includes('afastado')) {
    className = 'bg-danger';
  } else if (status.includes('operação') || status.includes('ativo') || status.includes('ativa') || status.includes('estudante')) {
    className = 'bg-success';
  } else if (status.includes('manutenção') || status.includes('férias') || status.includes('planejamento')) {
    className = 'bg-warning text-black';
  } else if (status.includes('corporativo')) {
    className = 'bg-info';
  }

  return { className: `badge ${className}`, text: value };
}

/**
 * Retorna informações de formatação para tipo (classe CSS e texto)
 * 
 * Exemplo de uso em React:
 * ```jsx
 * const { className, text } = getTypeFormat(tipo);
 * return <span className={className}>{text}</span>;
 * ```
 * 
 * @param {string} value - Valor do tipo
 * @returns {object} - Objeto com classe CSS e valor para renderização
 */
export function getTypeFormat(value: string): { className: string; text: string } {
  if (!value) return { className: 'bg-secondary', text: 'N/A' };
  
  let className = 'bg-secondary';
  const tipo = value.toLowerCase();

  if (tipo.includes('estudante') ) {
    className = 'bg-success';
  } else if (tipo.includes('corporativo')) {
    className = 'bg-info';
  }

  return { className: `badge ${className}`, text: value };
}

export function getOperationBadge(operation: string): string {
  const badges = {
    'INSERT': 'badge bg-success',
    'UPDATE': 'badge bg-warning text-black',
    'DELETE': 'badge bg-danger'
  };
  return badges[operation] || 'badge bg-secondary';
};

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

/**
 * Formata um timestamp para exibição em formato brasileiro (DD/MM/AAAA HH:MM)
 * @param {string|Date} timestamp - Timestamp a ser formatado
 * @returns {string} - Data/hora formatada no padrão brasileiro ou '-' se inválida
 */
export function formatTimestamp(timestamp: string | Date): string {
  if (!timestamp) return '-';
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return typeof timestamp === 'string' ? timestamp : '-';
  }
}
