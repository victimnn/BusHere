/**
 * 
 * Valida um endereço de e-mail
 * @param {string} email - O endereço de e-mail a ser validado (formato: (XX) XXXXX-XXXX)
 * @return {boolean} - Retorna true se o e-mail for válido, caso contrário, false
 */
export function validateEmail(email) {
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
export function validatePhoneNumber(phone) {
    const re = /^\(\d{2}\) \d{5}-\d{4}$/;
    return re.test(String(phone));
} 

/**
 *
 * Valida um CPF no formato XXX.XXX.XXX-XX
 * @param {string} cpf - O CPF a ser validado (formato: XXX.XXX.XXX-XX)
 * @return {boolean} - Retorna true se o CPF for válido, caso contrário, false
 */
export function validateCPF(cpf) {
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
export function validadeRawCPF(cpf) {
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
