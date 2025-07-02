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


/**
 * Retorna uma cor de ícone baseada em algum valor
 * @param {string} str - Valor baseado no qual a cor do ícone será determinada
 * @return {string} - Retorna uma cor em formato hexadecimal ou nome de cor
 */
function getColorBasedOnValue(str) {
  console.log("getColorBasedOnValue called with:", str, typeof str);
  if (typeof str !== "string" || !str) {
    return "red"; 
  }

  if (IconColorCache.has(str)) {
    return IconColorCache.get(str); // Retorna a cor do cache
  }

  const hash = Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = (hash**7) % 360 ; // Gera um valor de matiz baseado no hash
  return `hsl(${hue}, 100%, 50%)`; // Retorna uma cor HSL
} const IconColorCache = new Map();


/** 
* Função para sincronizar os marcadores com os pontos buscados
* @param {Array} stops - Array de objetos representando os pontos
* @param {Function} setMarkers - Função para atualizar o estado dos marcadores
* @returns {Array} - Retorna um novo array de marcadores formatados
*/
function sincronizeMarkers(stops, setMarkers){
  const newMarkers = stops.map(stop => ({
    position: [parseFloat(stop.latitude), parseFloat(stop.longitude)],
    popupContent: (
      <div className="gap-0">
        <h4>{stop.nome}</h4>
        <p>Endereço: {stop.logradouro}, {stop.numero_endereco} - {stop.bairro}, {stop.cidade} - {stop.uf}</p>
        <p>CEP: {stop.cep}</p>
        <p>Referência: {stop.referencia ?? "Nenhuma"}</p>
      </div>
    ),
    color: getColorBasedOnValue(String(stop.latitude) + String(stop.longitude)), 
    size: 32,
    id: stop.ponto_id // ID único para o marcador
  }));
  setMarkers(newMarkers); // Atualiza os marcadores com os pontos buscados
  return newMarkers; // Retorna os novos marcadores
}

function Stops({ pageFunctions }) {
  pageFunctions.set("Paradas", true, true);

  const [stops, setStops] = useState([]); 
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [mapCenter, setMapCenter] = useState([-22.698, -47.009]);
  const [zoom, setZoom] = useState(13); 

  const popUpRef = useRef(null); // Referência para o componente PopUpComponent

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

    const fetchStops = async () => {
    {
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
    }
    try {
      const response = await api.stops.list(); 
      setStops(response); 
      console.log("Pontos buscados:", response); 
      const newMarkers = sincronizeMarkers(response, setMarkers);
      // Centraliza o mapa calculando a média das coordenadas dos pontos
      console.log("centralizando mapa com", newMarkers.length, "marcadores");
      const avgX = newMarkers.reduce((sum, marker) => sum + marker.position[0], 0) / newMarkers.length;
      const avgY = newMarkers.reduce((sum, marker) => sum + marker.position[1], 0) / newMarkers.length;
      console.log("Média das coordenadas:", avgX, avgY);
      setMapCenter(newMarkers.length > 0 ? [avgX, avgY] : [-22.698, -47.009]);
    } catch (error) {
      console.error("Erro ao buscar pontos:", error); 
    }
  };

  useEffect(() => {
    fetchStops(); 
  }, [mapReady]); // só busca/move quando o mapa estiver pronto


  const handleRowClick = (rowData) => {
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
          zoom={zoom}
          markers={markers}
          polylines={polylines}
          onMapClick={handleMapClick} 
          handleZoomChange={(e) => {console.log("Zoom alterado para:", e.target._zoom); setZoom(e.target._zoom);}}
          ref={mapRef}
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

      <button
        onClick={()=>{
          mapRef.current?.moveMap(0, 0, zoom); // Move o mapa para 0:0 com o zoom atual
          popUpRef.current.show(() => <p>Mapa movido para 0:0</p>, {}, "Mapa Movido");
        }}
      >
        mover mapa para 0:0
      </button>

      <PopUpComponent 
        ref={popUpRef}
      />
    </main>
  )
}

export default Stops