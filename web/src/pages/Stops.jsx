import { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import MapComponent from "../components/MapComponent";
import Table from "../components/Table";
import api from "../api/api";

function MajorStops( { stops = [] } ) {
  return (
    <>
      <StopsContainer 
        stops={stops} 
        
      />
      <div className="d-flex flex-row bg-primary">
          {/* <button className="btn"></button><button className="btn"></button><button className="btn"></button> */}
      </div>
    </>
  );
}

function StopsContainer({ stops }) {
  const formattedStops = stops.map((stop, index) => (
    <StopComponent 
      key={index} 
      name={stop.nome} 
      passengers={Math.ceil(Math.random() * 40)} // Simulando passageiros
      routeAmount={Math.ceil(Math.random() * 10)} // Simulando quantidade de rotas
    />
  ));

  return (
    <div className="d-flex flex-column ml-3 w-100 h-100 bg-secondary-light rounded-4" style={{ overflowY: "scroll"}}>
        {/* <h2> StopsContainer </h2> */}
        {formattedStops.length > 0 ? (
          formattedStops
        ) : (
          <p> sem pontos </p>
        )}
    </div>
  )
}

function StopComponent({ name="", passengers="", routeAmount=""}) {
  return (
    <div className="d-flex flex-row border border-secondary rounded-3 m-1 p-1 align-items-center justify-content-between">
      <h4 className="m-1">{name}</h4>
      <div className="d-flex flex-column align-items-end gap-0">
        <p className="m-0">{passengers} passageiros</p>
        <p className="m-0">{routeAmount} rotas</p>
      </div>
    </div>
  );
}

function Stops(){
    //api.stops.list().then((response) => { console.log(response); });

    const [stops, setStops] = useState([]); 

    const fetchStops = async () => {
      /*{
        "ponto_id": 1,
        "nome": "Terminal Central",
        "latitude": "-22.90680000",
        "longitude": "-47.06260000",
        "logradouro": "Av. Andrade Neves",
        "numero_endereco": "200",
        "bairro": "Centro",
        "cidade": "Campinas",
        "uf": "SP",
        "cep": "13013-161",
        "referencia": "Terminal de ônibus central da cidade",
        "criacao": "2025-06-12T23:33:30.000Z",
        "atualizacao": "2025-06-12T23:33:30.000Z",
        "ativo": 1
      }*/

      try {
        const response = await api.stops.list(); 
        setStops(response); 
        console.log("Pontos buscados:", response); 

        const newMarkers = response.map(stop => ({
          position: [parseFloat(stop.latitude), parseFloat(stop.longitude)],
          popupContent: (
            <div className="gap-0">
              <h4>{stop.nome}</h4>
              <p>Endereço: {stop.logradouro}, {stop.numero_endereco} - {stop.bairro}, {stop.cidade} - {stop.uf}</p>
              <p>CEP: {stop.cep}</p>
              <p>Referência: {stop.referencia ?? "Nenhuma"}</p>
            </div>
          ),
          color: 'blue', // Cor do ícone
          size: 32, // Tamanho do ícone
          id: stop.ponto_id // ID único para o marcador
        }));
        setMarkers(newMarkers); // Atualiza os marcadores com os pontos buscados
        setMapCenter(newMarkers.length > 0 ? newMarkers[0].position : [-22.698, -47.009]); // Centraliza o mapa no primeiro ponto ou em um valor padrão


          

      } catch (error) {
        console.error("Erro ao buscar pontos:", error); 
      }
    };

    useEffect(() => {
      fetchStops(); 
    }, []);




    const [markers, setMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);
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
    
    

    const tableData = stops.map((stop) => ({
      id: stop.ponto_id,
      name: stop.nome,
      cep: stop.cep,
      coordinates: `${Number(stop.latitude).toFixed(4)}, ${Number(stop.longitude).toFixed(4)}`,
      routesView: "Rotas",
      address: `${stop.logradouro}, ${stop.numero_endereco} - ${stop.bairro}, ${stop.cidade} - ${stop.uf}`,
      status: stop.ativo ? "Ativo" : "Inativo"
    }));


    const handleRowClick = (rowData) => {
      // Exemplo de ação ao clicar na linha da tabela
      console.log("Você clicou na linha:",rowData);
      
      const marker = markers.find(m => m.id === rowData.id);
      if (marker) {
        popUpRef.current.show(() => marker.popupContent, {}, "Parada Detalhes");
      } else {
        console.error("Marcador não encontrado para a parada clicada:", rowData.id);
      }
    }

    const handleMapClick = (latlng) => {
      //alert(`Você clicou em: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    

      const Component = (
        <div>
          <p>latitude: {latlng.lat}</p>
          <p>longitude: {latlng.lng}</p>
        </div>
      );
      popUpRef.current.show(()=>Component, {}, "Nova Parada");
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

          <MajorStops 
            stops={stops}
          />
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