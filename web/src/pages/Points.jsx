import { useRef } from "react";
import PopUpComponent from "../components/PopUpComponent";

function PopUpContent() {
  return (
    <div className="p-3 bg-blue">
      <h2>Conteúdo do PopUp</h2>
      <p>Essa é a page dos pontos.</p>
    </div>
  );
}

function Points(){
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  
    return (
      <main>
        <h1>Pontos</h1> 
  
        <button
          onClick={() => {
            popUpRef.current.show(PopUpContent, {}, "PopUp dos pontos"); // Chama a função show do PopUpComponent, sempre 3 parametos
          }}
          className="btn btn-primary"
        >
          Abrir PopUp
        </button>
          
        {/* texto com a cor secundaria */}
        <p className="text-secondary">Texto com a cor secundaria</p> 


  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Points