import React from 'react';
import StatCard from '../../common/data-display/StatCard';

const HomeStatsCards = ({ stats }) => {
    const statsConfig = [
        {
            title: "Total de Passageiros",
            value: stats.passengers,
            iconClass: "bi bi-people-fill",
            className: "col-12 col-sm-6 col-lg-3",
            gradient: "bg-gradient-primary",
        },
        {
            title: "Motoristas Ativos",
            value: stats.drivers,
            iconClass: "bi bi-person-fill-gear",
            gradient: "bg-gradient-info",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        },
        {
            title: "Frota de Ônibus",
            value: stats.buses,
            iconClass: "bi bi-bus-front-fill",
            gradient: "bg-gradient-warning",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        },
        {
            title: "Rotas Ativas",
            value: stats.routes,
            iconClass: "bi bi-signpost-split-fill",
            gradient: "bg-gradient-danger",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        }
    ];

    return (
        <div className="row g-2 g-md-3 mb-3 mb-md-4">
            {statsConfig.map((config, index) => (
                <StatCard
                    key={index}
                    title={config.title}
                    value={config.value}
                    iconClass={config.iconClass}
                    gradient={config.gradient}
                    className={config.className}
                />
            ))}
        </div>
    );
};

export default HomeStatsCards;