import React from 'react';

const AppearanceSettings = ({ appearance, onAppearanceChange }) => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-bold">
          <i className="bi bi-palette text-warning me-2"></i>
          Aparência
        </h6>
        
        <div className="mb-3">
          <label className="form-label small fw-medium">Tamanho da Fonte</label>
          <select 
            className="form-select form-select-sm"
            value={appearance.fontSize}
            onChange={(e) => onAppearanceChange('fontSize', e.target.value)}
          >
            <option value="small">Pequeno</option>
            <option value="medium">Médio</option>
            <option value="large">Grande</option>
          </select>
        </div>
        
        <div className="mb-0">
          <label className="form-label small fw-medium">Idioma</label>
          <select 
            className="form-select form-select-sm"
            value={appearance.language}
            onChange={(e) => onAppearanceChange('language', e.target.value)}
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
