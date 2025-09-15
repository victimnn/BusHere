/**
 * Utilitários para manipulação e formatação de datas
 */

/**
 * Converte uma data para formato HTML5 date input (YYYY-MM-DD)
 * @param {Date} date - Data a ser convertida
 * @returns {string} - Data no formato YYYY-MM-DD
 */
export function formatDateToHTML5(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converte uma data para formato brasileiro (DD/MM/AAAA)
 * @param {Date} date - Data a ser convertida
 * @returns {string} - Data no formato DD/MM/AAAA
 */
export function formatDateToBrazilian(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Função reverseTransform padrão para campos HTML5 date
 * Converte vários formatos de data para YYYY-MM-DD
 * @param {any} value - Valor a ser convertido
 * @returns {string} - Data no formato YYYY-MM-DD
 */
export function reverseTransformDate(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') {
    // Se já está no formato correto (yyyy-MM-dd), retorna como está
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value;
    }
    // Se tem timestamp, remove a parte do tempo
    if (value.includes('T')) {
      return value.split('T')[0];
    }
    // Se está no formato dd/MM/yyyy, converte para yyyy-MM-dd
    if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = value.split('/');
      return `${year}-${month}-${day}`;
    }
  }
  return value;
}

/**
 * Validador para data de nascimento
 * @param {string} value - Data a ser validada
 * @returns {string|null} - Mensagem de erro ou null se válida
 */
export function validateBirthDate(value: string): string | null {
  if (!value) return null; // Campo opcional
  const data = new Date(value);
  const hoje = new Date();
  const cemAnosAtras = new Date();
  cemAnosAtras.setFullYear(hoje.getFullYear() - 100);
  
  if (data > hoje) return 'Data de nascimento não pode ser futura';
  if (data < cemAnosAtras) return 'Data muito antiga (máximo 100 anos atrás)';
  return null;
}

/**
 * Validador para data de admissão
 * @param {string} value - Data a ser validada
 * @returns {string|null} - Mensagem de erro ou null se válida
 */
export function validateAdmissionDate(value: string): string | null {
  if (!value) return null; // Campo opcional
  const data = new Date(value);
  const hoje = new Date();
  const cinquentaAnosAtras = new Date();
  cinquentaAnosAtras.setFullYear(hoje.getFullYear() - 50);
  
  if (data > hoje) return 'Data de admissão não pode ser futura';
  if (data < cinquentaAnosAtras) return 'Data muito antiga (máximo 50 anos atrás)';
  return null;
}

/**
 * Validador para validade da CNH
 * @param {string} value - Data a ser validada
 * @returns {string|null} - Mensagem de erro ou null se válida
 */
export function validateCNHValidity(value: string): string | null {
  if (!value) return 'Validade da CNH é obrigatória';
  const data = new Date(value);
  const hoje = new Date();
  const dezAnosNoFuturo = new Date();
  dezAnosNoFuturo.setFullYear(hoje.getFullYear() + 10);
  
  if (data <= hoje) return 'CNH não pode estar vencida';
  if (data > dezAnosNoFuturo) return 'Data muito distante (máximo 10 anos no futuro)';
  return null;
}

/**
 * Validador para data de última manutenção
 * @param {string} value - Data a ser validada
 * @param {any} formData - Dados do formulário para validação cruzada
 * @returns {string|null} - Mensagem de erro ou null se válida
 */
export function validateLastMaintenanceDate(value: string, formData?: any): string | null {
  if (value === '') return null;
  const data = new Date(value);
  const hoje = new Date();
  const doisAnosAtras = new Date();
  doisAnosAtras.setFullYear(hoje.getFullYear() - 2);
  
  if (data > hoje) return 'Data não pode ser futura';
  if (data < doisAnosAtras) return 'Data muito antiga (máximo 2 anos atrás)';
  
  // Validar relação com próxima manutenção se ambas estiverem preenchidas
  if (formData && formData.data_proxima_manutencao) {
    const proximaManutencao = new Date(formData.data_proxima_manutencao);
    const diferencaDias = Math.ceil((proximaManutencao.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferencaDias < 7) return 'Última manutenção deve ser pelo menos 7 dias antes da próxima';
    if (diferencaDias > 365) return 'Intervalo muito longo entre manutenções (máximo 1 ano)';
  }
  
  return null;
}

/**
 * Validador para data de próxima manutenção
 * @param {string} value - Data a ser validada
 * @param {any} formData - Dados do formulário para validação cruzada
 * @returns {string|null} - Mensagem de erro ou null se válida
 */
export function validateNextMaintenanceDate(value: string, formData?: any): string | null {
  if (value === '') return null;
  const data = new Date(value);
  const hoje = new Date();
  const umAnoNoFuturo = new Date();
  umAnoNoFuturo.setFullYear(hoje.getFullYear() + 1);
  
  if (data < hoje) return 'Data não pode ser passada';
  if (data > umAnoNoFuturo) return 'Data muito distante (máximo 1 ano no futuro)';
  
  // Validar relação com última manutenção se ambas estiverem preenchidas
  if (formData && formData.data_ultima_manutencao) {
    const ultimaManutencao = new Date(formData.data_ultima_manutencao);
    const diferencaDias = Math.ceil((data.getTime() - ultimaManutencao.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferencaDias < 7) return 'Próxima manutenção deve ser pelo menos 7 dias após a última';
    if (diferencaDias > 365) return 'Intervalo muito longo entre manutenções (máximo 1 ano)';
  }
  
  return null;
}
