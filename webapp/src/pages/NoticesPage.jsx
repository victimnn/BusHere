import React from 'react';

const NoticesPage = () => {
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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="container py-3">
      <div className="text-center mb-4">
        <i className="bi bi-bell-fill text-primary fs-3 d-block mb-2"></i>
        <h5 className="fw-semibold">Notificações</h5>
      </div>

      <div className="d-flex flex-column gap-3">
        {notices.map(notice => (
          <div
            key={notice.id}
           className={`card border-0 ${!notice.read ? 'border-start border-4 border-primary' : ''}`}
           style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.25)' }}
          >
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <i className={`bi ${getTypeIcon(notice.type)} me-2 fs-5`}></i>
                    <h6 className="mb-0 fw-semibold">{notice.title}</h6>
                    {!notice.read && (
                      <span className="badge bg-primary-subtle text-primary border ms-2">Novo</span>
                    )}
                  </div>
                  <p className="text-secondary small mb-2">{notice.message}</p>
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {formatDate(notice.date)}
                  </small>
                </div>
                <button className="btn btn-light btn-sm rounded-circle border">
                  <i className="bi bi-eye text-primary"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticesPage;
