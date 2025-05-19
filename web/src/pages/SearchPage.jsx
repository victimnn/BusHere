import { useRef } from "react";
import { useParams } from 'react-router-dom';

function Buses(){
    const { searchTerm } = useParams(); // Obtém o termo de pesquisa da URL

    return (
      <main>
        <h1>Pesquisa: {searchTerm}</h1> 
        
        {/* texto com a cor secundaria */}
        <p className="text-secondary">Texto com a cor secundaria</p> 
      </main>
    )
  }

export default Buses