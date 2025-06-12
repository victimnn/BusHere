import { useRef, useState } from "react";
import PopUpComponent from "../components/PopUpComponent";
import MapComponent from "../components/MapComponent";

function MajorStops() {
  return (
    <>
      <StopsContainer />
      <div className="d-flex flex-row bg-primary">
          {/* <button className="btn"></button><button className="btn"></button><button className="btn"></button> */}
      </div>
    </>
  );
}

function StopsContainer({ stops }) {
  return (
    <div className="d-flex flex-column ml-3 w-100 h-100 bg-secondary-light rounded-4" style={{ overflowY: "scroll"}}>
        {/* <h2> StopsContainer </h2> */}

        <StopComponent />
        <StopComponent />
        <StopComponent />
        <StopComponent />
        <StopComponent />
        <StopComponent />
        <StopComponent />
        <StopComponent />
    </div>
  )
}
function StopComponent({ name, passengers, routeAmount}) {
  name = "teste"
  passengers = Math.ceil(Math.random()*40)
  routeAmount = Math.ceil(Math.random()*10)
  return (
    <div className="d-flex flex-row border border-secondary rounded-3 m-1 p-1 align-items-center justify-content-between">
      <h4 className="m-1">{name}</h4>
      <div className="d-flex flex-column align-items-center gap-0">
        <p className="m-0">{passengers}</p>
        <p className="m-0">{routeAmount}</p>
      </div>
    </div>
  );
}

function Stops(){
    //TODO(): Isso é para teste
    const [markers, setMarkers] = useState([{ position: [-22.698, -47.009], popupContent: (<PopUpComponent/>), color: 'red', size: 32 }]);

    const [polylines, setPolylines] = useState([{ positions: [[-22.698, -47.009], [-22.700, -47.010]], color: 'blue' }]);
    const [mapCenter, setMapCenter] = useState([-22.698, -47.009]);


    const handleMapClick = (latlng) => {
      alert(`Você clicou em: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    }

    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  
    return (
      <main style={{ height: '100vh', maxWidth: "100%", overflowX: 'hidden' }} className="d-flex flex-column">
        <div className="d-flex flex-row m-3 w-100 h-50 gap-4" style={{ overflowY: 'hidden', /*background:"red",*/ maxHeight: '30%' }}>
          <MapComponent 
            className="w-100 h-100 rounded-3"
            center={mapCenter}
            zoom={13}
            markers={markers}
            polylines={polylines}
            onMapClick={handleMapClick} // Passa a função de clique no mapa
          />

          <MajorStops />
        </div>
        

        
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Stops