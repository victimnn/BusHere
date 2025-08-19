import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import autoComplete from "@web/api/autocomplete"; // Importa a função de autocomplete


const fetchAutocompleteSuggestions = async (term) => {
  try {
    console.log('🔍 [SEARCHBAR] Buscando sugestões para:', term);
    const response = await autoComplete(term);
    console.log('✅ [SEARCHBAR] Sugestões recebidas:', response);
    return response;
  } catch (error) {
    console.error("❌ [SEARCHBAR] Erro ao buscar sugestões de autocomplete:", error);
    console.error("❌ [SEARCHBAR] Status do erro:", error.status);
    console.error("❌ [SEARCHBAR] Dados do erro:", error.data);
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
    <div className="search-results position-absolute w-100 mt-2" style={{ top: '100%', zIndex: 1000 }}>
      <ul className="list-group">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="list-group-item"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <i className={icons[suggestion.item_type] || "bi bi-question-diamond-fill"}></i>
            <span><b>{suggestion.search_text}</b> em <b>{itemTypeToText(suggestion.item_type)}</b></span>
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
  const searchBarRef = useRef(null); // Ref para referenciar o container da SearchBar

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

  // Efeito para detectar cliques fora da SearchBar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSuggestions([]); // Esconde as sugestões quando clicar fora
      }
    };

    // Adiciona o event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Função de limpeza
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Este efeito só roda uma vez ao montar o componente

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
    <form onSubmit={handleSearch} className="search-form d-flex position-relative w-50 mx-auto" ref={searchBarRef}>
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