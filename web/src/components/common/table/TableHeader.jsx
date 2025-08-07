import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente do cabeçalho da tabela
 * @param {Object} props - propriedades do componente
 * @param {Array<Object>} props.headers - array do header da tabela
 * @param {Object} props.sortConfig - configuração de ordenação atual
 * @param {Function} props.onSort - função chamada quando uma coluna é clicada para ordenação
 * @returns {JSX.Element} componente do cabeçalho da tabela
 */
function TableHeader({ headers, sortConfig, onSort }) {
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return '';

    if (sortConfig.direction === "asc") {
      return <i className="bi bi-arrow-up text-secondary"></i>;
    } else {
      return <i className="bi bi-arrow-down text-secondary"></i>;
    }
  };

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th 
            key={header.id} 
            onClick={() => header.sortable && onSort(header.id)}
            className={header.sortable ? 'cursor-pointer' : ''}
          >
            {header.label}
            {header.sortable && getSortDirectionIndicator(header.id)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

TableHeader.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool
  })).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string
  }).isRequired,
  onSort: PropTypes.func.isRequired,
};

export default TableHeader;
