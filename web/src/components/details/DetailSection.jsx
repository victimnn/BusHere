import React from 'react';

/**
 * Componente para seções de detalhes
 * Agrupa informações relacionadas em cards organizados
 */
function DetailSection({ 
  title, 
  icon = "bi-info-circle", 
  children, 
  className = "",
  headerBg = "bg-light"
}) {
  return (
    <div className={`card border-0 shadow-sm w-100 ${className}`}>
      <div className={`card-header ${headerBg} py-3`}>
        <h5 className="mb-0 fw-semibold">
          <i className={`bi ${icon} text-primary me-2`}></i>
          {title}
        </h5>
      </div>
      <div className="card-body flex-grow-1">
        <div className="row g-3 h-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DetailSection;
