import React from 'react';
import { FormActionButtons } from '../../common';

const DevActionsSettings = ({ 
  onInsertTestUser,
  onLogin,
  onLogout,
  onGetRoute,
  onGetStops,
  loading 
}) => {
  return (
    <div className="modern-card card border-0 shadow-sm border-warning">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-bold">
          <i className="bi bi-code-slash text-warning me-2"></i>
          Ações de Desenvolvimento
        </h6>
        
        <div className="alert alert-warning py-2 px-3 mb-3" role="alert">
          <small>
            <i className="bi bi-exclamation-triangle me-1"></i>
            Apenas para testes e desenvolvimento
          </small>
        </div>
        
        <div className="d-grid gap-2">
          <FormActionButtons
            onClick={onInsertTestUser}
            label="Registrar Usuário Teste"
            icon="bi-person-plus"
            variant="outline-warning"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onLogin}
            label="Fazer Login"
            icon="bi-box-arrow-in-right"
            variant="outline-success"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onLogout}
            label="Fazer Logout"
            icon="bi-box-arrow-right"
            variant="outline-danger"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onGetRoute}
            label="Obter Rotas"
            icon="bi-sign-turn-right"
            variant="outline-secondary"
            type="button"
            disabled={loading}
          />
          
          <FormActionButtons
            onClick={onGetStops}
            label="Obter Paradas"
            icon="bi-sign-stop"
            variant="outline-dark"
            type="button"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DevActionsSettings;
