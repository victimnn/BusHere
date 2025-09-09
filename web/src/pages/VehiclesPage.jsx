import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/core/feedback/PopUpComponent";
import VehicleForm from "@web/components/domain/vehicles/VehicleForm";
import VehicleDetails from "@web/components/domain/vehicles/VehicleDetails";
import VehicleStatsCards from "@web/components/domain/vehicles/VehicleStatsCards";
import Table from "@web/components/common/data-display/Table";
import Notification from "@web/components/common/feedback/Notification";
import LoadingSpinner from "@web/components/common/feedback/LoadingSpinner";
import ErrorAlert from "@web/components/common/feedback/ErrorAlert";
import ActionButton from "@web/components/common/buttons/ActionButton";
import { Dialog } from "@web/components/common/feedback";
import { useVehicles, useNotification } from "@web/hooks";
import { formatPlate, formatDateFromDatabase, formatKilometers, formatCapacity, getStatusFormat } from "@shared/formatters";

// Função para formatar status como JSX usando a função utilitária
const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

const TABLE_HEADERS = [
  { id: "id", label: "ID", sortable: true, width: "60px" },
  { 
    id: "placa", 
    label: "Placa", 
    sortable: true,
    formatter: (value) => formatPlate(value),
    width: "100px"
  },
  { id: "nome", label: "Nome", sortable: true, width: "150px" },
  { id: "tipo_nome", label: "Tipo", sortable: true, width: "120px" },
  { id: "marca", label: "Marca", sortable: true, width: "100px" },
  { id: "modelo", label: "Modelo", sortable: true, width: "120px" },
  { id: "ano_fabricacao", label: "Ano", sortable: true, width: "80px" },
  { 
    id: "capacidade", 
    label: "Capacidade", 
    sortable: true,
    formatter: (value) => formatCapacity(value),
    width: "100px"
  },
  { 
    id: "quilometragem", 
    label: "Quilometragem", 
    sortable: true,
    formatter: (value) => formatKilometers(value),
    width: "120px"
  },
  { 
    id: "data_ultima_manutencao", 
    label: "Última Manutenção", 
    sortable: false,
    formatter: (value) => value ? formatDateFromDatabase(value) : 'N/A',
    width: "140px"
  },
  { 
    id: "data_proxima_manutencao", 
    label: "Próxima Manutenção", 
    sortable: false,
    formatter: (value) => value ? formatDateFromDatabase(value) : 'N/A',
    width: "150px"
  }, 
  { 
    id: "status", 
    label: "Status", 
    sortable: true,
    formatter: (value) => formatStatus(value),
    width: "120px"
  }
];

function Vehicles({ pageFunctions }) {
  const popUpRef = useRef(null);
      const dialogRef = useRef(null);
  
  // Usar hook customizado para gerenciar dados dos veículos
  const {
    vehicles,
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetch
  } = useVehicles();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Veículos", true, true);
  }, [pageFunctions]);

  const handleCreateVehicle = useCallback(() => {
    popUpRef.current?.show({
      title: "Novo Veículo",
      content: ({ close }) => (
        <VehicleForm
          onSubmit={async (formData) => {
            try {
              await createVehicle(formData);
              close();
              showSuccess("Veículo criado com sucesso!");
            } catch (error) {
              showError(error.message || "Erro ao criar veículo");
            }
          }}
          onCancel={close}
        />
      ),
      size: "lg"
    });
  }, [createVehicle, showSuccess, showError]);

  const handleEditVehicle = useCallback((vehicle) => {
    popUpRef.current?.show({
      title: `Editar Veículo - ${vehicle.nome}`,
      content: ({ close }) => (
        <VehicleForm
          initialData={vehicle}
          onSubmit={async (formData) => {
            try {
              await updateVehicle(vehicle.id, formData);
              close();
              showSuccess("Veículo atualizado com sucesso!");
            } catch (error) {
              showError(error.message || "Erro ao atualizar veículo");
            }
          }}
          onCancel={close}
        />
      ),
      size: "lg"
    });
  }, [updateVehicle, showSuccess, showError]);

  const handleDeleteVehicle = useCallback((vehicle) => {
    dialogRef.current?.showConfirm({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este veículo?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          const result = await deleteVehicle(vehicle.id);
          if (result.success) {
            dialogRef.current?.hide();
            showSuccess("Veículo excluído com sucesso!");
          } else {
            showError(result.error);
          }
        } catch (error) {
          showError(error.message || "Erro ao excluir veículo");
        }
      },
      onCancel: () => {}
    });
  }, [deleteVehicle, showSuccess, showError]);

  const handleRowClick = useCallback((vehicle) => {
    popUpRef.current?.show({
      title: `Detalhes do Veículo - ${vehicle.nome}`,
      content: ({ close }) => (
        <VehicleDetails
          vehicle={vehicle}
          onEdit={() => {
            close();
            handleEditVehicle(vehicle);
          }}
          onDelete={() => {
            close();
            handleDeleteVehicle(vehicle);
          }}
        />
      ),
      size: "lg"
    });
  }, [handleEditVehicle, handleDeleteVehicle]);

  return (
    <div className="ps-3 pe-3 pt-3">
      {/* Cards de Estatísticas */}
      <VehicleStatsCards vehicles={vehicles} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-car-front-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Veículos</h1>
              </div>
              
              <ActionButton
                onClick={handleCreateVehicle}
                icon="bi bi-plus-circle"
                text="Novo Veículo"
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
                message="Carregando veículos..." 
                variant="primary"
              />
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={TABLE_HEADERS}
                  data={vehicles}
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
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do Veículo.
              Para adicionar um novo veículo, clique no botão "Novo Veículo".
            </p>
          </div>
        </div>
        <br/>

      </div>

      {/* Componentes de UI */}
      <PopUpComponent ref={popUpRef} />
      <Dialog ref={dialogRef} />
      <Notification 
        notification={notification}
        onHide={hideNotification}
      />
    </div>
  );
}

export default Vehicles;
