import React from 'react';

const PrivacySettings = ({ privacy, onPrivacyChange }) => {
  return (
    <div className="modern-card card border-0 shadow-sm">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-bold">
          <i className="bi bi-shield-lock text-success me-2"></i>
          Privacidade
        </h6>
        
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="locationSharing"
            checked={privacy.locationSharing}
            onChange={() => onPrivacyChange('locationSharing', !privacy.locationSharing)}
          />
          <label className="form-check-label" htmlFor="locationSharing">
            Compartilhar Localização
          </label>
        </div>
        
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            id="dataAnalytics"
            checked={privacy.dataAnalytics}
            onChange={() => onPrivacyChange('dataAnalytics', !privacy.dataAnalytics)}
          />
          <label className="form-check-label" htmlFor="dataAnalytics">
            Compartilhar Dados para Análise
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
