import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import autoComplete from "@web/api/autocomplete"; // Importa a função de autocomplete


const fetchAutocompleteSuggestions = async (term) => {
  try {
    const response = await autoComplete(term);
    return response;
  } catch (error) {
    console.error("Erro ao buscar sugestões de autocomplete:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

function SuggestionModal({ suggestions, onSuggestionClick, icons }) {
  const itemTypeToText = (v) => {
    const types = {
      "Passenger": "Passageiros",
      "Onibus": "Ônibus",
      "Rota": "Rotas",
      "Ponto": "Pontos",
      "Motorista": "Motoristas",
    };
    return types[v] || `Indefinido: "${v}"`; // Retorna o tipo ou um texto padrão se não encontrado
  }

  return (
    <div className="card position-absolute w-100 mt-2" style={{ top: '100%', zIndex: 1000 }}>
      <ul className="list-group list-group-flush">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => onSuggestionClick(suggestion)}
            style={{ 
              cursor: 'pointer',
              transition: 'color 250ms ease',
              color: 'var(--bs-secondary)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--bs-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--bs-secondary)'}
          >
            <i className={[icons[suggestion.item_type] + " me-2"|| "bi bi-question-diamond-fill me-4"]}></i>
            <b>{suggestion.search_text}</b> em <b>{itemTypeToText(suggestion.item_type)}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}


function SearchBar() {
  const params = useParams(); // Obtém o termo de pesquisa da URL
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(params.searchTerm || ""); // Inicializa o estado com o termo de pesquisa
  const [suggestions, setSuggestions] = useState([]); // Estado para armazenar as sugestões

  const icons = {
    "Passenger": "bi bi-person-check",
    "Onibus": "bi bi-bus-front",
    "Rota": "bi bi-sign-turn-right",  
    "Ponto": "bi bi-geo-alt",
    "Motorista": "bi bi-person-workspace",
  }

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
      setSuggestions([]); // Limpa as sugestões após a pesquisa
      setSearchTerm(""); 
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  } 

  const handleSuggestionClick = (suggestion) => {
    const suggestionText = suggestion.search_text 
    setSearchTerm(suggestionText); // Atualiza o termo de pesquisa com a sugestão clicada
    setSuggestions([]); // Limpa as sugestões após clicar em uma
    navigate(`/search/${suggestionText}`); // Navega para a rota de pesquisa com a sugestão
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
          <i className="fa-solid fa-magnifying-glass search-icon text-primary"></i>
        </button>
      </div>

        {suggestions.length > 0 && (
          <SuggestionModal
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            icons={icons}
          />
        )}

    </form>
    </div>
  )
}

export default SearchBar