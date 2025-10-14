import { useState, useEffect } from 'react';
import api from '../../api/api';

export const useNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.notifications.list();
      
      if (response && response.data) {
        setNotices(response.data);
        console.log(`✅ ${response.data.length} aviso(s) carregado(s)`);
      }
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
      setError('Não foi possível carregar os avisos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (prioridade) => {
    switch (prioridade) {
      case 'ALTA':
        return {
          icon: 'bi-exclamation-triangle-fill',
          color: 'text-danger',
          badge: 'bg-danger',
          border: 'border-danger'
        };
      case 'MEDIA':
        return {
          icon: 'bi-info-circle-fill',
          color: 'text-primary',
          badge: 'bg-primary',
          border: 'border-primary'
        };
      case 'BAIXA':
        return {
          icon: 'bi-check-circle-fill',
          color: 'text-success',
          badge: 'bg-success',
          border: 'border-success'
        };
      default:
        return {
          icon: 'bi-bell-fill',
          color: 'text-secondary',
          badge: 'bg-secondary',
          border: 'border-secondary'
        };
    }
  };

  const getScopeInfo = (escopo_aviso_id, nome_escopo) => {
    const scopeMap = {
      1: { icon: 'bi-broadcast', label: 'Geral', color: 'text-info' },
      2: { icon: 'bi-signpost-2', label: 'Sua Rota', color: 'text-warning' },
      3: { icon: 'bi-people', label: 'Seu Tipo', color: 'text-purple' },
      4: { icon: 'bi-person', label: 'Pessoal', color: 'text-primary' }
    };
    return scopeMap[escopo_aviso_id] || { icon: 'bi-bell', label: nome_escopo, color: 'text-secondary' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpiringSoon = (dataExpiracao) => {
    if (!dataExpiracao) return false;
    const expirationDate = new Date(dataExpiracao);
    const now = new Date();
    const diffHours = (expirationDate - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };

  const isNew = (dataPublicacao) => {
    if (!dataPublicacao) return false;
    const publicationDate = new Date(dataPublicacao);
    const now = new Date();
    const diffHours = (now - publicationDate) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  return {
    notices,
    loading,
    error,
    loadNotices,
    getPriorityStyle,
    getScopeInfo,
    formatDate,
    isExpiringSoon,
    isNew
  };
};
