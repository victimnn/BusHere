import React from 'react';
import PropTypes from 'prop-types';
import TableCell from './TableCell';

/**
 * Componente de linha da tabela
 * @param {Object} props - propriedades do componente
 * @param {Object} props.row - dados da linha
 * @param {Array<Object>} props.headers - array do header da tabela
 * @param {Function} props.onRowClick - função chamada quando a linha é clicada
 * @param {Object} props.popUpRef - referência para o popup
 * @returns {JSX.Element} componente da linha da tabela
 */
function TableRow({ row, headers, onRowClick, popUpRef }) {
  return (
    <tr 
      onClick={() => onRowClick && onRowClick(row)}
      className={onRowClick ? 'cursor-pointer' : ''}
    >
      {headers.map((header) => (
        <TableCell
          key={header.id}
          value={row[header.id]}
          header={header}
          popUpRef={popUpRef}
        />
      ))}
    </tr>
  );
}

TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool
  })).isRequired,
  onRowClick: PropTypes.func,
  popUpRef: PropTypes.object,
};

export default TableRow;
