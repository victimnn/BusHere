import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * componente da tabela com funcionalidades de ordenação, paginação e pesquisa
 * @param {Object} props - propriedades do componente
 * @param {Array<Object>} props.headers - array do header da tabela, cada objeto deve conter:
 * @param {Array<Object>} props.data - array de dados a serem exibidos na tabela
 * @param {Number} props.itemsPerPage - itens por página (default 10)
 * @param {boolean} props.searchable - bglh pra add funcionalidade de pesquisa (default true) // 'boolean' minúsculo é mais comum
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
  onRowClick
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // volta pra primeira page quando os dados ou o termo de pesquisa mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  // alterna a direção quando a mesma coluna é clicada novamente
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // usa useMemo para evitar recálculos desnecessários
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // filtra dados com base no termo de pesquisa
    if (searchable && searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        Object.values(item).some(value => 
        String(value).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }

    // ordena dados com base na configuração de ordenação
    if (sortConfig.key) {
    filteredData.sort((a, b) => {
    // Verifica se os valores são números
    if (!isNaN(a[sortConfig.key]) && !isNaN(b[sortConfig.key])) {
      return sortConfig.direction === 'asc' 
        ? Number(a[sortConfig.key]) - Number(b[sortConfig.key])
        : Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
    }
    
    // Para datas (assume formato ISO)
    if (Date.parse(a[sortConfig.key]) && Date.parse(b[sortConfig.key])) {
      return sortConfig.direction === 'asc'
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    }
    
    // Para strings
    const aValue = String(a[sortConfig.key]).toLowerCase();
    const bValue = String(b[sortConfig.key]).toLowerCase();
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
    
    return filteredData;
  }, [data, sortConfig, searchTerm, searchable]);

  // calcula o número total de páginas e a pagina atual
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // mostra a setinha de direcao na coluna certa
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' 
    ? <i className="bi bi-arrow-up text-secondary"></i> 
    : <i className="bi bi-arrow-down text-secondary"></i>;
  };

return (
    <div className="table-responsive ms-3 me-3">
    {/* Search box */}
            {searchable && (
                <div className="search-bar-container d-flex justify-content-end mb-1">
                    <div className="search-form d-flex position-relative w-20">
                        <div className="input-group shadow-sm border rounded-pill overflow-hidden">
                            <input
                                type="text"
                                className="form-control border-0 bg-light px-3"
                                placeholder="Pesquisar..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                                <button 
                                className="btn border-start bg-light px-3 d-flex align-items-center" 
                                type="submit">
                                <i className="fa-solid fa-magnifying-glass search-icon text-primary"></i>
                                </button>
                            {searchTerm && (
                                <button 
                                    className="btn border-start bg-light px-3 d-flex align-items-center" 
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                        )}
                    </div>
                    </div>
                </div>
            )}
            
            {/* Table */}
        <table className={`table table-hover table-striped rounded ${className}`} style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th 
                            key={header.id} 
                            onClick={() => header.sortable && requestSort(header.id)}
                            className={header.sortable ? 'cursor-pointer' : ''}
                        >
                            {header.label}
                            {header.sortable && getSortDirectionIndicator(header.id)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {paginatedData.length > 0 ? (
                    paginatedData.map((row, rowIndex) => (
                        <tr 
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={onRowClick ? 'cursor-pointer' : ''}
                        >
                            {headers.map((header) => (
                                <td key={header.id}>{row[header.id]}</td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length} className="text-center py-4">
                            Sem dados para exibir.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
            <nav aria-label="Table pagination" className='mt-3 d-flex justify-content-end'>
                <ul className="pagination justify-content-center">
                    {/* <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link rounded-start" 
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            Primeiro
                        </button>
                    </li> */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link bg-primary text-white" 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <strong>&lt;</strong>
                        </button>
                    </li>
                    
                    {/* Page indicator */}
                    <li className="page-item">
                        <span className="page-link">
                            {currentPage} de {totalPages}
                        </span>
                    </li>
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link bg-primary text-white" 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <strong>&gt;</strong>
                        </button>
                    </li>
                    {/* <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link rounded-end" 
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            Último
                        </button>
                    </li> */}
                </ul>
            </nav>
        )}
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
  onRowClick: PropTypes.func
};

export default Table;