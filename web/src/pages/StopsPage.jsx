import React, { useRef, useState, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/PopUpComponent";
import StopDetails from "@web/components/stops/StopDetails";
import StopForm from "@web/components/stops/StopForm";
import MarkerPopUpContent from "@web/components/stops/MarkerPopUpContent";
import StopsContainer from "@web/components/stops/StopsContainer";
import MapComponent from "@web/components/MapComponent";
import Table from "@web/components/Table";
import Notification from "@web/components/common/Notification";
import LoadingSpinner from "@web/components/common/LoadingSpinner";
import ErrorAlert from "@web/components/common/ErrorAlert";
import ActionButton from "@web/components/common/ActionButton";
import api from "../api/api";
import { getColorBasedOnValue } from "../utils/mapIcons";
import { formatCapacity, getStatusFormat } from "@shared/formatters";
import { useStops } from "../hooks/useStops";
import { useNotification } from "@web/hooks/useNotification";

const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

const TABLE_HEADERS = [
  {id: "id", label: "ID", sortable: true},
  {id: "name", label: "Nome", sortable: true},
  {id: "cep", label: "CEP", sortable: false},
  {id: "coordinates", label: "Coordenadas", sortable: false},
  {id: "routesView", label: "Rotas", sortable: false}, 
  {id: "address", label: "Endereço", sortable: true},
  {id: "status", 
    label: "Status", 
    sortable: true,
    formatter: (value) => formatStatus(value)
  }
];

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
  const popUpRef = useRef(null);
  
  // Hook para gerenciar dados dos pontos
  const {
    stops,
    isLoading,
    error,
    mapCenter,
    createStop,
    updateStop,
    deleteStop,
    findStopById,
    refetch
  } = useStops();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  // Estados para mapa
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    pageFunctions.set("Pontos", true, true);
  }, [pageFunctions]);

  const handleCreateStop = useCallback((initialData = {}) => {
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
  }, [createStop, showSuccess, showError]);

  const handleEditStop = useCallback((stopId) => {
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
  }, [findStopById, updateStop, showSuccess, showError]);

  const handleDeleteStop = useCallback(async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este ponto?")) {
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
  }, [deleteStop, showSuccess, showError]);

  //id,nome,cep,coordenadas,rotas,endereco,status
  const tableHeaders = TABLE_HEADERS;
  
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
  const handleRowClick = useCallback((rowData) => {
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
  }, [findStopById, handleEditStop, handleDeleteStop]);

  const handleMapClick = useCallback((latlng) => {
    const InitialComponent = () => (
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

    popUpRef.current.show({ title: "Novo Ponto", content: InitialComponent });
  }, [handleCreateStop]);

  // Adicionar useEffect para sincronizar marcadores quando stops mudar
  useEffect(() => {
    console.log('🔄 useEffect sincronizeMarkers disparado:', { stopsLength: stops.length, stops });
    if (stops.length > 0) {
      sincronizeMarkers(stops, setMarkers, popUpRef, handleDeleteStop, handleEditStop);
    } else {
      setMarkers([]); // Limpa marcadores quando não há pontos
    }
  }, [stops, handleDeleteStop, handleEditStop]); // Executa quando stops muda

  // Debug para verificar estados do mapa
  useEffect(() => {
    console.log('🗺️ Estados do mapa:', {
      mapCenter,
      zoom,
      markersLength: markers.length,
      stopsLength: stops.length,
      isLoading,
      error
    });
  }, [mapCenter, zoom, markers, stops, isLoading, error]);

  return (
    <main className="ps-3 pe-3 pt-3">
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-geo-alt-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Pontos de Parada</h1>
              </div>
              
              <ActionButton
                onClick={() => handleCreateStop()}
                icon="bi bi-plus-circle"
                text="Novo Ponto"
                variant="primary"
                size="lg"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="card-body p-3">
            {error && (
              <ErrorAlert 
                error={error}
                onRetry={refetch}
                onDismiss={() => {}} // O hook gerencia o estado do erro
                variant="danger"
              />
            )}
            
            {isLoading ? (
              <LoadingSpinner 
                size="large" 
                message="Carregando pontos..." 
                variant="primary"
              />
            ) : (
              <>
                {/* Seção do Mapa e Lista de Pontos */}
                <div className="row mb-4">
                  <div className="col-lg-8 mb-3 mb-lg-0">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light py-2">
                        <h6 className="mb-0 fw-semibold">
                          <i className="bi bi-map me-2"></i>
                          Mapa dos Pontos
                        </h6>
                      </div>
                      <div className="card-body p-0">
                        <div style={{ height: "400px" }}>
                          <MapComponent 
                            className="w-100 h-100"
                            center={mapCenter}
                            zoom={zoom}
                            markers={markers}
                            polylines={polylines}
                            onMapClick={handleMapClick} 
                            handleZoomChange={(e) => {
                              console.log("Zoom alterado para:", e.target._zoom); 
                              setZoom(e.target._zoom);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light py-2">
                        <h6 className="mb-0 fw-semibold">
                          <i className="bi bi-list-ul me-2"></i>
                          Lista de Pontos
                        </h6>
                      </div>
                      <div className="card-body p-0" style={{ height: "400px", overflowY: "auto" }}>
                        <StopsContainer stops={stops} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabela de Pontos */}
                <div className="table-responsive">
                  <Table 
                    headers={tableHeaders}
                    data={tableData}
                    itemsPerPage={10}
                    searchable={true}
                    className="table-striped table-hover"
                    onRowClick={handleRowClick}
                  />
                </div>
              </>
            )}          
          </div>
        </div>
        
        <div className="card border-0 bg-light shadow-sm mt-4 p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
            <p className="mb-0 text-muted">
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do ponto.
              Para adicionar um novo ponto, clique no mapa ou no botão "Novo Ponto".
            </p>
          </div>
        </div>

        <PopUpComponent 
          ref={popUpRef}
        />

        {/* Componente de Notificação */}
        <Notification 
          notification={notification} 
          onClose={hideNotification} 
        />
      </div>
    </main>
  )
}

export default Stops