import React from 'react';

const EmptyNotices = () => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-5 text-center">
        <div 
          className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: '80px', height: '80px' }}
        >
          <i className="bi bi-inbox fs-1 text-primary"></i>
        </div>
        <h6 className="fw-bold mb-2">Nenhum aviso no momento</h6>
        <p className="text-muted small mb-0">
          Você receberá notificações importantes aqui
        </p>
      </div>
    </div>
  );
};

export default EmptyNotices;
