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


  }
};

export default api;