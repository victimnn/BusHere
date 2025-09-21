import React from 'react';

const MapTest = () => {
  return (
    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
      <div className="text-center p-3">
        <i className="bi bi-map display-4 text-muted mb-3"></i>
        <h5 className="text-muted mb-2">Modo de Teste</h5>
        <p className="text-muted small mb-3">O mapa foi temporariamente substituído por esta tela de teste.</p>
        
        <div className="row g-2">
          <div className="col-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 text-center">
                <i className="bi bi-geo-alt text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="small fw-bold">Localização</h6>
                <small className="text-muted">Teste de funcionalidade</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 text-center">
                <i className="bi bi-arrow-clockwise text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="small fw-bold">Atualização</h6>
                <small className="text-muted">Dados em tempo real</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 text-center">
                <i className="bi bi-speedometer2 text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="small fw-bold">Performance</h6>
                <small className="text-muted">Otimização de recursos</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 text-center">
                <i className="bi bi-phone text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="small fw-bold">Mobile</h6>
                <small className="text-muted">Otimizado para dispositivos móveis</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTest;
