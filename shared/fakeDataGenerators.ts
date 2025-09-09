/**
 * Geradores de dados fake reutilizáveis
 */

// Funções auxiliares importadas
import { formatDateToBrazilian, formatDateToHTML5 } from './dateUtils';

/**
 * Gera uma data de nascimento entre 18 e 80 anos atrás
 * @returns {string} - Data no formato YYYY-MM-DD (para HTML5 date input)
 */
export function generateBirthDate(): string {
  const today = new Date();
  const minAge = 18;
  const maxAge = 80;
  const birthYear = today.getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1; // 28 para evitar problemas com fevereiro
  
  return `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
}

/**
 * Gera uma data de admissão entre 0 e 10 anos atrás
 * @returns {string} - Data no formato YYYY-MM-DD (para HTML5 date input)
 */
export function generateAdmissionDate(): string {
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - Math.floor(Math.random() * 11));
  return formatDateToHTML5(pastDate);
}

/**
 * Gera uma data de validade da CNH entre 1 e 5 anos no futuro
 * @returns {string} - Data no formato YYYY-MM-DD (para HTML5 date input)
 */
export function generateCNHValidityDate(): string {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + Math.floor(Math.random() * 5) + 1);
  return formatDateToHTML5(futureDate);
}

/**
 * Gera uma data de última manutenção entre 30 e 365 dias atrás
 * @returns {string} - Data no formato YYYY-MM-DD (para HTML5 date input)
 */
export function generateLastMaintenanceDate(): string {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * (365 - 30 + 1)) - 30);
  return formatDateToHTML5(pastDate);
}

/**
 * Gera uma data de próxima manutenção entre 30 e 180 dias no futuro
 * @returns {string} - Data no formato YYYY-MM-DD (para HTML5 date input)
 */
export function generateNextMaintenanceDate(): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * (180 - 30 + 1)) + 30);
  return formatDateToHTML5(futureDate);
}

/**
 * Gera quilometragem realista para veículos
 * @param {number} min - Quilometragem mínima (padrão: 10000)
 * @param {number} max - Quilometragem máxima (padrão: 500000)
 * @returns {string} - Quilometragem como string
 */
export function generateKilometers(min: number = 10000, max: number = 500000): string {
  const km = Math.random() * (max - min) + min;
  return km.toFixed(2);
}

/**
 * Gera uma placa brasileira válida (formato antigo ou Mercosul)
 * @returns {string} - Placa formatada
 */
export function generateBrazilianLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const isNewFormat = Math.random() < 0.5; // 50% chance para cada formato
  
  if (isNewFormat) {
    // Formato Mercosul: ABC1D23
    return `${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}${digits.charAt(Math.floor(Math.random() * 10))}${letters.charAt(Math.floor(Math.random() * 26))}${digits.charAt(Math.floor(Math.random() * 10))}${digits.charAt(Math.floor(Math.random() * 10))}`;
  } else {
    // Formato antigo: ABC-1234
    return `${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}-${digits.charAt(Math.floor(Math.random() * 10))}${digits.charAt(Math.floor(Math.random() * 10))}${digits.charAt(Math.floor(Math.random() * 10))}${digits.charAt(Math.floor(Math.random() * 10))}`;
  }
}

/**
 * Gera um CPF válido
 * @returns {string} - CPF formatado
 */
export function generateValidCPF(): string {
  function calculateDigit(cpfPart: string): number {
    let sum = 0;
    let multiplier = cpfPart.length + 1;
    for (let i = 0; i < cpfPart.length; i++) {
      sum += parseInt(cpfPart[i]) * multiplier;
      multiplier--;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }
  
  let cpfNumbers = [];
  for (let i = 0; i < 9; i++) {
    cpfNumbers.push(Math.floor(Math.random() * 10));
  }
  let cpfBase = cpfNumbers.join('');
  const firstDigit = calculateDigit(cpfBase);
  cpfBase += firstDigit;
  const secondDigit = calculateDigit(cpfBase);
  cpfBase += secondDigit; 
  return cpfBase.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Gera um número de CNH
 * @returns {string} - Número da CNH
 */
export function generateCNH(): string {
  return Math.floor(Math.random() * 90000000000) + 10000000000 + '';
}
