import { useRef, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import autoComplete from "../api/autocomplete.js"; // Importa a função de autocomplete

function SearchPages({ pageFunctions }) {
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

    pageFunctions.set("Pesquisa", true, true);

    return (
      <main>
        <h1>Pesquisa: {searchTerm}</h1> 
        
        {/* texto com a cor secundaria */}
        <p className="text-secondary">Texto com a cor secundaria</p> 
        <p className="text-primary">{JSON.stringify(suggestions ?? "tem nada", 2) }</p>

      </main>
    )
  }

export default SearchPages;