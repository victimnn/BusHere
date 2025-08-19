import { useRef, useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import autoComplete from "../api/autocomplete"; // Importa a função de autocomplete

function SearchPage({ pageFunctions }) {
    const { searchTerm } = useParams(); // Obtém o termo de pesquisa da URL
    
    useEffect(() => {
      pageFunctions.set(`Pesquisando: "${searchTerm}"`, true, true);
    }, [pageFunctions, searchTerm]);

    const [suggestions, setSuggestions] = useState([]); // Estado para armazenar as sugestões
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function fetchSugestions(){
        if (!searchTerm) return; 
        
        console.log('🔍 [SEARCHPAGE] Iniciando busca para:', searchTerm);
        setIsLoading(true);
        setError(null);
        setSuggestions([]); // Limpa as sugestões antes de buscar novas
        
        try {
          const response = await autoComplete(searchTerm); 
          console.log('✅ [SEARCHPAGE] Resposta da API:', response);
          setSuggestions(response); // Atualiza o estado com as sugestões
        } catch (error) {
          console.error("❌ [SEARCHPAGE] Erro ao buscar sugestões:", error);
          console.error("❌ [SEARCHPAGE] Status do erro:", error.status);
          console.error("❌ [SEARCHPAGE] Dados do erro:", error.data);
          
          let errorMessage = "Erro ao buscar resultados. Tente novamente.";
          if (error.status === 404) {
            errorMessage = "Endpoint de pesquisa não encontrado. Verifique se a API está funcionando.";
          } else if (error.status === 500) {
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
          } else if (error.status === 0) {
            errorMessage = "Não foi possível conectar com a API. Verifique sua conexão.";
          }
          
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
      fetchSugestions(); // Chama a função para buscar sugestões
    }, [searchTerm]); // Executa quando a página é carregada

    return (
      <main className="search-page">
        <h1>Resultados da Pesquisa</h1> 
        
        {isLoading && (
          <div className="search-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Buscando...</span>
            </div>
            <p>Buscando resultados...</p>
          </div>
        )}
        
        {error && (
          <div className="search-error">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle"></i>
              {error}
            </div>
          </div>
        )}
        
        {!isLoading && !error && suggestions.length === 0 && searchTerm && (
          <div className="search-empty">
            <i className="bi bi-search"></i>
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente usar termos diferentes ou verifique a ortografia.</p>
          </div>
        )}
        
        {!isLoading && !error && suggestions.length > 0 && (
          <div className="search-results">
            <div className="list-group">
              {suggestions.map((term, index) => (
                <SearchLink key={index} term={term} />
              ))}
            </div>
          </div>
        )}
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