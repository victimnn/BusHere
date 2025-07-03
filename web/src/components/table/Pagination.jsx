import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de paginação da tabela
 * @param {Object} props - propriedades do componente
 * @param {number} props.currentPage - página atual
 * @param {number} props.totalPages - total de páginas
 * @param {Function} props.onPageChange - função chamada quando a página muda
 * @returns {JSX.Element} componente de paginação
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Table pagination" className='mt-3 d-flex justify-content-end'>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link bg-primary text-white" 
            onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
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
            onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <strong>&gt;</strong>
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
