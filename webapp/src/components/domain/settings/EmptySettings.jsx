import React from 'react';

const EmptySettings = () => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-5 text-center">
        <div 
          className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: '80px', height: '80px' }}
        >
          <i className="bi bi-gear-wide-connected fs-1 text-primary"></i>
        </div>
        <h6 className="fw-bold mb-2">Configurações Padrão</h6>
        <p className="text-muted small mb-0">
          Suas preferências estão definidas com os valores padrão
        </p>
      </div>
    </div>
  );
};

export default EmptySettings;
