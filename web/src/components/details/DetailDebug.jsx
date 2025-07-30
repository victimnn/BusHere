import React from 'react';

/**
 * Componente para exibir informações de debug em desenvolvimento
 * Mostra dados brutos do objeto em formato JSON
 */
function DetailDebug({ 
  data, 
  title = "Dados de Debug (apenas em desenvolvimento)",
  className = ""
}) {
  // Só renderizar em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'development' || !data) {
    return null;
  }

  return (
    <div className={`card border-0 shadow-sm mt-4 flex-shrink-0 ${className}`}>
      <div className="card-header bg-warning text-dark py-2">
        <h6 className="mb-0">
          <i className="bi bi-bug me-2"></i>
          {title}
        </h6>
      </div>
      <div className="card-body">
        <pre 
          className="bg-dark text-light p-3 rounded" 
          style={{fontSize: '0.8rem', overflow: 'auto', maxHeight: '400px'}}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DetailDebug;
