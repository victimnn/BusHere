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
    getInfoFromCoordinates: async (lat, lon) => {
      const queryParams = new URLSearchParams({
        format: "json",
        lat: lat,
        lon: lon,
        addressdetails: 1,
        extratags: 1,
        limit: 1
      })

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Erro ao obter informações de geolocalização: ${response.statusText}`);
        }
        const data = await response.json();

        const state = findStateByLabel(data.address.state || data.address.region || '');
        if (!state) {
          throw new Error(`Estado não encontrado: ${data.address.state || data.address.region}`);
        }
        const uf = state.value

        return {
          road: data.address.road || '',
          suburb: data.address.suburb || '',
          city: data.address.city || data.address.town || '',
          state: data.address.state || '',
          uf: uf,
          coordinates: {
            latitude: lat,
            longitude: lon
          },
          data: data,
        }

      } catch (error) {
        console.error("Erro na requisição de geolocalização:", error);
        throw error; // Propaga o erro para ser tratado fora
      }

    }
  }
};

export default api;