import { findStateByLabel } from "../utils/brazilianStates";

function getBearerToken() {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = {
  _request: async (method, url, data = null, options = {}) => {
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
      console.log(`Fazendo ${method} ${url}`, data, config, response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorData.message || 'Ocorreu um erro na requisição');
        error.status = response.status;
        error.data = errorData;
        
        // Exemplo: se for 401 Unauthorized, você pode redirecionar para a página de login
        if (response.status === 401) {
          console.error('Unauthorized: Redirecionando para login...');
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
      console.error("Erro na requisição:", error);
      throw error; // da erro denovo para poder ser tratado fora daqui
    }
  },
  
  get: (url, options) => api._request('GET', url, null, options),
  post: (url, data, options) => api._request('POST', url, data, options),
  put: (url, data, options) => api._request('PUT', url, data, options),
  patch: (url, data, options) => api._request('PATCH', url, data, options),
  delete: (url, options) => api._request('DELETE', url, null, options),

  // Funções específicas para passageiros
  passengers: {
    // Listar todos os passageiros (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
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
    }
  },

  // Funções específicas para motoristas
  drivers: {
    // Listar todos os motoristas (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
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
      const queryParams = new URLSearchParams({ page, limit, search });
      return api.get(`/routes?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/routes/${id}`),
    create: (routeData) => api.post('/routes', routeData),
    update: (id, edits) => api.put(`/routes/${id}`, edits),
    delete: (id) => api.delete(`/routes/${id}`),
    getStatus: () => api.get('/routes/status'),
  },

  buses: {
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams({ page, limit, search });
      return api.get(`/buses?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/buses/${id}`),
    create: (busData) => api.post('/buses', busData),
    update: (id, edits) => api.put(`/buses/${id}`, edits),
    delete: (id) => api.delete(`/buses/${id}`),
    getStatus: () => api.get('/buses/status'),
  },

  stops: {
    // Listar todos os pontos
    list: () => {
      return api.get('/stops');
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
          format: "json",
          lat: parseFloat(lat).toFixed(6),
          lon: parseFloat(lon).toFixed(6),
          addressdetails: 1,
          extratags: 1,
          limit: 1
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

    logout: async () => {
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
      const requiredFields = ['full_name', 'cpf', 'email', 'password', 'address_street', 'address_number', 'address_city', 'cep'];

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
  }
};

export default api;