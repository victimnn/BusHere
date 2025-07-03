import React from 'react';
import PropTypes from 'prop-types';

function DetailCard({ 
  item, 
  onEdit, 
  onDelete, 
  config 
}) {
  if (!item) {
    return (
      <div className="p-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className={`${config.emptyIcon} fs-1 text-muted mb-3`}></i>
            <p className="text-muted">{config.emptyMessage}</p>
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
              <i className={`${config.headerIcon} fs-4`}></i>
            </div>
            <h5 className="mb-0 fw-semibold">{config.title}</h5>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            {config.fields.map((field, index) => (
              <div key={index} className="col-12">
                <div className="detail-item d-flex align-items-center p-2 rounded bg-light">
                  <i className={`${field.icon} text-primary me-3 fs-5`}></i>
                  <div>
                    <small className="text-muted d-block">{field.label}</small>
                    <span className="fw-medium">
                      {field.formatter 
                        ? field.formatter(item[field.key]) 
                        : (item[field.key] || "Não informado")
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-end gap-3">
            <button 
              className="btn btn-outline-danger btn-lg px-4" 
              onClick={() => onDelete(item[config.idField])}
            >
              <i className="bi bi-trash me-2"></i> Excluir
            </button>
            <button 
              className="btn btn-primary btn-lg px-4" 
              onClick={() => onEdit(item)}
            >
              <i className="bi bi-pencil-square me-2"></i> Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DetailCard.propTypes = {
  item: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    headerIcon: PropTypes.string.isRequired,
    emptyIcon: PropTypes.string.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        formatter: PropTypes.func
      })
    ).isRequired
  }).isRequired
};

export default DetailCard;
