import React from 'react';
import { PageHeader, InfoCard, ActionButton, StatusBadge } from '../components/common';

const NoticesPage = () => {
  // Dados de exemplo para avisos
  const notices = [
    {
      id: 1,
      title: 'Manutenção Programada',
      message: 'O sistema estará em manutenção no dia 15/12 das 02:00 às 04:00.',
      type: 'warning',
      date: '2024-12-10',
      read: false
    },
    {
      id: 2,
      title: 'Nova Funcionalidade',
      message: 'Agora você pode visualizar o histórico completo de suas viagens.',
      type: 'info',
      date: '2024-12-08',
      read: true
    },
    {
      id: 3,
      title: 'Atualização de Segurança',
      message: 'Sua conta foi atualizada com as mais recentes medidas de segurança.',
      type: 'success',
      date: '2024-12-05',
      read: true
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'bi-exclamation-triangle text-warning';
      case 'info':
        return 'bi-info-circle text-info';
      case 'success':
        return 'bi-check-circle text-success';
      default:
        return 'bi-bell text-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container-fluid p-3 page-content-with-floating-button" style={{ paddingTop: '1rem' }}>
      <div className="row">
        <div className="col-12">
          <PageHeader 
            icon="bi-bell" 
            title="Avisos" 
          />
          
          <div className="row g-3">
            {notices.map(notice => (
              <div key={notice.id} className="col-12">
                <div className={`card ${!notice.read ? 'border-primary border-2' : 'border-0'} shadow-sm`}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start">
                      <div className="flex-grow-1 me-2">
                        <div className="d-flex align-items-center mb-2">
                          <i className={`bi ${getTypeIcon(notice.type)} me-2`} style={{ fontSize: '18px' }}></i>
                          <h6 className="mb-0 fw-bold">{notice.title}</h6>
                          {!notice.read && (
                            <span className="badge bg-primary ms-2">Novo</span>
                          )}
                        </div>
                        <p className="text-muted mb-2 small">{notice.message}</p>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <StatusBadge 
                            status={notice.type} 
                            text={notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                          />
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {formatDate(notice.date)}
                          </small>
                        </div>
                      </div>
                      <div className="ms-auto">
                        <ActionButton 
                          icon="bi-eye"
                          variant="outline-primary"
                          size="sm"
                          className="rounded-circle"
                          style={{ width: '36px', height: '36px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
