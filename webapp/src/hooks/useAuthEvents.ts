// Hook personalizado para lidar com eventos de autenticação
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Remove dados de autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redireciona para a página de login
      navigate('/login', { replace: true });
    };

    // Escuta o evento customizado disparado pela API
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);
};

export default useAuthEvents;