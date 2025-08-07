import React from 'react';
import StatCard from '../../common/StatCard';

const HomeStatsCards = ({ stats }) => {
    const statsConfig = [
        {
            title: "Total de Passageiros",
            value: stats.passengers,
            iconClass: "bi bi-people-fill",
            gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        },
        {
            title: "Motoristas Ativos",
            value: stats.drivers,
            iconClass: "bi bi-person-fill-gear",
            gradient: "linear-gradient(135deg, #1E90FF 0%, #12BEA0 100%)",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        },
        {
            title: "Frota de Ônibus",
            value: stats.buses,
            iconClass: "bi bi-bus-front-fill",
            gradient: "linear-gradient(135deg, #FFC107 0%, #E0A800 100%)",
            className: "col-xl-3 col-lg-6 col-md-6 col-6"
        },
        {
            title: "Rotas Ativas",
            value: stats.routes,
            iconClass: "bi bi-signpost-split-fill",
            gradient: "linear-gradient(135deg, #FF6B6B 0%, #C82333 100%)",
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