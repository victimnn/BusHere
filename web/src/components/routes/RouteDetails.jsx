import React from 'react';
import PropTypes from 'prop-types';

function RouteDetails({ route, onEdit, onDelete }) {
  if (!route) {
    return (
      <div className="p-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-signpost-split-fill fs-1 text-muted mb-3"></i>
            <p className="text-muted">Nenhuma rota selecionada</p>
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
              <i className="bi bi-signpost-split-fill fs-4"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Detalhes da Rota</h5>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-info-circle text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Nome</small>
                  <span className="fw-medium">{route.nome || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-upc text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Código da Rota</small>
                  <span className="fw-medium">{route.codigo_rota || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-geo-alt text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Origem</small>
                  <span className="fw-medium">{route.origem_descricao || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-geo-alt-fill text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Destino</small>
                  <span className="fw-medium">{route.destino_descricao || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-rulers text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Distância (km)</small>
                  <span className="fw-medium">{route.distancia_km || "Não informado"}</span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                <i className="bi bi-clock text-primary me-3 fs-5"></i>
                <div>
                  <small className="text-muted d-block">Tempo de Viagem (min)</small>
                  <span className="fw-medium">{route.tempo_viagem_estimado_minutos || "Não informado"}</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-end gap-3">
            <button className="btn btn-outline-danger btn-lg px-4" onClick={() => onDelete(route.rota_id)}>
              <i className="bi bi-trash me-2"></i> Excluir
            </button>
            <button className="btn btn-primary btn-lg px-4" onClick={() => onEdit(route)}>
              <i className="bi bi-pencil-square me-2"></i> Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

RouteDetails.propTypes = {
  route: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RouteDetails;
