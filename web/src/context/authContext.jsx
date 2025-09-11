import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; // Importe a API

// importar coisas para ter navegação e ir para tela de login
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth está sendo usado fora do AuthProvider. Retornando valores padrão.');
    // Retorna valores padrão em vez de lançar erro
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: () => {},
      logout: () => {},
      checkAuthStatus: () => Promise.resolve()
    };
  }
  return context;
}

/* o "children" são as coisas dentro do AuthProvider
<AuthProvider>
  <Coisa />
  <OutraCoisa />
  <MaisCoisas />
</AuthProvider> 
*/


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o loading
  const navigate = useNavigate(); // Hook para navegação

  // Função para verificar se o usuário está autenticado
  const checkAuthStatus = async () => {
    try {
      const response = await api.auth.me();
      if (response && response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        console.warn('Resposta inválida da API:', response);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      //navigate('/login'); // Redireciona para a página de login se houver erro
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false); // Para o loading independente do resultado
    }
  };

  // useEffect para verificar autenticação quando o componente é montado
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData) => {
    // Se userData for uma resposta da API, extrair o usuário
    if (userData && userData.user) {
      setUser(userData.user);
    } else {
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Remove o token do localStorage
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

/* como usar essas coisas na pagina:
import { useAuth } from 'caminho/para/authContext';
const { user, isAuthenticated, isLoading, login, logout, checkAuthStatus } = useAuth();

// Exemplo de uso do isLoading:
if (isLoading) {
  return <div>Carregando...</div>;
}

// Exemplo de verificação manual:
const handleRefreshAuth = async () => {
  await checkAuthStatus();
};
*/

/* como logar na pagina:
user = await api.auth.me() 
if (user)  // se o usuário existir
  login(user) // chama a função de
else
  logout()
*/

// Lembrando que o user é compartilhado entre TODOS os componentes que usam o AuthContext