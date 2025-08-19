import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../common/buttons/ActionButton';

/**
 * Componente para ações de configuração (exportar, importar, resetar)
 */
const SettingsActions = ({ 
  onExport,
  onImport,
  onReset,
  animationDelay = "0s"
}) => {
  return (
    <div 
      className="card p-4 mb-4 shadow-sm border-0 animate__animated animate__fadeInUp"
      style={{ animationDelay }}
    >
      <div className="d-flex align-items-center mb-4">
        <div 
          className="bg-secondary rounded-circle p-3 me-3 shadow-sm d-flex align-items-center justify-content-center" 
          style={{ width: '50px', height: '50px' }}
        >
          <i className="bi bi-tools text-white fs-4"></i>
        </div>
        <div className="flex-grow-1">
          <h4 className="mb-1">Ações de Configuração</h4>
          <p className="text-muted mb-0">Gerencie suas configurações</p>
        </div>
      </div>
      
      <div className="row g-3">
        <div className="col-md-4">
          <ActionButton
            variant="outline-primary"
            size="lg"
            onClick={onExport}
            icon="bi-download"
            text="Exportar"
            className="w-100"
          />
        </div>
        <div className="col-md-4">
          <ActionButton
            variant="outline-info"
            size="lg"
            onClick={onImport}
            icon="bi-upload"
            text="Importar"
            className="w-100"
          />
        </div>
        <div className="col-md-4">
          <ActionButton
            variant="outline-warning"
            size="lg"
            onClick={onReset}
            icon="bi-arrow-clockwise"
            text="Restaurar"
            className="w-100"
          />
        </div>
      </div>
    </div>
  );
};

SettingsActions.propTypes = {
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  animationDelay: PropTypes.string
};

export default SettingsActions;
