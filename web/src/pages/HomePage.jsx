import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import { useDashboardData } from '../hooks/useDashboardData';
import { useRecentActivities } from '@web/hooks/useRecentActivities';
import PopUpComponent from '@web/components/PopUpComponent';

import QuickAccess from '@web/components/home/quickAccess';
import HomeStatsCards from '@web/components/home/homeStatsCards';
import RecentActivityTable from '@web/components/home/RecentActivityTable';

function HomePage({pageFunctions}) {
    const popUpRef = useRef(null);

    useEffect(() => {
        pageFunctions.set("Início", true, true);
    }, []);    const navigate = useNavigate();
    const { stats, isLoading, error, refetch } = useDashboardData();
    const { activities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities();

    // Debug log para verificar se os dados estão chegando
    useEffect(() => {
        console.log('Activities data:', activities);
        console.log('Activities loading:', activitiesLoading);
        console.log('Activities error:', activitiesError);
    }, [activities, activitiesLoading, activitiesError]);

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
                <QuickAccess quickAccessItems={quickAccessItems} />                {/* Recent Activity Table */}
                <RecentActivityTable 
                  data={activities} 
                  itemsPerPage={5} 
                  popUpRef={popUpRef}
                />
                
                {/* Debug info - remover em produção */}
                {activitiesError && (
                    <div className="alert alert-warning" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Erro ao carregar atividades: {activitiesError.message || activitiesError}
                    </div>
                )}
                
                {activitiesLoading && (
                    <div className="text-center my-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Carregando atividades...</span>
                        </div>
                    </div>
                )}
            </div>
            <PopUpComponent 
                ref={popUpRef}
            />
        </main>
    );
};

export default HomePage;
