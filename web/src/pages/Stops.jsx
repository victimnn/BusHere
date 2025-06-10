import { useRef, useState } from "react";
import PopUpComponent from "../components/PopUpComponent";
import MapComponent from "../components/MapComponent";

function PopUpContent() {
  return (
    <div>
      <h2>Conteúdo do PopUp</h2>
      <p>Este é o conteúdo do PopUp.</p>
    </div>
  );
}

function Stops(){
    //TODO(): Isso é para teste
    const [size, setSize] = useState(32); // Estado para o tamanho do ícone
    const handleMapClick = (latlng) => {
      alert(`Você clicou em: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    }

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
        
        <MapComponent 
          className="w-100 h-100 rounded-3"
          center={[-22.698, -47.009]}
          zoom={13}
          markers={[{ position: [-22.698, -47.009], popupContent: (<PopUpComponent/>), color: 'red', size: size }]}
          polylines={[{ positions: [[-22.698, -47.009], [-22.700, -47.010]], color: 'blue' }]}
          onMapClick={handleMapClick} // Passa a função de clique no mapa
        />
        
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Stops