import React from 'react';

/**
 * Componente para itens individuais de detalhe
 * Exibe um campo de informação com ícone, label e valor
 */
function DetailItem({ 
  icon = "bi-info-circle", 
  label, 
  value, 
  formatter = null,
  size = "col-12",
  bg = "bg-light"
}) {
  // Função para formatar com valor padrão
  const formatWithDefault = (value, formatter) => {
    if (!value) return "Não informado";
    return formatter ? formatter(value) : value;
  };

  return (
    <div className={size}>
      <div className={`detail-item d-flex align-items-center p-3 rounded ${bg}`}>
        <i className={`bi ${icon} text-primary me-3 fs-5`}></i>
        <div>
          <small className="text-muted d-block">{label}</small>
          <span className="fw-medium">
            {formatWithDefault(value, formatter)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailItem;
