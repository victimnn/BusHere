// Shared formatters for the TCC project

/**
 * Formats CPF: 12345678901 -> 123.456.789-01
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return "N/A";
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * Formats phone number: 11987654321 -> (11) 98765-4321
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

/**
 * Removes formatting from strings
 */
export const removeFormatting = (value: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, '');
};

/**
 * Formats date to DD/MM/AAAA
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Formats currency to Brazilian Real
 */
export const formatCurrency = (value: number): string => {
  if (typeof value !== 'number') return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
