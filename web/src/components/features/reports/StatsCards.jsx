import React from 'react';
import { isBusActive, isRouteActive, getActiveCountFromStats, getActiveBuses, getActiveRoutes } from '@web/utils/reportFilters';
import StatCard from '../../common/data-display/StatCard';
import { Class } from 'leaflet';

const StatsCards = ({ reportData }) => {
  const stats = [
    {
      title: "Total de Passageiros",
      value: reportData.stats?.passengers?.total || reportData.passengers.length,
      iconClass: "fas fa-users",
      className: "col-12 col-sm-6 col-lg-3",
      gradient: "bg-gradient-primary"
    },
    {
      title: "Ônibus Ativos",
      value: getActiveCountFromStats(reportData.stats?.buses?.byStatus, isBusActive) ||
             getActiveBuses(reportData.buses || []).length,
      iconClass: "fas fa-bus",
      className: "col-12 col-sm-6 col-lg-3",
      gradient: "bg-gradient-info"
    },
    {
      title: "Total de Pontos",
      value: reportData.stats?.stops?.total_pontos || 
             reportData.stops?.length || 
             (reportData.chartData?.stopsByCity?.reduce((sum, item) => sum + (item.value || 0), 0)) || 
             0,
      iconClass: "fas fa-map-pin",
      className: "col-12 col-sm-6 col-lg-3",
      gradient: "bg-gradient-warning"
    },
    {
      title: "Rotas Ativas",
      value: getActiveCountFromStats(reportData.stats?.routes?.byStatus, isRouteActive) ||
             getActiveRoutes(reportData.routes || []).length,
      iconClass: "fas fa-route",
      className: "col-12 col-sm-6 col-lg-3",
      gradient: "bg-gradient-danger"
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
          className={stat.className}
          gradient={stat.gradient}
        />
      ))}
    </div>
  );
};

export default StatsCards;
