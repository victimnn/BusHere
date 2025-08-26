import { getServerBaseUrl, logger } from './config';

/**
 * Utilitário para testar o health check do servidor
 * Use no console do navegador para debug
 */

export const testHealthCheck = async () => {
  // Usar configuração centralizada
  const serverBaseUrl = getServerBaseUrl();
  
  logger.info('🔍 Testando health check...');
  logger.info('URL do servidor:', serverBaseUrl);
  
  try {
    // Testar endpoint original
    logger.info('\n📡 Testando /debug/health...');
    const response1 = await fetch(`${serverBaseUrl}/debug/health`);
    const data1 = await response1.json();
    logger.info('✅ /debug/health response:', data1);
    
    // Testar endpoint simplificado
    logger.info('\n📡 Testando /debug/health-simple...');
    const response2 = await fetch(`${serverBaseUrl}/debug/health-simple`);
    const data2 = await response2.json();
    logger.info('✅ /debug/health-simple response:', data2);
    
    // Análise dos dados
    logger.info('\n📊 Análise:');
    logger.info('Status do banco (original):', data1.db);
    logger.info('Status do banco (simplificado):', data2.dbConnected);
    logger.info('Ping do banco:', data2.dbPing, 'ms');
    
    // Verificar se há inconsistências
    const isOriginalConnected = data1.db && data1.db.includes('Conectado');
    const isSimpleConnected = data2.dbConnected === true;
    
    if (isOriginalConnected === isSimpleConnected) {
      logger.info('✅ Status consistente entre endpoints');
    } else {
      logger.warn('❌ INCONSISTÊNCIA detectada!');
      logger.warn('Original:', isOriginalConnected);
      logger.warn('Simplificado:', isSimpleConnected);
    }
    
    return { data1, data2, isConsistent: isOriginalConnected === isSimpleConnected };
    
  } catch (error) {
    logger.error('❌ Erro ao testar health check:', error);
    return { error: error.message };
  }
};

// Função para testar conectividade básica
export const testBasicConnectivity = async () => {
  // Usar configuração centralizada
  const serverBaseUrl = getServerBaseUrl();
  
  logger.info('🔍 Testando conectividade básica...');
  logger.info('URL do servidor:', serverBaseUrl);
  
  try {
    // Testar ping básico
    const start = Date.now();
    const response = await fetch(`${serverBaseUrl}/ping`);
    const ping = Date.now() - start;
    
    if (response.ok) {
      logger.info(`✅ Servidor respondendo em ${ping}ms`);
      return true;
    } else {
      logger.warn(`❌ Servidor retornou status ${response.status}`);
      return false;
    }
  } catch (error) {
    logger.error('❌ Erro de conectividade:', error.message);
    return false;
  }
};

// Função para testar todos os endpoints de debug
export const testAllDebugEndpoints = async () => {
  // Usar configuração centralizada
  const serverBaseUrl = getServerBaseUrl();
  
  logger.info('🔍 Testando todos os endpoints de debug...');
  logger.info('URL do servidor:', serverBaseUrl);
  
  const endpoints = [
    '/ping',
    '/debug/health',
    '/debug/health-simple',
    '/debug/db-stats'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await fetch(`${serverBaseUrl}${endpoint}`);
      const ping = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        results[endpoint] = { status: 'OK', ping, data };
        logger.info(`✅ ${endpoint}: ${ping}ms`);
      } else {
        results[endpoint] = { status: 'ERROR', statusCode: response.status, ping };
        logger.warn(`❌ ${endpoint}: ${response.status} (${ping}ms)`);
      }
    } catch (error) {
      results[endpoint] = { status: 'FAILED', error: error.message };
      logger.error(`💥 ${endpoint}: FALHOU - ${error.message}`);
    }
  }
  
  logger.info('\n📊 Resumo dos testes:', results);
  return results;
};

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  window.testHealthCheck = testHealthCheck;
  window.testBasicConnectivity = testBasicConnectivity;
  window.testAllDebugEndpoints = testAllDebugEndpoints;
  
  logger.info('🧪 Utilitários de teste carregados:');
  logger.info('- testHealthCheck() - Testa endpoints de health check');
  logger.info('- testBasicConnectivity() - Testa conectividade básica');
  logger.info('- testAllDebugEndpoints() - Testa todos os endpoints de debug');
}
