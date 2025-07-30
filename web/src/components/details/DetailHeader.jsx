import React from 'react';

/**
 * Componente para o cabeçalho das páginas de detalhes
 * Exibe informações principais e badges do objeto
 */
function DetailHeader({ 
  title, 
  subtitle = null,
  icon = "bi-info-circle", 
  badges = [], 
  bgColor = "bg-primary",
  textColor = "text-white"
}) {
  return (
    <div className="card border-0 shadow-sm mb-4 flex-shrink-0">
      <div className={`card-header ${bgColor} ${textColor} py-4`}>
        <div className="d-flex align-items-center">
          <div className="avatar bg-white text-primary rounded-circle me-4 d-flex align-items-center justify-content-center" 
               style={{width: '64px', height: '64px'}}>
            <i className={`bi ${icon} fs-2`}></i>
          </div>
          <div>
            <h3 className="mb-1 fw-bold">{title || "Título não informado"}</h3>
            {(subtitle || badges.length > 0) && (
              <div className="d-flex gap-3 mb-0">
                {subtitle && (
                  <span className="badge bg-light text-primary fs-6">
                    {subtitle}
                  </span>
                )}
                {badges.map((badge, index) => (
                  <span key={index} className="badge bg-light text-primary fs-6">
                    {badge.icon && <i className={`bi ${badge.icon} me-1`}></i>}
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailHeader;
