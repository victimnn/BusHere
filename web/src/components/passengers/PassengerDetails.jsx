import React from 'react';
import PropTypes from 'prop-types';

function PassengerDetails({ passenger, onEdit, onDelete }) {
  if (!passenger) {
    return (
      <div className="p-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-person-slash fs-1 text-muted mb-3"></i>
            <p className="text-muted">Nenhum passageiro selecionado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="card border-0 shadow-sm passenger-detail-card">
        <div className="card-header bg-light py-3">
          <div className="d-flex align-items-center">
            <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
              <i className="bi bi-person-fill fs-4"></i>            
            </div>
              <h5 className="mb-0 fw-semibold">Detalhes do Passageiro</h5>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="mb-4">
            <div className="row g-3">
                {/* <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-hash text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">ID</small>
                      <span className="fw-medium">{passenger.id}</span>
                    </div>
                  </div>
                </div> */}
                
                <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-person text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">Nome</small>
                      <span className="fw-medium">{passenger.nome || "Não informado"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-card-text text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">CPF</small>                      
                      <span className="fw-medium">{passenger.cpf || "Não informado"}</span>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-envelope text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">E-Mail</small>
                      <span className="fw-medium">{passenger.email || "Não informado"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">Telefone</small>                      
                      <span className="fw-medium">{passenger.telefone || "Não informado"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                    <i className="bi bi-person-badge text-primary me-3 fs-5"></i>
                    <div>
                      <small className="text-muted d-block">Tipo</small>
                      <span className="fw-medium">{passenger.tipo_passageiro || "Não informado"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="d-flex justify-content-end gap-3">              <button 
                className="btn btn-outline-danger btn-lg px-4" 
                onClick={() => onDelete(passenger.id || passenger.passageiro_id)}
              >
                <i className="bi bi-trash me-2"></i> Excluir              
              </button>

              <button 
                className="btn btn-primary btn-lg px-4" 
                onClick={() => onEdit(passenger)}
              >
                <i className="bi bi-pencil-square me-2"></i> Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

PassengerDetails.propTypes = {
  passenger: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    passageiro_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    cpf: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    tipo_passageiro: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipo_passageiro_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PassengerDetails;
