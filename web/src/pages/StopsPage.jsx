import { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import StopDetails from "../components/stops/StopDetails";
import StopForm from "../components/stops/StopForm";
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
function sincronizeMarkers(stops, setMarkers, popUpRef, onDelete = null, onEdit = null) {
  const newMarkers = stops.map(stop => ({
    position: [parseFloat(stop.latitude), parseFloat(stop.longitude)],
    popupContent: 
      <MarkerPopUpContent 
        stop={stop} 
        popUpRef={popUpRef} 
        onDelete={onDelete}
        onEdit={onEdit} 
      />, 
    color: stop.ativo ? getColorBasedOnValue(String(stop.latitude) + String(stop.longitude)) : "gray", // Cor baseada na latitude e longitude, ou cinza se inativo
    size: 32,
    id: stop.ponto_id // ID único para o marcador
  }));
  setMarkers(newMarkers); // Atualiza os marcadores com os pontos buscados
  return newMarkers; // Retorna os novos marcadores
}

function EditStop({ stop, onEdit, onDelete }) {
  const [fieldsArr, setFieldsArr] = useState([
    { id: "nome", label: "Nome", type: "text", value: stop.nome, required: true, wasEdited: false },
    { id: "logradouro", label: "Logradouro", type: "text", value: stop.logradouro, required: false, wasEdited: false },
    { id: "numero_endereco", label: "Número do Endereço", type: "text", value: stop.numero_endereco, required: false, wasEdited: false },
    { id: "bairro", label: "Bairro", type: "text", value: stop.bairro, required: false, wasEdited: false },
    { id: "cidade", label: "Cidade", type: "text", value: stop.cidade, required: false, wasEdited: false },
    { id: "uf", label: "UF", type: "text", value: stop.uf, required: false, wasEdited: false },
    { id: "cep", label: "CEP", type: "text", value: stop.cep, required: false, wasEdited: false },
    { id: "referencia", label: "Referência", type: "text", value: stop.referencia ?? "", required: false, wasEdited: false }
  ])

  const handleInputChange = (id, value) => {
    setFieldsArr(prevFields => 
      prevFields.map(field => 
        field.id === id ? { ...field, value, wasEdited: true } : field
      )
    );
  }

  const handleUpdate= () => {
    const edits = {};
    fieldsArr.forEach(field => {
      if (field.wasEdited) {
        edits[field.id] = field.value;
      }
    });

    if (Object.keys(edits).length === 0) {
      alert("Nenhum campo foi editado.");
      return;
    }

    if (onEdit) {
      onEdit(stop.ponto_id, edits);
    } else {
      alert("Função de edição não implementada");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(stop.ponto_id);
    } else {
      alert("Função de exclusão não implementada");
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <h3>Editar Parada: {stop.nome}</h3>
      {fieldsArr.map((field) => (
        <div key={field.id} className="form-group">
          <label htmlFor={field.id}>{field.label}</label>
          <input
            type={field.type}
            className="form-control"
            id={field.id}
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        </div>
      ))}
      <button className="btn btn-success"
        onClick={handleUpdate}
      >
        Atualizar
      </button>

      <button className="btn btn-primary" 
        onClick={handleDelete}
      >
        Apagar
      </button>
    </div>
  )
}

function MarkerPopUpContent({ stop, popUpRef, onDelete, onEdit }) {
  return (
    <div className="gap-0">
      <h4>{stop.nome}</h4>
      <p>Endereço: {stop.logradouro}, {stop.numero_endereco} - {stop.bairro}, {stop.cidade} - {stop.uf}</p>
      <p>CEP: {stop.cep}</p>
      <p>Referência: {stop.referencia ?? "Nenhuma"}</p>

      <button className="btn btn-primary mt-2"
        onClick={() => {
          if (popUpRef && popUpRef.current) {
            popUpRef.current.show(
              () => <EditStop stop={stop} onDelete={onDelete} onEdit={onEdit}/>, 
              {}, 
              `Editar Parada: ${stop.nome}`
            );
          } else {
            console.error("PopUpComponent não está definido ou não possui a referência correta.");
          }
        }}
      >
        Detalhes
      </button>
    </div>
  );
}

function Stops({ pageFunctions }) {
  pageFunctions.set("Paradas", true, true);

  const [stops, setStops] = useState([]); 
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [mapCenter, setMapCenter] = useState([-22.698, -47.009]);
  const [zoom, setZoom] = useState(13); 

  const popUpRef = useRef(null); // Referência para o componente PopUpComponent

  const handleDeleteStop = async (id) => {
    try {
      await api.stops.delete(id); // Chama a API para deletar o ponto
      fetchStops(); // Recarrega os pontos após a exclusão (é pior para performance, porem já atualza o estado mais vezes)
      console.log(`Ponto com ID ${id} deletado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao deletar ponto com ID ${id}:`, error);  
      alert(`Erro ao deletar ponto: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleEditStop = async (id, edits) => {
    try {
      const response = await api.stops.update(id, edits); // Chama a API para atualizar o ponto
      console.log(`Ponto com ID ${id} atualizado com sucesso:`, response);
      fetchStops(); // Recarrega os pontos após a atualização
    } catch (error) {
      console.error(`Erro ao atualizar ponto com ID ${id}:`, error);
      alert(`Erro ao atualizar ponto: ${error.message || "Erro desconhecido"}`);
    }
  };

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
      const newMarkers = sincronizeMarkers(response, setMarkers, popUpRef, handleDeleteStop, handleEditStop);
      /* Função que não funciona
        TODO(): arrumar a centralização do mapa
        // Centraliza o mapa calculando a média das coordenadas dos pontos
        console.log("centralizando mapa com", newMarkers.length, "marcadores");
        const avgX = newMarkers.reduce((sum, marker) => sum + marker.position[0], 0) / newMarkers.length;
        const avgY = newMarkers.reduce((sum, marker) => sum + marker.position[1], 0) / newMarkers.length;
        console.log("Média das coordenadas:", avgX, avgY);
        setMapCenter(newMarkers.length > 0 ? [avgX, avgY] : [-22.698, -47.009]);
      */
    } catch (error) {
      console.error("Erro ao buscar pontos:", error); 
    }
  };

  useEffect(() => {
    fetchStops(); 
  }, []); // só busca/move quando o mapa estiver pronto

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

  // const handleRowClick = (rowData) => {
  //   const marker = markers.find(m => m.id === rowData.id);
  //   if (marker) {
  //     popUpRef.current.show(() => marker.popupContent, {}, "Parada Detalhes");
  //   } else {
  //     console.error("Marcador não encontrado para a parada clicada:", rowData.id);
  //   }
  // }

  // Handler para quando uma linha for clicada
    const handleRowClick = (rowData) => {
      // Encontrar o objeto stop original baseado no ID da linha clicada
      const marker = stops.find(stop => stop.ponto_id === rowData.id);
      
      if (marker) {
        popUpRef.current.show(
          () => (
            <StopDetails 
              stop={marker} 
              // onEdit={handleEditStop} 
              // onDelete={handleDeleteStop} 
            />
          ), 
          {}, 
          `Parada: ${marker.nome}`
        );
      } else {
        console.error("Parada não encontrado para ID:", rowData.id);
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

      <PopUpComponent 
        ref={popUpRef}
      />
    </main>
  )
}

export default Stops