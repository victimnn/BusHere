function getBearerToken() {
  return localStorage.getItem('authToken'); // Token de autenticação armazenado no localStorage
}

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000'; // URL base da API

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
          window.location.href = '/login'; // Exemplo de redirecionamento
          window.localStorage.removeItem('authToken'); // Remove o token
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
};

export default api;