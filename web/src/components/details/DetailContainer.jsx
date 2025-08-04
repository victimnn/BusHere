import React from 'react';

/**
 * Componente container para organizar o layout das páginas de detalhes
 * Fornece estrutura flexível para diferentes números de seções
 */
function DetailContainer({ 
  children, 
  columns = 2,
  className = ""
}) {
  // Determinar classes do grid baseado no número de colunas
  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-md-6';
      case 3:
        return 'col-lg-4';
      case 4:
        return 'col-xl-3';
      default:
        return 'col-md-6';
    }
  };

  return (
    <div className={`container-fluid detail-page h-100 d-flex flex-column ${className}`}>
      <div className="row g-4 flex-grow-1">
        {React.Children.map(children, (child, index) => {
          // Se o child é um DetailSection, envolvê-lo com col
          if (child && child.type && child.type.name === 'DetailSection') {
            return (
              <div key={index} className={getColumnClass()}>
                {child}
              </div>
            );
          }
          // Para outros componentes, retornar como está
          return child;
        })}
      </div>
    </div>
  );
}

export default DetailContainer;
