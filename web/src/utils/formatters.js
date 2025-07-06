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
