import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import { useDashboardData, useRecentActivities } from '@web/hooks';
import PopUpComponent from '@web/components/ui/PopUpComponent';

import QuickAccess from '@web/components/pageComponents/home/quickAccess';
import HomeStatsCards from '@web/components/pageComponents/home/homeStatsCards';
import RecentActivityTable from '@web/components/pageComponents/home/RecentActivityTable';

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
            <div className="ps-3 pe-3 pt-3">
                <div className="container-fluid">
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="text-muted mb-0">Carregando painel...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ps-3 pe-3 pt-3">
                <div className="container-fluid">
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <span>{error}</span>
                            </div>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={refetch}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ps-3 pe-3 pt-3">
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-speedometer2 text-primary me-2 fs-4"></i>
                        <h1 className="h4 mb-0 fw-semibold">Painel de Controle</h1>
                    </div>
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={refetch}
                        disabled={isLoading}
                    >
                        <i className={`bi ${isLoading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'}`}></i>
                        <span className="d-none d-md-inline ms-1">Atualizar</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <HomeStatsCards stats={stats} />

                {/* Quick Access */}
                <div className="my-3">
                    <QuickAccess quickAccessItems={quickAccessItems} />
                </div>

                {/* Recent Activity Section */}
                {activitiesLoading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                        <span className="text-muted">Carregando atividades...</span>
                    </div>
                ) : activitiesError ? (
                    <div className="alert alert-warning py-2" role="alert">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                <small>Erro ao carregar atividades</small>
                            </div>
                            <button 
                                className="btn btn-outline-warning btn-sm"
                                onClick={refetch}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                ) : (
                    <RecentActivityTable 
                        data={activities} 
                        itemsPerPage={5} 
                        popUpRef={popUpRef}
                    />
                )}
            </div>
            <br/>
            
            <PopUpComponent 
                ref={popUpRef}
            />
        </div>
    );
};

export default HomePage;
