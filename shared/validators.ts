/**
 * 
 * Valida um endereço de e-mail
 * @param {string} email - O endereço de e-mail a ser validado (formato: (XX) XXXXX-XXXX)
 * @return {boolean} - Retorna true se o e-mail for válido, caso contrário, false
 */
export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * 
 * Valida um número de telefone no formato (XX) XXXXX-XXXX
 * @param {string} phone - O número de telefone a ser validado (formato: (XX) XXXXX-XXXX)
 * @return {boolean} - Retorna true se o número de telefone for válido, caso contrário, false
 * 
 */
export function validatePhoneNumber(phone: string): boolean {
    const re = /^\(\d{2}\) \d{5}-\d{4}$/;
    return re.test(String(phone));
} 

/**
 *
 * Valida um CPF no formato XXX.XXX.XXX-XX
 * @param {string} cpf - O CPF a ser validado (formato: XXX.XXX.XXX-XX)
 * @return {boolean} - Retorna true se o CPF for válido, caso contrário, false
 */
export function validateCPF(cpf: string): boolean {
    const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Verifica se o CPF está no formato XXX.XXX.XXX-XX
    if (!re.test(cpf)) return false;

    // Remove a formatação do CPF para validação
    const rawCpf = cpf.replace(/\D/g, '');

    // Chama a função de validação do CPF sem formatação
    return validadeRawCPF(rawCpf);
}

/**
 * Valida um CPF sem formatação (apenas números)
 * @param {string} cpf - O CPF a ser validado (formato: XXXXXXXXXXX)
 * @return {boolean} - Retorna true se o CPF for válido, caso contrário, false
 */
export function validadeRawCPF(cpf: string): boolean {
    const re = /^\d{11}$/; // Verifica se o CPF tem 11 dígitos
    if (!re.test(cpf)) return false;

    // Lógica de validação do CPF
    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    return remainder === parseInt(cpf.substring(10, 11));
}

/**
 * Valida um CEP no formato XXXXX-XXX
 * @param {string} cep - O CEP a ser validado (formato: XXXXX-XXX)
 * @return {boolean} - Retorna true se o CEP for válido, caso contrário, false
 */
export function validateCEP(cep: string): boolean {
    if (!cep || !cep.trim()) return false;
    
    // Remove caracteres que não são números ou hífen
    const cleanValue = cep.replace(/[^0-9-]/g, '');
    
    // Verifica se contém apenas números e hífen
    if (cleanValue !== cep) {
        return false;
    }
    
    // Verifica o formato correto
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) {
        return false;
    }
    
    // Verifica se tem exatamente 8 dígitos
    const numbersOnly = cep.replace(/\D/g, '');
    if (numbersOnly.length !== 8) {
        return false;
    }
    
    return true;
}

/**
 * Valida uma data no formato DD/MM/AAAA
 * @param {string} date - A data a ser validada (formato: DD/MM/AAAA)
 * @param {number} minYear - Ano mínimo permitido (padrão: 1990)
 * @param {number} maxYear - Ano máximo permitido (padrão: 2100)
 * @return {boolean} - Retorna true se a data for válida, caso contrário, false
 */
export function validateDate(date: string, minYear: number = 1990, maxYear: number = 2100): boolean {
    if (!date || !date.trim()) return false;
    
    // Verifica o formato DD/MM/AAAA
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) return false;
    
    // Extrai dia, mês e ano
    const [day, month, year] = date.split('/').map(num => parseInt(num, 10));
    
    // Verifica se o ano está dentro do range permitido
    if (year < minYear || year > maxYear) return false;
    
    // Verifica se o mês é válido (1-12)
    if (month < 1 || month > 12) return false;
    
    // Verifica se o dia é válido (1-31, dependendo do mês)
    if (day < 1 || day > 31) return false;
    
    // Verifica dias específicos por mês
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Verifica ano bissexto para fevereiro
    if (month === 2 && isLeapYear(year)) {
        daysInMonth[1] = 29;
    }
    
    // Verifica se o dia é válido para o mês específico
    if (day > daysInMonth[month - 1]) return false;
    
    // Cria um objeto Date para validação final
    const dateObj = new Date(year, month - 1, day);
    
    // Verifica se a data criada corresponde aos valores fornecidos
    // (isso pega casos como 30 de fevereiro que o JavaScript ajustaria automaticamente)
    return dateObj.getDate() === day && 
           dateObj.getMonth() === (month - 1) && 
           dateObj.getFullYear() === year;
}

/**
 * Verifica se um ano é bissexto
 * @param {number} year - O ano a ser verificado
 * @return {boolean} - Retorna true se o ano for bissexto, caso contrário, false
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
