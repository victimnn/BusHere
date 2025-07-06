// utils/config.js - Configurações do ambiente

/**
 * Obtém a URL base da API de forma segura
 */
export const getApiBaseUrl = () => {
  // Em desenvolvimento local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Em produção ou outras configurações
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback baseado na origem atual
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Se estiver em uma porta específica para desenvolvimento (Vite usa 5173, 5174, 5175...)
  if (hostname === 'localhost' && (window.location.port.startsWith('51') || window.location.port === '3001')) {
    return 'http://localhost:3000';
  }
  
  // Para produção, assume que a API está na mesma origem
  return `${protocol}//${hostname}`;
};

/**
 * Configurações gerais da aplicação
 */
export const config = {
  api: {
    baseUrl: getApiBaseUrl(),
    timeout: 30000, // 30 segundos
    endpoints: {
      ping: '/ping',
      reports: {
        stats: '/api/reports/stats',
        charts: '/api/reports/charts',
        utilization: '/api/reports/utilization',
      }
    }
  },
  debug: {
    enabled: window.location.hostname === 'localhost',
    logLevel: 'info' // 'debug', 'info', 'warn', 'error'
  }
};

/**
 * Logger condicional baseado no ambiente
 */
export const logger = {
  debug: (...args) => config.debug.enabled && console.log('🔍 [DEBUG]', ...args),
  info: (...args) => config.debug.enabled && console.info('ℹ️ [INFO]', ...args),
  warn: (...args) => console.warn('⚠️ [WARN]', ...args),
  error: (...args) => console.error('❌ [ERROR]', ...args)
};

export default config;
