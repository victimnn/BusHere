import { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import StopDetails from "../components/stops/StopDetails";
import StopForm from "../components/stops/StopForm";
import MarkerPopUpContent from "../components/stops/MarkerPopUpContent";
import StopsContainer from "../components/stops/StopsContainer";
import MapComponent from "../components/MapComponent";
import Table from "../components/Table";
import api from "../api/api";
import { getColorBasedOnValue } from "../utils/mapIcons";

/** 
* Função para sincronizar os marcadores com os pontos buscados
* @param {Array} stops - Array de objetos representando os pontos
* @param {Function} setMarkers - Função para atualizar o estado dos marcadores
* @param {Object} popUpRef - Referência para o componente PopUpComponent
* @param {Function} onDelete - Função callback para deletar um ponto
* @param {Function} onEdit - Função callback para editar um ponto
* @returns {Array} - Retorna um novo array de marcadores formatados
*/
export function sincronizeMarkers(stops, setMarkers, popUpRef, onDelete = null, onEdit = null) {
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

function Stops({ pageFunctions }) {
  pageFunctions.set("Pontos", true, true);

  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const [stops, setStops] = useState([]); 
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [mapCenter, setMapCenter] = useState([-22.698, -47.009]);
  const [zoom, setZoom] = useState(13); 
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros

  const fetchStops = async () => {
    try {
      setIsLoading(true); // Inicia o carregamento
      const response = await api.stops.list(); 

      setStops(response); // Use response directly instead of response.data
      setError(null); // Reseta o erro

      console.log('Dados recebidos da API:', response);
      // Remover a chamada sincronizeMarkers daqui
      
      // Centraliza o mapa calculando a média das coordenadas dos pontos
      if (response && response.length > 0) {
        console.log("centralizando mapa com", response.length, "pontos");
        const avgLat = response.reduce((sum, stop) => sum + parseFloat(stop.latitude), 0) / response.length;
        const avgLng = response.reduce((sum, stop) => sum + parseFloat(stop.longitude), 0) / response.length;
        console.log("Média das coordenadas:", avgLat, avgLng);
        setMapCenter([avgLat, avgLng]);
      } else {
        console.log("Usando coordenadas padrão");
        setMapCenter([-22.698, -47.009]);
      }
    } catch (error) {
      console.error("Erro ao buscar pontos:", error); 
      setError("Não foi possível carregar os pontos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStops(); 
  }, []); // só busca/move quando o mapa estiver pronto

  const handleCreateStop = (initialData = {}) => {
    popUpRef.current.show(
      ({ close }) => (
        <StopForm
          initialData={initialData}
          onSubmit={async (formData) => {
            try {
              console.log('Enviando dados:', formData);
              await api.stops.create(formData);
              close();
              fetchStops(); // Recarrega a lista
            } catch (error) {
              console.error("Erro ao criar ponto:", error);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao criar ponto: ";
              if (error.message && error.message.includes('já cadastrado')) {
                errorMessage += error.message;
              } else {
                errorMessage += error.message || "Tente novamente mais tarde";
              }
              
              alert(errorMessage);
            }
          }}
          onCancel={close}
        />
      ),
      {},
      "Novo Ponto"
    );
  };

  const handleEditStop = (stopId) => {
    const stop = stops.find(s => s.ponto_id === stopId);
    if (!stop) {
      console.error("Ponto não encontrado para ID:", stopId);
      return;
    }

    popUpRef.current.show(
      ({ close }) => (
        <StopForm
          initialData={stop}
          onSubmit={async (formData) => {
            try {
              console.log('Enviando dados para atualização:', formData);
              await api.stops.update(stop.ponto_id, formData);
              close();
              fetchStops(); // Recarrega a lista
            } catch (error) {
              console.error("Erro ao atualizar ponto:", error);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao atualizar ponto: ";
              if (error.message && error.message.includes('já está sendo usado')) {
                errorMessage += error.message;
              } else {
                errorMessage += error.message || "Tente novamente mais tarde";
              }
              
              alert(errorMessage);
            }
          }}
          onCancel={close}
        />
      ),
      {},
      `Editar Ponto: ${stop.nome}`
    );
  };

  const handleDeleteStop = async (id) => {
    if (confirm("Você tem certeza que deseja deletar este ponto? Esta ação não pode ser desfeita.")) {
      try {
        await api.stops.delete(id); // Chama a API para deletar o ponto
        fetchStops(); // Recarrega os pontos após a exclusão (é pior para performance, porem já atualza o estado mais vezes)
        popUpRef.current.hide(); // Fecha o pop-up após a exclusão
      } catch (error) {
        console.error(`Erro ao deletar ponto com ID ${id}:`, error);  
        alert(`Erro ao deletar ponto: ${error.message || "Tente novamente mais tarde"}`);
      }
    }
  };

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
    cep: stop.cep || 'N/A',
    coordinates: `${Number(stop.latitude).toFixed(4)}, ${Number(stop.longitude).toFixed(4)}`,
    routesView: "Rotas",
    address: `${stop.logradouro}, ${stop.numero_endereco} - ${stop.bairro}, ${stop.cidade} - ${stop.uf}`,
    status: stop.ativo ? "Ativo" : "Inativo"
  }));

  // Handler para quando uma linha for clicada
  const handleRowClick = (rowData) => {
    // Encontrar o objeto stop original baseado no ID da linha clicada
    const marker = stops.find(stop => stop.ponto_id === rowData.id);
    
    if (marker) {
      popUpRef.current.show(
        () => (
          <StopDetails 
            stop={marker} 
            onEdit={() => handleEditStop(marker.ponto_id)} 
            onDelete={() => handleDeleteStop(marker.ponto_id)} 
          />
        ), 
        {}, 
        `Ponto: ${marker.nome}`
      );
    } else {
      console.error("Ponto não encontrado para ID:", rowData.id);
    }
  }

  const handleMapClick = (latlng) => {
    const InnitialComponent = () => (
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="bi bi-geo-alt-fill text-primary fs-1"></i>
          </div>
          
          <h5 className="mb-2 fw-bold text-dark">
            Novo Ponto de Parada
          </h5>

          <div className="bg-light rounded-pill px-3 py-2 d-inline-block">
            <i className="bi bi-compass me-2 text-primary"></i>
            <span className="font-monospace text-dark">
              {latlng.lat.toFixed(6)}, {latlng.lng.toFixed(6)}
            </span>
          </div>
        </div>
        
        <div className="d-flex gap-3 justify-content-center">
          <button 
            className="btn btn-primary btn-lg px-4 py-2"
            onClick={() => {
              popUpRef.current.hide();
              handleCreateStop({ latitude: latlng.lat, longitude: latlng.lng });
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            <span>Criar Ponto</span>
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-lg px-4 py-2" 
            onClick={() => {
              popUpRef.current.hide();
            }}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
        </div>
      </div>
    );

    popUpRef.current.show(InnitialComponent, {}, "Novo Ponto");
  }

  // Adicionar useEffect para sincronizar marcadores quando stops mudar
  useEffect(() => {
    if (stops.length > 0) {
      sincronizeMarkers(stops, setMarkers, popUpRef, handleDeleteStop, handleEditStop);
    }
  }, [stops]); // Executa quando stops muda

  return (
    <main style={{ height: '100vh', maxWidth: "100%", overflowX: 'hidden' }} className="d-flex flex-column">
      <div className="d-flex flex-row m-3 w-100 h-50 gap-4" style={{ overflowY: 'hidden', maxHeight: '35%' }}>
        <MapComponent 
          className="w-100 h-100 rounded-3"
          style={{ flex: "2" }}
          center={mapCenter}
          zoom={zoom}
          markers={markers}
          polylines={polylines}
          onMapClick={handleMapClick} 
          handleZoomChange={(e) => {console.log("Zoom alterado para:", e.target._zoom); setZoom(e.target._zoom);}}
        />

        <div style={{ flex: "2", minWidth: "350px", marginRight: "20px" }}>
          <StopsContainer 
            stops={stops}
          />
        </div>
      </div>
      

      <Table 
        headers={tableHeaders}
        data={tableData}
        itemsPerPage={5}
        searchable={true}
        className="table-striped table-hover"
        onRowClick={handleRowClick}
      />

      <div className="card border-0 bg-light shadow-sm mt-4 p-3 ms-3 me-3">
        <div className="d-flex align-items-center justify-content-center">
          <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
          <p className="mb-0 text-muted">
            <strong>Dica: </strong>
            Para adicionar um novo ponto, clique no mapa.
          </p>
        </div>
      </div>

      <PopUpComponent 
        ref={popUpRef}
      />
    </main>
  )
}

export default Stops