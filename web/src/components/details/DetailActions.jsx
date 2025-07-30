import React from 'react';

/**
 * Componente para ações da página de detalhes
 * Fornece botões de ação consistentes
 */
function DetailActions({ 
  title = "Ações", 
  description = "Ações disponíveis para este item",
  actions = [],
  className = ""
}) {
  if (!actions.length) return null;

  return (
    <div className={`card border-0 shadow-sm mt-4 flex-shrink-0 ${className}`}>
      <div className="card-body py-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1 fw-semibold">{title}</h6>
            <small className="text-muted">{description}</small>
          </div>
          <div className="d-flex gap-3">
            {actions.map((action, index) => (
              <button 
                key={index}
                className={`btn ${action.variant || 'btn-primary'} btn-lg px-4`}
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.tooltip}
              >
                {action.icon && <i className={`bi ${action.icon} me-2`}></i>}
                {action.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailActions;
