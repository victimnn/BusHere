import { useRef, useState } from "react";
import PopUpComponent from "../components/PopUpComponent";
import MapComponent from "../components/MapComponent";
import Table from "../components/Table";

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

function StopComponent({ name="", passengers="", routeAmount=""}) {
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

    const popUpRef = useRef(null); // Referência para o componente PopUpComponent

    function Test(){
      return (
        <button className="btn btn-primary" onClick={() => {
          popUpRef.current.show(()=>(<h2> aaa </h2>), {} , "success");
        }}>
          g
        </button>
      );
    }

    //id,nome,cep,cordenadas,rotas,endereco,status
    const tableHeaders = [
      {id: "id",label: "ID", sortable: true},
      {id: "name", label: "Nome", sortable: true},
      {id: "cep", label: "CEP", sortable: false},
      {id: "coordinates", label: "Cordenadas", sortable: false},
      {id: "routesView", label: "Rotas", sortable: false}, 
      {id: "address", label: "Endereço", sortable: false},
      {id: "status", label: "Status", sortable: true}
    ]
  
    const tableData = [
      { id: 1, name: "Ponto A", cep: "12345-678", coordinates: "[-22.698, -47.009]", routesView: "Rota 1, Rota 2", address: "Rua A, 123", status: "Ativo" },
      { id: 2, name: "Ponto B", cep: "23456-789", coordinates: "[-22.700, -47.010]", routesView: "Rota 3", address: "Rua B, 456", status: "Inativo" },
      { id: 3, name: "Ponto C", cep: "34567-890", coordinates: "[-22.702, -47.012]", routesView: "Rota 4, Rota 5", address: "Rua C, 789", status: "Ativo" },
    ]

    const handleRowClick = (rowData) => {
      // Exemplo de ação ao clicar na linha da tabela
      console.log("Você clicou na linha:",rowData);
    }

    const handleMapClick = (latlng) => {
      alert(`Você clicou em: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    }

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
        

        <Table 
          headers={tableHeaders}
          data={tableData}
          itemsPerPage={5}
          searchable={true}
          className="table-striped table-hover"
          onRowClick={handleRowClick}
        />

        <Test />
        
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Stops