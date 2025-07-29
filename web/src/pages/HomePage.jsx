import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import { useDashboardData } from '../hooks/useDashboardData';
import QuickAccess from '../components/home/quickAccess';
import HomeStatsCards from '../components/home/homeStatsCards';

function HomePage({pageFunctions}) {
    useEffect(() => {
        pageFunctions.set("Início", true, true);
    }, []);

    const navigate = useNavigate();
    const { stats, isLoading, error, refetch } = useDashboardData();

    const quickAccessItems = [
        { title: 'Passageiros', icon: 'bi-people-fill', path: '/passengers', color: 'primary' },
        { title: 'Motoristas', icon: 'bi-person-fill-gear', path: '/drivers', color: 'info' },
        { title: 'Ônibus', icon: 'bi-bus-front-fill', path: '/buses', color: 'warning' },
        { title: 'Rotas', icon: 'bi-signpost-split-fill', path: '/routes', color: 'danger' }
    ];

    if (isLoading) {
        return (
            <div className="container-fluid p-3 p-md-4">
                <div className="row mb-3 mb-md-4">
                    <div className="col">
                        <h1 className="h2 h3-md">Painel de Controle</h1>
                        <p className="text-muted small">Visão geral do sistema.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid p-3 p-md-4">
                <div className="row mb-3 mb-md-4">
                    <div className="col">
                        <h1 className="h2 h3-md">Painel de Controle</h1>
                        <p className="text-muted small">Visão geral do sistema.</p>
                    </div>
                </div>
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={refetch}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="ps-3 pe-3 pt-3">
            <div className="container-fluid p-3 p-md-4">
                {/* Header */}
                <div className="row mb-3 mb-md-4">
                    <div className="col d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h1 className="h2 h3-md mb-1">Painel de Controle</h1>
                            <p className="text-muted small mb-0">Visão geral do sistema.</p>
                        </div>
                        <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={refetch}
                            disabled={isLoading}
                        >
                            <i className={`bi ${isLoading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'}`}></i>
                            <span className="d-none d-sm-inline ms-1">
                                {isLoading ? 'Atualizando...' : 'Atualizar'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <HomeStatsCards stats={stats} />

                {/* Quick Access */}
                <QuickAccess quickAccessItems={quickAccessItems} />
            </div>
        </main>
    );
};

export default HomePage;
