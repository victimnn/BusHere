import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../table/SearchBar';
import TableHeader from '../table/TableHeader';
import TableBody from '../table/TableBody';
import Pagination from '../table/Pagination';
import { useTable } from '../table/useTable';

/**
 * componente da tabela com funcionalidades de ordenação, paginação e pesquisa
 * @param {Object} props - propriedades do componente
 * @param {Array<Object>} props.headers - array do header da tabela, cada objeto deve conter:
 * @param {Array<Object>} props.data - array de dados a serem exibidos na tabela
 * @param {Number} props.itemsPerPage - itens por página (default 10)
 * @param {boolean} props.searchable - bglh pra add funcionalidade de pesquisa (default true)
 * @param {String} props.className - add class css pra estilizar a tabela
 * @param {Function} props.onRowClick - função chamada quando uma linha é clicada, recebe o objeto da linha como parâmetro
 * @returns {JSX.Element} componente da tabela renderizado
 */
function Table({
  headers, 
  data, 
  itemsPerPage = 10, 
  searchable = true,
  className = '',
  onRowClick,
  popUpRef = null,
}) {
  const {
    sortConfig,
    currentPage,
    searchTerm,
    totalPages,
    paginatedData,
    requestSort,
    setCurrentPage,
    setSearchTerm,
  } = useTable(data, itemsPerPage, searchable);


  return (
    <div className="table-responsive ms-3 me-3">
      {/* Search box */}
      {searchable && (
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Pesquisar..."
        />
      )}
      
      {/* Table */}
      <table className={`table table-hover table-striped rounded ${className}`} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <TableHeader
          headers={headers}
          sortConfig={sortConfig}
          onSort={requestSort}
        />
        <TableBody
          data={paginatedData}
          headers={headers}
          onRowClick={onRowClick}
          popUpRef={popUpRef}
        />
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool
  })).isRequired,
  data: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  onRowClick: PropTypes.func,
  popUpRef: PropTypes.object,
};

export default Table;