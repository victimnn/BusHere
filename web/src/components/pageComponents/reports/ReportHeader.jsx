import React from 'react';
import ActionButton from '../../common/ActionButton';

const ReportHeader = ({ isLoading, onRefresh, onExport }) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="bg-gradient-primary rounded-3 p-4 text-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <h1 className="mb-2 fw-bold fs-2">
                <i className="fas fa-chart-line me-2"></i>
                Dashboard de Relatórios
              </h1>
              <p className="mb-0 opacity-75">
                <i className="far fa-calendar-alt me-2"></i>
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="d-flex gap-2">
              <ActionButton
                onClick={onRefresh}
                icon={isLoading ? 'fas fa-sync-alt fa-spin' : 'fas fa-sync-alt'}
                text="Atualizar"
                variant="outline-light"
                size="lg"
                disabled={isLoading}
                loading={isLoading}
                className="border-2 shadow-sm d-none d-sm-inline"
              />
              <ActionButton
                onClick={onExport}
                icon="fas fa-download"
                text="Exportar"
                variant="light"
                size="lg"
                className="text-primary fw-semibold shadow-sm d-none d-sm-inline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
