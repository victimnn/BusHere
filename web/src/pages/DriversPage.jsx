import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/ui/PopUpComponent";
import DriverForm from "@web/components/pageComponents/drivers/DriverForm";
import DriverDetails from "@web/components/pageComponents/drivers/DriverDetails";
import DriversStatsCards from "@web/components/pageComponents/drivers/DriversStatsCards";
import Table from "@web/components/ui/Table";
import Notification from "@web/components/common/Notification";
import LoadingSpinner from "@web/components/common/LoadingSpinner";
import ErrorAlert from "@web/components/common/ErrorAlert";
import ActionButton from "@web/components/common/ActionButton";
import { useDrivers, useNotification } from "@web/hooks";
import { formatCPF, formatPhoneNumber, formatDateFromDatabase, getStatusFormat } from "@shared/formatters";

const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

const TABLE_HEADERS = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", 
    label: "CPF", 
    sortable: true,
    formatter: (value) => formatCPF(value)
  },
  { id: "cnh_numero", label: "CNH", sortable: true },
  { id: "cnh_categoria", label: "Categoria", sortable: true },
  { id: "cnh_validade", label: "Validade CNH", sortable: false },
  { id: "telefone", 
    label: "Telefone", 
    sortable: true,
    formatter: (value) => formatPhoneNumber(value)
  },
  { id: "email", label: "Email", sortable: true },
  { id: "data_admissao", label: "Data Admissão", sortable: false },
  { id: "status_nome", 
    label: "Status", 
    sortable: true,
    formatter: (value) => formatStatus(value)
  },
];

function Drivers({ pageFunctions }) {
  const popUpRef = useRef(null);
  
  // Usar hook customizado para gerenciar dados dos motoristas
  const {
    drivers,
    isLoading,
    error,
    createDriver,
    updateDriver,
    deleteDriver,
    refetch
  } = useDrivers();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Motoristas", true, true);
  }, [pageFunctions]);
  const handleCreateDriver = useCallback(() => {
    popUpRef.current.show({
      title: "Novo Motorista",
      content: DriverForm,
      props: {
        onSubmit: async (formData) => {
          const result = await createDriver(formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Motorista criado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  }, [createDriver, showSuccess, showError]);

  const handleEditDriver = useCallback((driver) => {
    const initialData = {
      nome: driver.nome,
      cpf: driver.cpf,
      cnh_numero: driver.cnh_numero,
      cnh_categoria: driver.cnh_categoria,
      cnh_validade: driver.cnh_validade,
      telefone: driver.telefone,
      email: driver.email,
      data_admissao: driver.data_admissao,
      status_motorista_id: parseInt(driver.status_motorista_id) || 1
    };

    popUpRef.current.show({
      title: `Editar Motorista: ${driver.nome}`,
      content: DriverForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          const result = await updateDriver(driver.id, formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Motorista atualizado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  }, [updateDriver, showSuccess, showError]);

  const handleDeleteDriver = useCallback(async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este motorista?")) {
      const result = await deleteDriver(id);
      if (result.success) {
        popUpRef.current.hide();
        showSuccess("Motorista excluído com sucesso!");
      } else {
        showError(result.error);
      }
    }
  }, [deleteDriver, showSuccess, showError]);

  const handleRowClick = useCallback((driver) => {
    popUpRef.current.show({
      title: `Motorista: ${driver.nome}`,
      content: DriverDetails,
      props: {
        driver: driver,
        onEdit: handleEditDriver,
        onDelete: handleDeleteDriver,
      }
    });
  }, [handleEditDriver, handleDeleteDriver]);

  return (
    <div className="ps-3 pe-3 pt-3">
      {/* Cards de Estatísticas */}
      <DriversStatsCards drivers={drivers} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-person-fill-gear fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Motoristas</h1>
              </div>
              
              <ActionButton
                onClick={handleCreateDriver}
                icon="bi bi-plus-circle"
                text="Novo Motorista"
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
                message="Carregando motoristas..." 
                variant="primary"
              />
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={TABLE_HEADERS}
                  data={drivers}
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
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do motorista.
              Para adicionar um novo motorista, clique no botão "Novo Motorista".
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

export default Drivers;