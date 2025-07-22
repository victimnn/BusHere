import { useRef, useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import autoComplete from "../api/autocomplete.js"; // Importa a função de autocomplete

function SearchPage({ pageFunctions }) {
    useEffect(() => {
      pageFunctions.set("Pesquisa", true, true);
    }, [pageFunctions]);

    const { searchTerm } = useParams(); // Obtém o termo de pesquisa da URL

    const [suggestions, setSuggestions] = useState([]); // Estado para armazenar as sugestões

    useEffect(() => {
      async function fetchSugestions(){
        if (!searchTerm) return; 
        setSuggestions([]); // Limpa as sugestões antes de buscar novas
        try {
          const response = await autoComplete(searchTerm); 
          setSuggestions(response); // Atualiza o estado com as sugestões
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
        }
      }
      fetchSugestions(); // Chama a função para buscar sugestões
    }, [searchTerm]); // Executa quando a página é carregada



    return (
      <main className="p-3">
        <h1>Pesquisando: {searchTerm}</h1> 
        <div className="list-group m-2">
          {suggestions.map((term, index) => (
            <SearchLink key={index} term={term} />
          ))}
        </div>
      </main>
    )
}

function SearchLink({ term }) {
  const { search_text, item_type, item_id } = term;

  const itemTypeToLinkHash = {
    "Passenger": "passengers",
    "Onibus": "buses",
    "Rota": "routes",
    "Ponto": "stops",
    "Motorista": "drivers",
  }

  const link = `/${itemTypeToLinkHash[item_type]}/${item_id}`

  const iconHash = {
    "Passenger": "bi bi-person-check",
    "Onibus": "bi bi-bus-front",
    "Rota": "bi bi-sign-turn-right",  
    "Ponto": "bi bi-geo-alt",
    "Motorista": "bi bi-person-workspace",
  }

  const Icon = ()=><i className={`${iconHash[item_type] || "bi bi-question-diamond-fill"} me-2`}></i>;

  return (
    <Link to={link} className="list-group-item list-group-item-action">
      <Icon />{search_text}
    </Link>
  );
}

export default SearchPage;