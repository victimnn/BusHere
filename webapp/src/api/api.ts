function getBearerToken() {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
}


const API_BASE_URL = 'http://localhost:3000/api/passenger';

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
      console.log(`Fazendo ${method} ${url}`, data, config, response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(errorData.error || errorData.message || 'Ocorreu um erro na requisição') as Error & { status: number; data: any };
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
  
  get: (url, options?) => api._request('GET', url, null, options),
  post: (url, data?, options?) => api._request('POST', url, data, options),
  put: (url, data, options?) => api._request('PUT', url, data, options),
  patch: (url, data, options?) => api._request('PATCH', url, data, options),
  delete: (url, options?) => api._request('DELETE', url, null, options),

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

    login: async ({ email, password }) => {
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
      const requiredFields = ["name","cpf","email","password","address"];
      const addressRequiredFields = ["street","number","complement","neighborhood","city","state","zip"];

      // Verifica se todos os campos obrigatórios estão presentes
      const missingFields = requiredFields.filter(field => !userData[field]);
      const missingAddressFields = addressRequiredFields.filter(field => !userData.address || !userData.address[field]);

      if (missingFields.length > 0 || missingAddressFields.length > 0) {
        throw new Error("Campos obrigatórios ausentes");
      }

      try {
        const response = await api.post('/auth/register', userData);
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
  }
};

export default api;