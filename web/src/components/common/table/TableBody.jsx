import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

/**
 * Componente do corpo da tabela
 * @param {Object} props - propriedades do componente
 * @param {Array<Object>} props.data - dados a serem exibidos
 * @param {Array<Object>} props.headers - array do header da tabela
 * @param {Function} props.onRowClick - função chamada quando uma linha é clicada
 * @param {Object} props.popUpRef - referência para o popup
 * @returns {JSX.Element} componente do corpo da tabela
 */
function TableBody({ data, headers, onRowClick, popUpRef }) {
  if (data.length === 0) {
    return (
      <tbody className="table-group-divider">
        <tr>
          <td colSpan={headers.length} className="text-center py-4">
            Sem dados para exibir.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="table-group-divider">
      {data.map((row, rowIndex) => (
        <TableRow
          key={rowIndex}
          row={row}
          headers={headers}
          onRowClick={onRowClick}
          popUpRef={popUpRef}
        />
      ))}
    </tbody>
  );
}

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool
  })).isRequired,
  onRowClick: PropTypes.func,
  popUpRef: PropTypes.object,
};

export default TableBody;
