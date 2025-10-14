import React from 'react';
import { FormActionButtons } from '../../common';

const DataActionsSettings = ({ 
  onExportData, 
  onDeleteAccount, 
  onResetSettings,
  loading 
}) => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-bold">
          <i className="bi bi-database text-info me-2"></i>
          Gerenciar Dados
        </h6>
        
        <div className="d-grid gap-2">
          <FormActionButtons
            onClick={onExportData}
            label="Exportar Dados"
            icon="bi-download"
            variant="outline-primary"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onResetSettings}
            label="Resetar Configurações"
            icon="bi-arrow-clockwise"
            variant="outline-warning"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onDeleteAccount}
            label="Excluir Conta"
            icon="bi-trash"
            variant="outline-danger"
            type="button"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DataActionsSettings;
