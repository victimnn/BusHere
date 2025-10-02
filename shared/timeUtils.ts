/**
 * Utilitários para formatação de tempo
 */

/**
 * Formata horário para o padrão HH:MM
 * @param {string} timeString - String de horário em qualquer formato
 * @returns {string} Horário formatado como HH:MM
 */
export const formatTime = (timeString) => {
    if (!timeString) return '05:45'; // Fallback padrão
    
    // Remove espaços e converte para string
    const time = timeString.toString().trim();
    
    // Se está no formato HH:MM:SS (com segundos), remove os segundos
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Se já está no formato HH:MM, retorna
    if (/^\d{1,2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Se está no formato "5h45" ou "5h30", converte
    if (/^\d{1,2}h\d{2}$/.test(time)) {
        const [hours, minutes] = time.split('h');
        return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Se está no formato "5:45" mas sem zero à esquerda
    if (/^\d{1,2}:\d{1,2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Se é apenas um número (assume horas)
    if (/^\d{1,2}$/.test(time)) {
        return `${time.padStart(2, '0')}:00`;
    }
    
    // Fallback para formato padrão
    return '05:45';
};

/**
 * Formata data para o padrão brasileiro DD/MM/YYYY
 * @param {string|Date} dateInput - Data em qualquer formato
 * @returns {string} Data formatada como DD/MM/YYYY
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return '';
    
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return '';
    }
};

/**
 * Formata data e hora para o padrão brasileiro DD/MM/YYYY HH:MM
 * @param {string|Date} dateTimeInput - Data e hora em qualquer formato
 * @returns {string} Data e hora formatada como DD/MM/YYYY HH:MM
 */
export const formatDateTime = (dateTimeInput) => {
    if (!dateTimeInput) return '';
    
    try {
        const date = new Date(dateTimeInput);
        if (isNaN(date.getTime())) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.warn('Erro ao formatar data e hora:', error);
        return '';
    }
};
