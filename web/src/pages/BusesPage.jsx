import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/ui/PopUpComponent";
import BusForm from "@web/components/pageComponents/buses/BusForm";
import BusDetails from "@web/components/pageComponents/buses/BusDetails";
import BusStatsCards from "@web/components/pageComponents/buses/BusStatsCards";
import Table from "@web/components/ui/Table";
import Notification from "@web/components/common/Notification";
import LoadingSpinner from "@web/components/common/LoadingSpinner";
import ErrorAlert from "@web/components/common/ErrorAlert";
import ActionButton from "@web/components/common/ActionButton";
import { useBuses } from "@web/hooks/useBuses";
import { useNotification } from "@web/hooks/useNotification";
import { formatPlate, formatDateFromDatabase, formatKilometers, formatCapacity, getStatusFormat } from "@shared/formatters";

// Função para formatar status como JSX usando a função utilitária
const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

const TABLE_HEADERS = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { 
    id: "placa", 
    label: "Placa", 
    sortable: true,
    formatter: (value) => formatPlate(value)
  },
  { id: "modelo", label: "Modelo", sortable: true },
  { id: "marca", label: "Marca", sortable: true },
  { id: "ano_fabricacao", label: "Ano", sortable: true },
  { 
    id: "capacidade", 
    label: "Capacidade", 
    sortable: true,
    formatter: (value) => formatCapacity(value)
  },
  { 
    id: "data_ultima_manutencao", 
    label: "Última Manutenção", 
    sortable: false,
    formatter: (value) => value ? formatDateFromDatabase(value) : 'N/A'
  },
  { 
    id: "data_proxima_manutencao", 
    label: "Próxima Manutenção", 
    sortable: false,
    formatter: (value) => value ? formatDateFromDatabase(value) : 'N/A'
  },
  { 
    id: "quilometragem", 
    label: "Quilometragem", 
    sortable: true,
    formatter: (value) => formatKilometers(value)
  },
  { 
    id: "status", 
    label: "Status", 
    sortable: true,
    formatter: (value) => formatStatus(value)
  },
];

function Buses({ pageFunctions }) {
  const popUpRef = useRef(null);
  
  // Usar hook customizado para gerenciar dados dos ônibus
  const {
    buses,
    isLoading,
    error,
    createBus,
    updateBus,
    deleteBus,
    refetch
  } = useBuses();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Ônibus", true, true);
  }, [pageFunctions]);

  const handleCreateBus = useCallback(() => {
    popUpRef.current.show({
      title: "Novo Ônibus",
      content: BusForm,
      props: {
        onSubmit: async (formData) => {
          const result = await createBus(formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Ônibus criado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  }, [createBus, showSuccess, showError]);

  const handleEditBus = useCallback((bus) => {
    const initialData = {
      nome: bus.nome,
      placa: bus.placa,
      modelo: bus.modelo,
      marca: bus.marca,
      ano_fabricacao: bus.ano_fabricacao,
      capacidade: bus.capacidade,
      data_ultima_manutencao: bus.data_ultima_manutencao,
      data_proxima_manutencao: bus.data_proxima_manutencao,
      quilometragem: bus.quilometragem,
      status_onibus_id: bus.status_onibus_id,
    };

    popUpRef.current.show({
      title: `Editar Ônibus: ${bus.nome}`,
      content: BusForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          const result = await updateBus(bus.id, formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Ônibus atualizado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  }, [updateBus, showSuccess, showError]);

  // Handler para excluir um ônibus
  const handleDeleteBus = useCallback(async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este ônibus?")) {
      const result = await deleteBus(id);
      if (result.success) {
        popUpRef.current.hide();
        showSuccess("Ônibus excluído com sucesso!");
      } else {
        showError(result.error);
      }
    }
  }, [deleteBus, showSuccess, showError]);

  // Handler para quando uma linha for clicada
  const handleRowClick = useCallback((bus) => {
    popUpRef.current.show({
      title: `Ônibus: ${bus.nome}`,
      content: BusDetails,
      props: {
        bus: bus,
        onEdit: handleEditBus,
        onDelete: handleDeleteBus,
      }
    });
  }, [handleEditBus, handleDeleteBus]);

  return (
    <div className="ps-3 pe-3 pt-3">
      {/* Cards de Estatísticas */}
      <BusStatsCards buses={buses} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-bus-front-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Ônibus</h1>
              </div>
              
              <ActionButton
                onClick={handleCreateBus}
                icon="bi bi-plus-circle"
                text="Novo Ônibus"
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
                message="Carregando ônibus..." 
                variant="primary"
              />
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={TABLE_HEADERS}
                  data={buses}
                  itemsPerPage={10}
                  searchable={true}
                  className="table-striped table-hover"
                  onRowClick={handleRowClick}
                />
              </div>
            )}          
          </div>
        </div>
        
        <div className="card border-0 bg-light shadow-sm mt-4 p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
            <p className="mb-0 text-muted">
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do ônibus.
              Para adicionar um novo ônibus, clique no botão "Novo Ônibus".
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
    </div>
  );
}

export default Buses;
