// utils/apiTest.js - Utilitário para testar conectividade com a API

import { getApiBaseUrl, logger } from './config';

/**
 * Testa se o servidor está rodando e responde
 */
export const testServerConnection = async () => {
  try {
    const serverUrl = getApiBaseUrl();
    logger.debug('Testando conexão com:', serverUrl);
    
    const response = await fetch(`${serverUrl}/ping`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: 'Servidor conectado com sucesso!',
        data 
      };
    } else {
      return { 
        success: false, 
        message: `Servidor respondeu com status ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Erro de conexão: ${error.message}` 
    };
  }
};

/**
 * Testa se os endpoints de relatório estão funcionando
 */
export const testReportEndpoints = async () => {
  try {
    const serverUrl = getApiBaseUrl();
    logger.debug('Testando endpoints de relatório em:', serverUrl);
    
    // Testar endpoint de estatísticas básicas
    const response = await fetch(`${serverUrl}/api/reports/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return { 
        success: true, 
        message: 'Endpoints de relatório funcionando!' 
      };
    } else {
      return { 
        success: false, 
        message: `Endpoint de relatório falhou: ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Erro ao testar endpoints: ${error.message}` 
    };
  }
};

/**
 * Função de debug para diagnóstico completo
 */
export const runDiagnostics = async () => {
  logger.info('🔍 Iniciando diagnósticos...');
  
  const serverTest = await testServerConnection();
  logger.info('🌐 Teste de servidor:', serverTest);
  
  const endpointTest = await testReportEndpoints();
  logger.info('📊 Teste de endpoints:', endpointTest);
  
  return {
    server: serverTest,
    endpoints: endpointTest,
    overall: serverTest.success && endpointTest.success
  };
};
