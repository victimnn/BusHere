import React from 'react';

const ReportHeader = ({ isLoading, onRefresh, onExport }) => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="bg-gradient-primary rounded-3 p-3 text-white shadow-lg">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <h1 className="mb-1 fw-bold fs-2">
                <i className="fas fa-chart-line me-2"></i>
                Dashboard de Relatórios
              </h1>
              <p className="mb-0 opacity-75 small">
                <i className="far fa-calendar-alt me-2"></i>
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light shadow-sm"
                onClick={onRefresh}
                disabled={isLoading}
                style={{borderRadius: '10px'}}
              >
                <i className="fas fa-sync-alt me-1"></i>
                <span className="d-none d-sm-inline">Atualizar</span>
              </button>
              <button 
                className="btn btn-success shadow-sm"
                onClick={onExport}
                style={{borderRadius: '10px'}}
              >
                <i className="fas fa-download me-1"></i>
                <span className="d-none d-sm-inline">Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
