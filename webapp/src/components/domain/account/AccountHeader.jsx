import React from 'react';

const AccountHeader = ({ user, getInitials }) => {
  return (
    <div className="account-header position-relative mb-4">
      <div className="container-fluid p-0">
        <div className="text-center">
          <div className="account-avatar position-relative d-inline-block mb-3">
            <div className="avatar-circle bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto border border-white border-opacity-30">
              <span className="text-secondary fw-bold">
                {getInitials(user?.nome_completo)}
              </span>
            </div>
            <div 
              className="status-indicator position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
              style={{ width: '24px', height: '24px' }}
            >
              <i className="bi bi-check text-white"></i>
            </div>
          </div>
          
          <h4 className="mb-1 fw-bold text-white">{user?.nome_completo || 'Usuário'}</h4>
          <p className="mb-2 text-white-50">{user?.email || 'email@exemplo.com'}</p>
          
          <span className="badge bg-white bg-opacity-20 text-secondary px-3 py-2 rounded-pill">
            <i className="bi bi-shield-check me-1"></i>
            Conta Verificada
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;