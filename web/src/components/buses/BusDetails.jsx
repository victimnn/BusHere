import React from 'react';
import PropTypes from 'prop-types';

function BusDetails({ bus, onEdit, onDelete }) {
  if (!bus) {
    return (
      <div className="p-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-bus-front-fill fs-1 text-muted mb-3"></i>
            <p className="text-muted">Nenhum ônibus selecionado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light py-3">
          <div className="d-flex align-items-center">
            <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
              <i className="bi bi-bus-front-fill fs-4"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Detalhes do Ônibus</h5>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-info-circle text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Nome</small>
                  <span className="fw-medium">{bus.nome || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-card-text text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Placa</small>
                  <span className="fw-medium">{bus.placa || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-truck text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Modelo</small>
                  <span className="fw-medium">{bus.modelo || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-building text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Marca</small>
                  <span className="fw-medium">{bus.marca || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-calendar-event text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Ano de Fabricação</small>
                  <span className="fw-medium">{bus.ano_fabricacao || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-people text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Capacidade</small>
                  <span className="fw-medium">{bus.capacidade || "Não informado"}</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-end gap-3">
            <button className="btn btn-outline-danger btn-lg px-4" onClick={() => onDelete(bus.onibus_id)}>
              <i className="bi bi-trash me-2"></i> Excluir
            </button>
            <button className="btn btn-primary btn-lg px-4" onClick={() => onEdit(bus)}>
              <i className="bi bi-pencil-square me-2"></i> Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

BusDetails.propTypes = {
  bus: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BusDetails;
