import React, { useRef, useState, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/ui/PopUpComponent";
import StopDetails from "@web/components/pageComponents/stops/StopDetails";
import StopForm from "@web/components/pageComponents/stops/StopForm";
import MarkerPopUpContent from "@web/components/pageComponents/stops/MarkerPopUpContent";
import StopsMapSection from "@web/components/pageComponents/stops/StopsMapSection";
import StopsListSection from "@web/components/pageComponents/stops/StopsListSection";
import StopsTableSection from "@web/components/pageComponents/stops/StopsTableSection";
import MapClickPopup from "@web/components/pageComponents/stops/MapClickPopup";
import Notification from "@web/components/common/Notification";
import LoadingSpinner from "@web/components/common/LoadingSpinner";
import ErrorAlert from "@web/components/common/ErrorAlert";
import ActionButton from "@web/components/common/ActionButton";
import { getColorBasedOnValue } from "../utils/mapIcons";
import { getStatusFormat } from "@shared/formatters";
import { useStops, useNotification } from "@web/hooks";

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
    id: stop.ponto_id
  }));
  setMarkers(newMarkers); // Atualiza os marcadores com os pontos buscados
  return newMarkers;
}

function Stops({ pageFunctions, isDark }) {
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

  // Estados do mapa
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    pageFunctions.set("Pontos", true, true);
  }, [pageFunctions]);

  const handleCreateStop = useCallback((initialData = {}) => {
    popUpRef.current.show({
      title: "Novo Ponto",
      content: StopForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          
          if ((!formData.latitude || !formData.longitude) && initialData.latitude && initialData.longitude) {
            formData.latitude = initialData.latitude;
            formData.longitude = initialData.longitude;
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
        setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
        popUpRef.current.hide(); 
        showSuccess("Ponto excluído com sucesso!");
      } else {
        showError(result.error);
      }
    }
  }, [deleteStop, showSuccess, showError]);

  const handleRowClick = useCallback((rowData) => {
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
    popUpRef.current.show({ 
      title: "Novo Ponto", 
      content: () => (
        <MapClickPopup 
          latlng={latlng}
          onCreateStop={handleCreateStop}
          onCancel={() => popUpRef.current.hide()}
        />
      )
    });
  }, [handleCreateStop]);

  const handleZoomChange = useCallback((e) => {
    // console.log("Zoom alterado para:", e.target._zoom); 
    setZoom(e.target._zoom);
  }, []);

  // Preparar dados da tabela
  const tableData = stops.map((stop) => ({
    id: stop.ponto_id,
    name: stop.nome,
    cep: stop.cep || 'N/A',
    coordinates: `${Number(stop.latitude).toFixed(4)}, ${Number(stop.longitude).toFixed(4)}`,
    routesView: "Rotas",
    address: `${stop.logradouro}, ${stop.numero_endereco} - ${stop.bairro}, ${stop.cidade} - ${stop.uf}`,
    status: stop.ativo ? "Ativo" : "Inativo"
  }));

  // Sincronizar marcadores quando stops mudar
  useEffect(() => {
    // console.log('🔄 useEffect sincronizeMarkers disparado:', { stopsLength: stops.length, stops });
    if (stops.length > 0) {
      sincronizeMarkers(stops, setMarkers, popUpRef, handleDeleteStop, handleEditStop);
    } else {
      setMarkers([]);
    }
  }, [stops, handleDeleteStop, handleEditStop]);

  // Debug para verificar estados do mapa
  useEffect(() => {
    // console.log('🗺️ Estados do mapa:', {
    //   mapCenter,
    //   zoom,
    //   markersLength: markers.length,
    //   stopsLength: stops.length,
    //   isLoading,
    //   error
    // });
  }, [mapCenter, zoom, markers, stops, isLoading, error]);

  return (
    <main className="ps-3 pe-3 pt-3 stops-page">
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          
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
                  <StopsMapSection 
                    mapCenter={mapCenter}
                    zoom={zoom}
                    markers={markers}
                    polylines={polylines}
                    onMapClick={handleMapClick}
                    onZoomChange={handleZoomChange}
                    isDark={isDark}
                  />
                  
                  <StopsListSection stops={stops} />
                </div>

                {/* Tabela de Pontos */}
                <StopsTableSection 
                  tableHeaders={TABLE_HEADERS}
                  tableData={tableData}
                  onRowClick={handleRowClick}
                />
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