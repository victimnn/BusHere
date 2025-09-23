import { findStateByLabel } from "@shared/brazilianStates";

function getBearerToken() {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
}


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/enterprise';

// Sistema de logging otimizado
const isDevelopment = import.meta.env.DEV;
const requestCache = new Set<string>();
const MAX_CACHE_SIZE = 100;

const shouldLogRequest = (url: string, method: string): boolean => {
  if (!isDevelopment) return false;
  
  // Não loga requisições repetitivas muito frequentes
  const requestKey = `${method}:${url}`;
  if (requestCache.has(requestKey)) return false;
  
  // Adiciona ao cache e limpa se necessário
  requestCache.add(requestKey);
  if (requestCache.size > MAX_CACHE_SIZE) {
    requestCache.clear();
  }
  
  return true;
};

const api = {
  _request: async (method: string, url: string, data: any = null, options: RequestInit = {}) => {
    const token = getBearerToken(); // Obtém o token a cada requisição
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}) // Mantém quaisquer headers passados explicitamente
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      ...options, // Permite sobrescrever outras opções (mode, cache, etc.)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      // Log otimizado - só em desenvolvimento e evita repetições
      if (shouldLogRequest(url, method)) {
        console.log(`🌐 API ${method} ${url}`, {
          status: response.status,
          ok: response.ok,
          data: data ? 'Dados enviados' : 'Sem dados'
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorData.error || errorData.message || 'Ocorreu um erro na requisição') as Error & { status: number; data: any };
        error.status = response.status;
        error.data = errorData;
        
        // Log de erro otimizado
        if (response.status === 401) {
          console.warn('🔒 Unauthorized: Token inválido ou expirado');
        } else if (isDevelopment) {
          console.error(`❌ API Error ${response.status}: ${url}`, errorData);
        }
        throw error;
      }

      // Tenta retornar JSON, mas se não for um JSON válido, retorna o texto ou null
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text(); 
      }

    } catch (error) {
      // Log de erro otimizado - só em desenvolvimento
      if (isDevelopment) {
        console.error("❌ Erro na requisição:", url, error);
      }
      throw error; // da erro denovo para poder ser tratado fora daqui
    }
  },
  
  get: (url, options?) => api._request('GET', url, null, options),
  post: (url, data?, options?) => api._request('POST', url, data, options),
  put: (url, data, options?) => api._request('PUT', url, data, options),
  patch: (url, data, options?) => api._request('PATCH', url, data, options),
  delete: (url, options?) => api._request('DELETE', url, null, options),

  // Funções específicas para passageiros
  passengers: {
    // Listar todos os passageiros (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search) queryParams.append('search', search);
      
      return api.get(`/passengers?${queryParams.toString()}`);
    },
    
    // Obter detalhes de um passageiro específico pelo ID
    getById: (id) => {
      return api.get(`/passengers/${id}`);
    },
    
    // Criar novo passageiro
    create: (passengerData) => {
      return api.post('/passengers', passengerData);
    },
    
    // Atualizar dados de um passageiro existente
    update: (id, edits) => {
      return api.put(`/passengers/${id}`, edits);
    },
    
    // Excluir passageiro
    delete: (id) => {
      return api.delete(`/passengers/${id}`);
    },

    // Buscar tipos de passageiro
    getTypes: () => {
      return api.get('/passengers/tipos');
    },

    // Buscar rotas disponíveis
    getRoutes: () => {
      return api.get('/passengers/rotas');
    },

    // Buscar pontos disponíveis
    getStops: () => {
      return api.get('/passengers/pontos');
    },

    // Buscar dados de endereço por CEP
    getAddressByCep: async (cep) => {
      try {
        const cleanCep = cep.replace(/\D/g, ''); // Remove formatação
        if (cleanCep.length !== 8) {
          throw new Error('CEP deve ter 8 dígitos');
        }

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP');
        }

        const data = await response.json();
        
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }

        return {
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
          cep: data.cep || cleanCep
        };
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
      }
    }
  },

  // Funções específicas para motoristas
  drivers: {
    // Listar todos os motoristas (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search) queryParams.append('search', search);
      
      return api.get(`/drivers?${queryParams.toString()}`);
    },
    
    // Obter detalhes de um motorista específico pelo ID
    getById: (id) => {
      return api.get(`/drivers/${id}`);
    },
    
    // Criar novo motorista
    create: (driverData) => {
      return api.post('/drivers', driverData);
    },
    
    // Atualizar dados de um motorista existente
    update: (id, edits) => {
      return api.put(`/drivers/${id}`, edits);
    },
    
    // Excluir motorista
    delete: (id) => {
      return api.delete(`/drivers/${id}`);
    },

    // Buscar status de motorista
    getStatus: () => {
      return api.get('/drivers/status');
    }
  },

  routes: {
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        search: String(search) 
      });
      return api.get(`/routes?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/routes/${id}`),
    getByIdWithStops: (id) => api.get(`/routes/${id}?includeStops=true`),
    create: (routeData) => api.post('/routes', routeData),
    createWithStops: (routeData) => api.post('/routes/new', routeData),
    update: (id, edits) => api.put(`/routes/${id}`, edits),
    updateWithStops: (id, routeData) => api.put(`/routes/${id}/with-stops`, routeData),
    delete: (id) => api.delete(`/routes/${id}`),
    getStatus: () => api.get('/routes/status'),
    getStops: (id) => api.get(`/routes/stops/${id}`),
    
    // Endpoints para associações veículo-motorista-rota
    getAssignments: (routeId) => api.get(`/routes/${routeId}/assignments`),
    createAssignment: (routeId, assignmentData) => api.post(`/routes/${routeId}/assignments`, assignmentData),
    updateAssignment: (routeId, assignmentId, assignmentData) => api.put(`/routes/${routeId}/assignments/${assignmentId}`, assignmentData),
    deleteAssignment: (routeId, assignmentId) => api.delete(`/routes/${routeId}/assignments/${assignmentId}`)
  },

  vehicles: {
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        search: String(search) 
      });
      return api.get(`/vehicles?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/vehicles/${id}`),
    create: (vehicleData) => api.post('/vehicles', vehicleData),
    update: (id, edits) => api.put(`/vehicles/${id}`, edits),
    delete: (id) => api.delete(`/vehicles/${id}`),
    getStatus: () => api.get('/vehicles/status'),
    getTypes: () => api.get('/vehicles/types'),
  },

  stops: {
    // Listar todos os pontos
    list: () => {
      return api.get('/stops');
    },

    // Obter estatísticas dos pontos (passageiros e rotas)
    getStats: () => {
      return api.get('/stops/stats');
    },

    // Obter detalhes de um ponto específico pelo ID
    getById: (id) => {
      return api.get(`/stops/${id}`);
    },

    // Criar novo ponto
    create: (stopData) => {
      return api.post('/stops', stopData);
    },

    // Atualizar dados de um ponto existente
    update: (id, edits) => {
      return api.put(`/stops/${id}`, edits);
    },

    // Excluir ponto
    delete: (id) => {
      return api.delete(`/stops/${id}`);
    },

    // Buscar pontos por nome
    search: (name) => {
      const queryParams = new URLSearchParams({ name });
      return api.get(`/stops/search?${queryParams.toString()}`);
    },
  },

  // Funções específicas para relatórios
  reports: {
    // Obter estatísticas gerais
    getStats: () => {
      return api.get('/reports/stats');
    },
    
    // Obter dados para gráficos
    getCharts: () => {
      return api.get('/reports/charts');
    },
    
    // Obter dados de utilização
    getUtilization: () => {
      return api.get('/reports/utilization');
    }
  },

  // Funções de geolocalização com o nominatim
  geolocation: {
    // Cache pra armazenar resultados do CEP
    _cepCache: new Map(),
    // Cache pra armazenar resultados da geolocalização
    _geoCache: new Map(),

    // Função pra gerar chave de cache do CEP
    _getCepCacheKey: (uf, city, road) => {
      return `${uf.toUpperCase()}-${city.toLowerCase()}-${road.toLowerCase()}`;
    },

    // Função pra gerar chave de cache da geolocalização
    _getGeoCacheKey: (lat, lon) => {
      // Arredonda as coordenadas pra 6 casas pea melhorar cache
      return `${parseFloat(lat).toFixed(6)}-${parseFloat(lon).toFixed(6)}`;
    },

    getCepFromStreet: async (uf, city, road) => {
      try {
        // Verifica se já existe no cache
        const cacheKey = api.geolocation._getCepCacheKey(uf, city, road);
        if (api.geolocation._cepCache.has(cacheKey)) {
          return api.geolocation._cepCache.get(cacheKey);
        }

        // Se não estiver no cache faz a requisição
        const data = await fetch(
          `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(city)}/${encodeURIComponent(road)}/json/`,
          { 
            headers: { 'Accept': 'application/json' },
            cache: 'force-cache' // Usa cache do navegador se der 
          }
        );

        if (!data.ok) {
          throw new Error(`Erro ao obter CEP: ${data.statusText}`);
        }

        const json = await data.json();
        if (!Array.isArray(json) || json.length === 0) {
          const emptyCep = '';
          api.geolocation._cepCache.set(cacheKey, emptyCep);
          return emptyCep;
        }

        const cep = json[0].cep || '';
        // Armazena no cache
        api.geolocation._cepCache.set(cacheKey, cep);
        return cep;
      } catch (error) {
        console.error("Erro na requisição de CEP:", error);
        throw error;
      }
    },

    getInfoFromCoordinates: async (lat, lon) => {
      try {
        // Verifica se já existe no cache
        const cacheKey = api.geolocation._getGeoCacheKey(lat, lon);
        if (api.geolocation._geoCache.has(cacheKey)) {
          return api.geolocation._geoCache.get(cacheKey);
        }

        const queryParams = new URLSearchParams({
          format: String("json"),
          lat: String(parseFloat(lat).toFixed(6)),
          lon: String(parseFloat(lon).toFixed(6)),
          addressdetails: String(1),
          extratags: String(1),
          limit: String(1)
        });

        // Adiciona um tempo de 5 segundos para a requisição
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${queryParams.toString()}`,
          {
            headers: {
              'Accept-Language': 'pt-BR',
              'Accept': 'application/json'
            },
            signal: controller.signal,
            cache: 'force-cache' // Usa cache do navegador se for possível
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erro ao obter informações de geolocalização: ${response.statusText}`);
        }

        const data = await response.json();
        const state = findStateByLabel(data.address.state || data.address.region || '');
        if (!state) {
          throw new Error(`Estado não encontrado: ${data.address.state || data.address.region}`);
        }

        const result = {
          road: data.address.road || '',
          suburb: data.address.suburb || '',
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          uf: state.value,
          cep: '',
          coordinates: {
            latitude: parseFloat(lat).toFixed(6),
            longitude: parseFloat(lon).toFixed(6)
          },
          data: data,
        };

        // Busca o CEP apenas se tivermos todas as informações precisas
        if (result.uf && result.city && result.road) {
          try {
            result.cep = await api.geolocation.getCepFromStreet(result.uf, result.city, result.road);
          } catch (error) {
            console.warn("Erro ao buscar CEP:", error);
            result.cep = '';
          }
        }

        // Armazena no cache
        api.geolocation._geoCache.set(cacheKey, result);
        return result;

      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Tempo limite excedido ao buscar informações de geolocalização');
        }
        console.error("Erro na requisição de geolocalização:", error);
        throw error;
      }
    },

    // Método para limpar o cache se necessário
    clearCache: () => {
      api.geolocation._cepCache.clear();
      api.geolocation._geoCache.clear();
    }
  },

  auth: {
    me: async () => {
      const token = getBearerToken();
      if (!token) {
        throw new Error('Usuário não autenticado. Token ausente.');
      }

      try {
        const response = await api.get('/auth/me', {headers: { 'Authorization': token }});
        return response; // Retorna os dados do usuário autenticado
      } catch (error) {
        console.error("Erro ao obter informações do usuário:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    login: async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Armazena o token no localStorage
          return response; // Retorna os dados do usuário logado
        } else {
          throw new Error('Login falhou: resposta inválida do servidor');
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    logout: async (): Promise<void> => {
      try {
        await api.post('/auth/logout'); // Chama a API para logout
        localStorage.removeItem('token'); // Remove o token do localStorage
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      try {
        const response = await api.post('/auth/change-password', 
          {
            old_password: currentPassword,
            new_password: newPassword
          })
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    register: async (userData) => {
      const requiredFields = ['nome', 'email', 'password'];

      // Verifica se todos os campos obrigatórios estão presentes
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }

      try {
        const response = await api.post('/auth/register', userData);
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    }
  },
  recentActivity: {
    // Método para obter a atividade recente
    get: async (limit = 100) => {
      const queryParams = new URLSearchParams({
        limit: String(limit)
      });
      try {
        const response = await api.get(`/lastChanges?${queryParams.toString()}`);
        return response; // Retorna os dados da atividade recente
      } catch (error) {
        console.error("Erro ao obter atividade recente:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    }
  },

  enterpriseUsers: {
    // Método para listar usuários de uma empresa
    get: async (enterpriseUserId: number) => {
      if (!enterpriseUserId) {
        throw new Error('ID do usuario-empresa é obrigatório para listar usuários');
      }
      try {
        const response = await api.get(`/enterpriseUsers/${enterpriseUserId}`);
        return response; // Retorna os dados dos usuários da empresa
      } catch (error) {
        console.error("Erro ao obter usuários da empresa:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
  },

  notifications: {

    // Lista todos os avisos
    list: async () => {
      try {
        const response = await api.get('/avisos');
        return response;
      } catch (error) {
        console.error("Erro ao listar avisos:", error);
        throw error;
      }
    },

    create: async (notificationData) => {
      try {
        const response = await api.post('/avisos', notificationData);
        return response;
      } catch (error) {
        console.error("Erro ao criar aviso:", error);
        throw error;
      }
    },

    getScopes: async () => {
      try {
        const response = await api.get('/avisos/scopes');
        return response;
      } catch (error) {
        console.error("Erro ao buscar escopos de aviso:", error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const response = await api.get(`/avisos/${id}`);
        return response;
      } catch (error) {
        console.error("Erro ao buscar aviso por ID:", error);
        throw error;
      }
    }
  }
};

export default api;