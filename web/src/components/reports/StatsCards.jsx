import React from 'react';
import { isBusActive, isRouteActive, getActiveCountFromStats, getActiveBuses, getActiveRoutes } from '../../utils/reportFilters';
import StatCard from '../common/StatCard';

const StatsCards = ({ reportData }) => {
  const stats = [
    {
      title: "Total de Passageiros",
      value: reportData.stats?.passengers?.total || reportData.passengers.length,
      iconClass: "fas fa-users",
      gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)"
    },
    {
      title: "Ônibus Ativos",
      value: getActiveCountFromStats(reportData.stats?.buses?.byStatus, isBusActive) ||
             getActiveBuses(reportData.buses || []).length,
      iconClass: "fas fa-bus",
      gradient: "linear-gradient(135deg, #12BEA0 0%, #12BE18 100%)"
    },
    {
      title: "Total de Pontos",
      value: reportData.stats?.stops?.total_pontos || 
             reportData.stops?.length || 
             (reportData.chartData?.stopsByCity?.reduce((sum, item) => sum + (item.value || 0), 0)) || 
             0,
      iconClass: "fas fa-map-pin",
      gradient: "linear-gradient(135deg, #1E90FF 0%, #12BEA0 100%)"
    },
    {
      title: "Rotas Ativas",
      value: getActiveCountFromStats(reportData.stats?.routes?.byStatus, isRouteActive) ||
             getActiveRoutes(reportData.routes || []).length,
      iconClass: "fas fa-route",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFC107 100%)"
    }
  ];

  return (
    <div className="row mb-4 g-3">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          iconClass={stat.iconClass}
          gradient={stat.gradient}
          className="col-lg-3 col-md-6 mb-4"
        />
      ))}
    </div>
  );
};

export default StatsCards;
