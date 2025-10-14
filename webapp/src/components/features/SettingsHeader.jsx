import React from 'react';

export const SettingsHeader = () => {
  return (
    <div className="account-header position-relative mb-4">
      <div className="container-fluid p-0">
        <div className="text-center">
          <div className="account-avatar position-relative d-inline-block mb-3">
            <div 
              className="avatar-circle bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto border border-white border-opacity-30"
            >
              <i className="bi bi-gear-fill text-secondary fs-3"></i>
            </div>
          </div>
          
          <h4 className="mb-1 fw-bold text-white">Configurações</h4>
          <p className="mb-2 text-white-50">
            Personalize sua experiência
          </p>
          
          <span className="badge bg-white bg-opacity-20 text-secondary px-3 py-2 rounded-pill">
            <i className="bi bi-sliders me-1"></i>
            Ajuste suas preferências
          </span>
        </div>
      </div>
    </div>
  );
};
