import React from 'react';

/**
 * Componente base para páginas de detalhes
 * Fornece uma estrutura consistente e reutilizável
 */
function DetailPage({ 
  children, 
  loading = false, 
  error = null, 
  onRetry = null,
  className = "" 
}) {
  if (loading) {
    return (
      <main className='p-3 h-100 d-flex flex-column'>
        <div className="flex-grow-1 d-flex flex-column">
          <CenteredCard>
            <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h5 className="text-muted mb-2">Carregando detalhes...</h5>
            <p className="text-muted mb-0">Aguarde enquanto buscamos as informações.</p>
          </CenteredCard>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='p-3 h-100 d-flex flex-column'>
        <div className="flex-grow-1 d-flex flex-column">
          <CenteredCard>
            <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
            <h5 className="text-muted">Erro ao carregar dados</h5>
            <p className="text-muted mb-3">{error}</p>
            {onRetry && (
              <button className="btn btn-primary" onClick={onRetry}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Tentar novamente
              </button>
            )}
          </CenteredCard>
        </div>
      </main>
    );
  }

  return (
    <main className={`p-3 h-100 d-flex flex-column ${className}`}>
      <div className="flex-grow-1 d-flex flex-column">
        {children}
      </div>
    </main>
  );
}

/**
 * Componente para cards centralizados (loading, error, empty states)
 */
export const CenteredCard = ({ children, className = "" }) => (
  <div className={`container-fluid mt-4 h-100 ${className}`}>
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column justify-content-center align-items-center">
        {children}
      </div>
    </div>
  </div>
);

export default DetailPage;
