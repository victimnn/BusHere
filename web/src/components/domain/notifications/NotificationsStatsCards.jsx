import React, { useMemo } from 'react';
import StatCard from '../../common/data-display/StatCard';

const STATS_CONFIG = {
  total: {
    title: "Total de Avisos",
    iconClass: "bi bi-bell-fill",
    gradient: "bg-gradient-info"
  },
  active: {
    title: "Avisos Ativos",
    iconClass: "bi bi-check-circle-fill",
    gradient: "bg-gradient-success"
  },
  high: {
    title: "Prioridade Alta",
    iconClass: "bi bi-exclamation-triangle-fill",
    gradient: "bg-gradient-danger"
  },
  expiring: {
    title: "Expirando em Breve",
    iconClass: "bi bi-clock-fill",
    gradient: "bg-gradient-warning"
  }
};

// Função para calcular dias restantes
const getDaysUntilExpiration = (expirationDate) => {
  if (!expirationDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Parse da data no formato DD/MM/YYYY
  const parts = expirationDate.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const expiration = new Date(year, month, day);
  if (isNaN(expiration.getTime())) return null;
  
  const diffTime = expiration - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

function NotificationsStatsCards({ notifications }) {
  // Calcula estatísticas usando useMemo para otimizar performance
  const stats = useMemo(() => {
    const total = notifications.length;
    const active = notifications.filter(n => n.ativo).length;
    const high = notifications.filter(n => n.prioridade === 'ALTA').length;
    
    // Avisos que expiram nos próximos 7 dias
    const expiring = notifications.filter(n => {
      if (!n.data_expiracao || !n.ativo) return false;
      const daysUntil = getDaysUntilExpiration(n.data_expiracao);
      return daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
    }).length;

    return { total, active, high, expiring };
  }, [notifications]);

  return (
    <div className="row g-3 mb-4">
      {/* Card: Total de Avisos */}
      <StatCard
        title={STATS_CONFIG.total.title}
        value={stats.total}
        iconClass={STATS_CONFIG.total.iconClass}
        gradient={STATS_CONFIG.total.gradient}
        className="col-lg-3 col-md-6 mb-3"
      />

      {/* Card: Avisos Ativos */}
      <StatCard
        title={STATS_CONFIG.active.title}
        value={stats.active}
        iconClass={STATS_CONFIG.active.iconClass}
        gradient={STATS_CONFIG.active.gradient}
        className="col-lg-3 col-md-6 mb-3"
      />

      {/* Card: Prioridade Alta */}
      <StatCard
        title={STATS_CONFIG.high.title}
        value={stats.high}
        iconClass={STATS_CONFIG.high.iconClass}
        gradient={STATS_CONFIG.high.gradient}
        className="col-lg-3 col-md-6 mb-3"
      />

      {/* Card: Expirando em Breve */}
      <StatCard
        title={STATS_CONFIG.expiring.title}
        value={stats.expiring}
        iconClass={STATS_CONFIG.expiring.iconClass}
        gradient={STATS_CONFIG.expiring.gradient}
        className="col-lg-3 col-md-6 mb-3"
      />
    </div>
  );
}

export default NotificationsStatsCards;
