import React from 'react';

const NoticesHeader = ({ noticesCount }) => {
  return (
    <div className="account-header position-relative mb-4">
      <div className="container-fluid p-0">
        <div className="text-center">
          <div className="account-avatar position-relative d-inline-block mb-3">
            <div 
              className="avatar-circle bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto border border-white border-opacity-30"
            >
              <i className="bi bi-bell-fill text-secondary fs-3"></i>
            </div>
            {noticesCount > 0 && (
              <div 
                className="status-indicator position-absolute bottom-0 end-0 bg-danger rounded-circle border border-white d-flex align-items-center justify-content-center"
                style={{ width: '28px', height: '28px' }}
              >
                <small className="text-white fw-bold" style={{ fontSize: '0.7rem' }}>
                  {noticesCount > 9 ? '9+' : noticesCount}
                </small>
              </div>
            )}
          </div>
          
          <h4 className="mb-1 fw-bold text-white">Avisos e Notificações</h4>
          <p className="mb-2 text-white-50">
            {noticesCount} aviso{noticesCount !== 1 ? 's' : ''} para você
          </p>
          
          <span className="badge bg-white bg-opacity-20 text-secondary px-3 py-2 rounded-pill">
            <i className="bi bi-info-circle me-1"></i>
            Mantenha-se atualizado
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoticesHeader;
