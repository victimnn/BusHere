import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import autoComplete from '../src/api/autocomplete';

const fetchAutocompleteSuggestions = async (term) => {
  try {
    const response = await autoComplete(term);
    return response;
  } catch (error) {
    console.error("Erro ao buscar sugestões de autocomplete:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

function SearchBar() {
  const params = useParams(); // Obtém o termo de pesquisa da URL
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(params.searchTerm || ""); // Inicializa o estado com o termo de pesquisa
  const [suggestions, setSuggestions] = useState([]); // Estado para armazenar as sugestões


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function getSuggestions() {
        if (!searchTerm || searchTerm.trim().length <= 2) {
          setSuggestions([]);
          return;
        }
        try {
          const response = await fetchAutocompleteSuggestions(searchTerm);
          setSuggestions(response);
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
          setSuggestions([]); 
        }
      }
      getSuggestions(); // Chama a função assíncrona imediatamente
    }, 300); 

    // Função de limpeza para cancelar o timer se o searchTerm mudar antes do atraso
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // O efeito é re-executado sempre que 'searchTerm' muda

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
        <p>{JSON.stringify(suggestions)}</p>
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