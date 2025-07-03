import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de barra de pesquisa para a tabela
 * @param {Object} props - propriedades do componente
 * @param {string} props.searchTerm - termo de pesquisa atual
 * @param {Function} props.onSearchChange - função chamada quando o termo de pesquisa muda
 * @param {string} props.placeholder - placeholder do campo de pesquisa
 * @returns {JSX.Element} componente da barra de pesquisa
 */
function SearchBar({ searchTerm, onSearchChange, placeholder = "Pesquisar..." }) {
  return (
    <div className="search-bar-container d-flex justify-content-end mb-2">
      <div className="search-form d-flex position-relative w-20">
        <div className="input-group shadow-sm border rounded-pill overflow-hidden">
          <input
            type="text"
            className="form-control border-0 bg-light px-3"
            placeholder={placeholder}
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button 
            className="btn border-start bg-light px-3 d-flex align-items-center" 
            type="submit"
          >
            <i className="fa-solid fa-magnifying-glass search-icon text-primary"></i>
          </button>
          {searchTerm && (
            <button 
              className="btn border-start bg-light px-3 d-flex align-items-center" 
              type="button"
              onClick={() => onSearchChange('')}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
