import React from 'react';
import { isBusActive, isRouteActive, getActiveCountFromStats, getActiveBuses, getActiveRoutes } from '../../utils/reportFilters';
import AnimatedCounter from './AnimatedCounter';

const StatCard = ({ title, value, icon, gradient, iconClass = "fas fa-users" }) => {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div 
        className="card border-0 shadow-sm h-100 stats-card card-hover" 
        style={{background: gradient}}
      >
        <div className="card-body text-white p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title mb-2 opacity-75 fw-normal">{title}</h6>
              <h2 className="fw-bold mb-0" style={{fontSize: '2rem'}}>
                <AnimatedCounter endValue={value || 0} />
              </h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-circle stats-icon">
              <i className={iconClass}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        />
      ))}
    </div>
  );
};

export default StatsCards;
