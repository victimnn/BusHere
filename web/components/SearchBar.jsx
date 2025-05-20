import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

function SearchBar() {
  const params = useParams(); // Obtém o termo de pesquisa da URL
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(params.searchTerm || ""); // Inicializa o estado com o termo de pesquisa

  const handleSearch = (e) => {
    e.preventDefault();  // Evita o comportamento padrão do formulário
    if (searchTerm.trim() !== "") {   
      navigate(`/search/${searchTerm}`); // Navega para a rota de pesquisa com o termo
      setSearchTerm(""); 
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  } 

  
  return (
    <div className="search-bar-container w-100 d-flex justify-content-center">
    <form onSubmit={handleSearch} className="search-form d-flex position-relative w-50 mx-auto">
      <div className="input-group shadow-sm border rounded-pill overflow-hidden">
        <input
          type="text"
          className="form-control border-0 bg-light px-3"
          placeholder="Pesquisar..."
          aria-label="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button 
        className="btn border-start bg-light px-3 d-flex align-items-center" type="submit">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </button>
      </div>
    </form>
    </div>
  )
}

export default SearchBar