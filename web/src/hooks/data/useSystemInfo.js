import { useState, useEffect, useCallback } from 'react';
import { getServerBaseUrl, logger, getApiUrl } from '@web/utils/config';

/**
 * Hook para obter informações do sistema em tempo real
 */
export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({
    version: '',
    lastUpdate: '',
    environment: '',
    status: 'Carregando...',
    stats: {
      activeTime: '',
      lastLogin: '',
      settingsSaved: '',
      memory: '',
      cache: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para obter informações de performance do navegador
  const getBrowserPerformance = useCallback(() => {
    try {
      if ('performance' in window) {
        const memory = performance.memory;
        const navigation = performance.navigation;
        
        return {
          memory: memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB` : 'N/A',
          cache: memory ? `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB` : 'N/A',
          navigationType: navigation ? (navigation.type === 0 ? 'Navegação' : 'Recarregamento') : 'N/A',
          loadTime: performance.timing ? `${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms` : 'N/A'
        };
      }
    } catch (error) {
      console.warn('Erro ao obter informações de performance:', error);
    }
    
    return {
      memory: 'N/A',
      cache: 'N/A',
      navigationType: 'N/A',
      loadTime: 'N/A'
    };
  }, []);

  // Função para obter informações do ambiente
  const getEnvironmentInfo = useCallback(() => {
    try {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port;
      
      let environment = 'Desenvolvimento';
      if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('localhost')) {
        environment = 'Produção';
      }
      
      return {
        environment,
        hostname,
        protocol,
        port: port || (protocol === 'https:' ? '443' : '80')
      };
    } catch (error) {
      console.warn('Erro ao obter informações do ambiente:', error);
      return {
        environment: 'Desenvolvimento',
        hostname: 'N/A',
        protocol: 'N/A',
        port: 'N/A'
      };
    }
  }, []);

  // Função para obter informações de tempo ativo
  const getActiveTime = useCallback(() => {
    try {
      const startTime = sessionStorage.getItem('sessionStartTime');
      if (!startTime) {
        const now = new Date().toISOString();
        sessionStorage.setItem('sessionStartTime', now);
        return '0m';
      }
      
      const start = new Date(startTime);
      const now = new Date();
      const diffMs = now - start;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMins % 60}m`;
      }
      return `${diffMins}m`;
    } catch (error) {
      console.warn('Erro ao calcular tempo ativo:', error);
      return 'N/A';
    }
  }, []);

  // Função para obter informações de cache do localStorage
  const getCacheInfo = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      const cacheSize = keys.reduce((size, key) => {
        return size + (localStorage.getItem(key) || '').length;
      }, 0);
      
      return `${Math.round(cacheSize / 1024)} KB`;
    } catch (error) {
      console.warn('Erro ao obter informações de cache:', error);
      return 'N/A';
    }
  }, []);

  // Função para obter informações do sistema
  const fetchSystemInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obter informações básicas
      const envInfo = getEnvironmentInfo();
      const perfInfo = getBrowserPerformance();
      const activeTime = getActiveTime();
      const cacheInfo = getCacheInfo();

      // Tentar obter informações do servidor (health check)
      let serverInfo = {
        status: 'Offline',
        dbStatus: 'Desconectado',
        uptime: 'N/A',
        ram: 'N/A'
      };

      try {
        // Usar configuração centralizada para URL do servidor
        const apiUrl = getApiUrl();
        
        logger.info('🔍 Fazendo health check para:', apiUrl);
        
        // Criar AbortController para timeout (compatibilidade com navegadores antigos)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Usar o endpoint simplificado que retorna valores booleanos
        const response = await fetch(`${apiUrl}/debug/health-simple`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const healthData = await response.json();
          
          // Log para debug
          logger.info('Health check response (simple):', healthData);
          
          // Verificar se o banco está conectado (agora é um booleano)
          const isDbConnected = healthData.dbConnected === true;
          
          logger.info('Database connection status:', {
            dbConnected: healthData.dbConnected,
            isConnected: isDbConnected,
            ping: healthData.dbPing
          });
          
          serverInfo = {
            status: isDbConnected ? 'Online' : 'Offline',
            dbStatus: isDbConnected ? 'Conectado ao banco de dados' : 'Desconectado do banco de dados',
            uptime: healthData.serverUptime ? `${healthData.serverUptime} segundos` : 'N/A',
            ram: healthData.memoryUsage ? `${healthData.memoryUsage} MB` : 'N/A'
          };
        }
      } catch (serverError) {
        logger.warn('Não foi possível conectar ao servidor:', serverError);
        // Se for timeout, manter status como offline
        if (serverError.name === 'AbortError') {
          serverInfo.status = 'Timeout';
        }
      }

      // Obter versão do sistema
      let version = '1.0.0';
      try {
        // Tentar obter versão de diferentes fontes
        if (import.meta.env.VITE_APP_VERSION) {
          version = import.meta.env.VITE_APP_VERSION;
        } else if (window.__APP_VERSION__) {
          version = window.__APP_VERSION__;
        } else {
          // Fallback para versão hardcoded baseada no package.json da raiz
          version = '1.0.0';
        }
      } catch (versionError) {
        console.warn('Erro ao obter versão:', versionError);
        version = '1.0.0';
      }

      // Calcular última atualização (simulado - em produção seria baseado em build time)
      const lastUpdate = new Date().toLocaleDateString('pt-BR');

      setSystemInfo({
        version,
        lastUpdate,
        environment: envInfo.environment,
        status: serverInfo.status,
        stats: {
          activeTime,
          lastLogin: new Date().toLocaleString('pt-BR'),
          settingsSaved: 'Sim',
          memory: perfInfo.memory,
          cache: cacheInfo,
          dbStatus: serverInfo.dbStatus,
          uptime: serverInfo.uptime,
          serverRam: serverInfo.ram
        }
      });

    } catch (err) {
      console.error('Erro ao carregar informações do sistema:', err);
      setError('Erro ao carregar informações do sistema');
    } finally {
      setIsLoading(false);
    }
  }, [getEnvironmentInfo, getBrowserPerformance, getActiveTime, getCacheInfo]);

  // Atualizar informações periodicamente
  useEffect(() => {
    fetchSystemInfo();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchSystemInfo();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSystemInfo]);

  // Atualizar tempo ativo a cada minuto
  useEffect(() => {
    const activeTimeInterval = setInterval(() => {
      setSystemInfo(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          activeTime: getActiveTime()
        }
      }));
    }, 60000);

    return () => clearInterval(activeTimeInterval);
  }, [getActiveTime]);

  return {
    systemInfo,
    isLoading,
    error,
    refetch: fetchSystemInfo
  };
};
