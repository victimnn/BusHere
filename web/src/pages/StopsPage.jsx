import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import StopDetails from "../components/stops/StopDetails";
import StopForm from "../components/stops/StopForm";
import MarkerPopUpContent from "../components/stops/MarkerPopUpContent";
import StopsContainer from "../components/stops/StopsContainer";
import MapComponent from "../components/MapComponent";
import Table from "../components/Table";
import Notification from "@web/components/common/Notification";
import api from "../api/api";
import { getColorBasedOnValue } from "../utils/mapIcons";
import { formatCapacity, getStatusFormat } from "@shared/formatters";
import { useStops } from "../hooks/useStops";
import { useNotification } from "@web/hooks/useNotification";

const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

/** 
* Função para sincronizar os marcadores com os pontos buscados
* @param {Array} stops - Array de objetos representando os pontos
* @param {Function} setMarkers - Função para atualizar o estado dos marcadores
* @param {Object} popUpRef - Referência para o componente PopUpComponent
* @param {Function} onDelete - Função callback para deletar um ponto
* @param {Function} onEdit - Função callback para editar um ponto
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
  // Hook para gerenciar dados dos pontos
  const {
    stops,
    isLoading,
    error,
    mapCenter,
    createStop,
    updateStop,
    deleteStop,
    findStopById
  } = useStops();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Pontos", true, true);
  }, [pageFunctions]);

  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [zoom, setZoom] = useState(13);

  const handleCreateStop = (initialData = {}) => {
    console.log('🚀 Iniciando criação de ponto com dados iniciais:', initialData);
    
    popUpRef.current.show({
      title: "Novo Ponto",
      content: StopForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          console.log('📝 Formulário submetido com dados:', formData);
          
          // GARANTIR que as coordenadas estejam presentes
          // Se não estão no formData mas estão no initialData, adicionar
          if ((!formData.latitude || !formData.longitude) && initialData.latitude && initialData.longitude) {
            console.log('🔧 Corrigindo coordenadas ausentes no formData');
            formData.latitude = initialData.latitude;
            formData.longitude = initialData.longitude;
            console.log('✅ Coordenadas corrigidas:', { lat: formData.latitude, lng: formData.longitude });
          }
          
          const result = await createStop(formData);
          
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Ponto criado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  };

  const handleEditStop = (stopId) => {
    const stop = findStopById(stopId);
    if (!stop) {
      console.error("Ponto não encontrado para ID:", stopId);
      return;
    }

    // Garantir que as coordenadas estejam sempre presentes nos dados iniciais
    const initialData = {
      ...stop,
      latitude: stop.latitude,
      longitude: stop.longitude
    };

    popUpRef.current.show({
      title: `Editar Ponto: ${stop.nome}`,
      content: StopForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          // Garantir que as coordenadas originais sejam preservadas se não foram alteradas
          const finalData = {
            ...formData,
            latitude: formData.latitude || stop.latitude,
            longitude: formData.longitude || stop.longitude
          };
          
          const result = await updateStop(stop.ponto_id, finalData);
          
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Ponto atualizado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteStop = async (id) => {
    if (confirm("Você tem certeza que deseja excluir este ponto?")) {
      const result = await deleteStop(id);
      
      if (result.success) {
        // Remove o marcador do mapa imediatamente
        setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
        
        // Fecha o pop-up
        popUpRef.current.hide(); 
        
        showSuccess("Ponto excluído com sucesso!");
      } else {
        showError(result.error);
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
    {id: "address", label: "Endereço", sortable: true},
    {id: "status", 
    label: "Status", 
    sortable: true,
    formatter: (value) => formatStatus(value)
  }
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
    const marker = findStopById(rowData.id);
    
    if (marker) {
      popUpRef.current.show({
      title: `Ponto: ${marker.nome}`,
      content: StopDetails,
      props: {
        stop: marker,
        onEdit: () => handleEditStop(marker.ponto_id),
        onDelete: () => handleDeleteStop(marker.ponto_id),
      }
    });
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
            onClick={async () => {
              popUpRef.current.hide();
              
              try {
                const data = await api.geolocation.getInfoFromCoordinates(latlng.lat, latlng.lng);
                
                const initialData = {
                  latitude: latlng.lat,
                  longitude: latlng.lng,
                  logradouro: data.road || '',
                  bairro: data.suburb || '',
                  cidade: data.city || '',
                  uf: data.uf || '',
                  cep: data.cep || '',
                };
                
                console.log('🗺️ Dados obtidos do mapa + geolocalização:', initialData);
                handleCreateStop(initialData);
              } catch (error) {
                console.warn('⚠️ API de geolocalização falhou, usando apenas coordenadas:', error.message);
                
                // Se a API de geolocalização falhar, criar com apenas as coordenadas
                const initialData = {
                  latitude: latlng.lat,
                  longitude: latlng.lng,
                  logradouro: '',
                  bairro: '',
                  cidade: '',
                  uf: '',
                  cep: '',
                };
                
                console.log('🗺️ Dados fallback (apenas coordenadas):', initialData);
                handleCreateStop(initialData);
              }
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

    popUpRef.current.show({ title: "Novo Ponto", content: InnitialComponent });
  }

  // Adicionar useEffect para sincronizar marcadores quando stops mudar
  useEffect(() => {
    if (stops.length > 0) {
      sincronizeMarkers(stops, setMarkers, popUpRef, handleDeleteStop, handleEditStop);
    }
  }, [stops]); // Executa quando stops muda

  return (
    <main style={{ height: '100vh', maxWidth: "100%", overflowX: 'hidden' }} className="d-flex flex-column ps-3 pe-3">
      {/* Loading State */}
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="alert alert-danger m-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
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

            <div style={{ flex: "2", minWidth: "350px", marginRight: "30px" }}>
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
        </>
      )}

      <PopUpComponent 
        ref={popUpRef}
      />

      {/* Componente de Notificação */}
      <Notification 
        notification={notification} 
        onClose={hideNotification} 
      />
    </main>
  )
}

export default Stops