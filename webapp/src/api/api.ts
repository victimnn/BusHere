// Interfaces TypeScript
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nome_completo: string;
  cpf: string;
  email: string;
  password: string;
  telefone?: string;
  data_nascimento?: string;
  pcd?: boolean;
  logradouro: string;
  numero_endereco: string;
  complemento_endereco?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  tipo_passageiro_id?: number;
  rota_id?: number;
  ponto_id?: number;
  notificacoes_json?: string;
  configuracoes_json?: string;
  ativo?: boolean;
}

interface UserData {
  passageiro_id: number;
  nome_completo: string;
  email: string;
  cpf?: string;
  telefone?: string;
  data_nascimento?: string;
  pcd?: boolean;
  logradouro?: string;
  numero_endereco?: string;
  complemento_endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  tipo_passageiro_id?: number;
  rota_id?: number;
  ponto_id?: number;
  ativo?: boolean;
  data_criacao?: string;
  data_atualizacao?: string;
}

interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  token?: string;
  data?: T;
  user?: T;
  userId?: number;
  error?: string;
}

interface ApiError extends Error {
  status: number;
  data: any;
}

function getBearerToken(): string | null {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
}


//Suprime o erro pq esse erro não faz sentido:
///@ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/passenger';

// Timeout padrão para requisições (10 segundos)
const REQUEST_TIMEOUT = 10000;

const api = {
  _request: async <T = any>(
    method: string, 
    url: string, 
    data: any = null, 
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getBearerToken(); // Obtém o token a cada requisição
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}) // Mantém quaisquer headers passados explicitamente
    };

    if (token) {
      headers['Authorization'] = token;
    }

    // Configuração com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const config: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      ...options, // Permite sobrescrever outras opções (mode, cache, etc.)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      clearTimeout(timeoutId);
      
      // Log apenas em desenvolvimento
      ///@ts-ignore
      if (import.meta.env.DEV) {
        console.log(`Fazendo ${method} ${url}`, { data, config, status: response.status });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorData.error || errorData.message || 'Ocorreu um erro na requisição') as ApiError;
        error.status = response.status;
        error.data = errorData;
        
        // Exemplo: se for 401 Unauthorized, redireciona para a página de login
        if (response.status === 401) {
          ///@ts-ignore
          if (import.meta.env.DEV) {
            console.error('Unauthorized: Redirecionando para login...');
          }
          localStorage.removeItem('token');
          // Redirecionamento será tratado pelo AuthContext
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        throw error;
      }

      // Tenta retornar JSON, mas se não for um JSON válido, retorna o texto ou null
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text() as T; 
      }

    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou muito para responder');
      }
      ///@ts-ignore
      if (import.meta.env.DEV) {
        console.error("Erro na requisição:", error);
      }
      throw error; // da erro denovo para poder ser tratado fora daqui
    }
  },
  
  get: <T = any>(url: string, options?: RequestInit): Promise<T> => 
    api._request<T>('GET', url, null, options),
  post: <T = any>(url: string, data?: any, options?: RequestInit): Promise<T> => 
    api._request<T>('POST', url, data, options),
  put: <T = any>(url: string, data: any, options?: RequestInit): Promise<T> => 
    api._request<T>('PUT', url, data, options),
  patch: <T = any>(url: string, data: any, options?: RequestInit): Promise<T> => 
    api._request<T>('PATCH', url, data, options),
  delete: <T = any>(url: string, options?: RequestInit): Promise<T> => 
    api._request<T>('DELETE', url, null, options),

  auth: {
    me: async (): Promise<UserData> => {
      const token = getBearerToken();
      if (!token) {
        throw new Error('Usuário não autenticado. Token ausente.');
      }

      try {
        const response = await api.get<UserData>('/auth/me', {headers: { 'Authorization': token }});
        return response; // Retorna os dados do usuário autenticado
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao obter informações do usuário:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    login: async ({ email, password }: LoginData): Promise<ApiResponse<UserData>> => {
      try {
        const response = await api.post<ApiResponse<UserData>>('/auth/login', { email, password });
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Armazena o token no localStorage
          return response; // Retorna os dados do usuário logado
        } else {
          throw new Error('Login falhou: resposta inválida do servidor');
        }
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao fazer login:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    logout: async (): Promise<void> => {
      try {
        await api.post<void>('/auth/logout'); // Chama a API para logout
        localStorage.removeItem('token'); // Remove o token do localStorage
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao fazer logout:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
      try {
        const response = await api.post<ApiResponse>('/auth/change-password', 
          {
            old_password: currentPassword,
            new_password: newPassword
          })
        return response; // Retorna a resposta da API
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao alterar senha:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    register: async (userData: RegisterData): Promise<ApiResponse<UserData>> => {
      // Validação usando as interfaces TypeScript
      const requiredFields: (keyof RegisterData)[] = [
        "nome_completo", "cpf", "email", "password", 
        "logradouro", "numero_endereco", "bairro", "cidade", "uf", "cep"
      ];


      // Verifica se todos os campos obrigatórios estão presentes
      const missingFields = requiredFields.filter(field => {
        const value = userData[field];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios ausentes: ${missingFields.map(f => String(f)).join(', ')}`);
      }

      try {
        const response = await api.post<ApiResponse<UserData>>('/auth/register', userData);
        return response; // Retorna a resposta da API
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao registrar usuário:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    updateProfile: async (userData: Partial<RegisterData>): Promise<ApiResponse<UserData>> => {
      try {
        const response = await api.put<ApiResponse<UserData>>('/auth/profile', userData);
        return response; // Retorna a resposta da API
      } catch (error) {
        ///@ts-ignore
        if (import.meta.env.DEV) {
          console.error("Erro ao atualizar perfil:", error);
        }
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
  },

  stops: {
    getAll: async () => {
      try {
        const response = await api.get('/stops');
        return response; // Retorna a lista de pontos
      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    

    get: async (id: string) => {
      try {
        const response = await api.get(`/stops/${id}`);
        return response; // Retorna os dados do ponto
      } catch (error) {
        console.error(`Erro ao buscar ponto com ID ${id}:`, error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
  },

  routes: {
    get: async () => {
      try {
        const response = await api.get('/routes');
        return response; // Retorna a lista de rotas
      } catch (error) {
        console.error("Erro ao buscar rotas:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    }
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
    getById: (id: number | string) => api.get(`/vehicles/${id}`),
    getByRoute: (rotaId: number | string) => api.get(`/vehicles/by-route/${rotaId}`),
    delete: (id: number | string) => api.delete(`/vehicles/${id}`),
    getStatus: () => api.get('/vehicles/status'),
    getTypes: () => api.get('/vehicles/types'),
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

    create: async (notificationData: any) => {
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

    getById: async (id: number | string) => {
      try {
        const response = await api.get(`/avisos/${id}`);
        return response;
      } catch (error) {
        console.error("Erro ao buscar aviso por ID:", error);
        throw error;
      }
    }
  },
  invites: {
    getByCode: async (code: string) => {
      try {
        const response = await api.get(`/invites/${code}`);
        return response.data; // Retorna os dados do convite
      } catch (error) {
        console.error(`Erro ao buscar convite com código ${code}:`, error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    accept: async (code: string) => {
      try {
        const response = await api.post(`/invites/accept/${code}`);
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error(`Erro ao aceitar convite com código ${code}:`, error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
    
  }
};

export default api;