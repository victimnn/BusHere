import { useRef, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";



function Settings({ pageFunctions }) {
  useEffect(() => {
    pageFunctions.set("Configurações", true, true);
  }, [pageFunctions]);
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent

  return (
    <main>
      <h1>Configuracoes</h1> 

      <button
        onClick={() => {
          //pageFunctions.setPageName("Novo nome da pagina "+ Math.random().toFixed(2));
          pageFunctions.toggleShowHeader();
        }}
        className="btn btn-primary"
      >
        Mudar o nome da pagina
      </button>
        
      {/* texto com a cor secundaria */}
      <p className="text-secondary">Texto com a cor secundaria</p> 

      {/* por enquanto printa o .env inteiro */}
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
      {/* Componente PopUpComponent */}

      <PopUpComponent 
        ref={popUpRef}
      />
    </main>
  )
}

export default Settings