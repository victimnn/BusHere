import React from 'react';
import PropTypes from 'prop-types';

const EditProfileHeader = ({ onBack, loading }) => {
  return (
    <div className="account-header position-relative mb-4">
      <div className="container-fluid p-0">
        <div className="text-center">
          <div className="account-avatar position-relative d-inline-block mt-3 mb-3">
            <div className="avatar-circle bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto border border-white border-opacity-30">
              <i className="bi bi-person-fill text-dark fs-1"></i>
            </div>
            
            {/* Botão Voltar */}
            <button
              type="button"
              className={`btn btn-sm position-absolute back-button ${loading ? 'disabled' : ''}`}
              onClick={onBack}
              disabled={loading}
              aria-label="Voltar"
            >
              <i className="bi bi-arrow-left text-primary fs-5"></i>
            </button>
          </div>
          
          <h4 className="mb-1 fw-bold text-white">Editar Perfil</h4>
          <p className="mb-2 text-white-50">Atualize suas informações pessoais</p>
          
          <span className="badge bg-white bg-opacity-20 text-secondary px-3 py-2 rounded-pill">
            <i className="bi bi-pencil-square me-1"></i>
            Modo de Edição
          </span>
        </div>
      </div>
    </div>
  );
};

EditProfileHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

EditProfileHeader.defaultProps = {
  loading: false
};

export default EditProfileHeader;
