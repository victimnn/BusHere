import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/core/feedback/PopUpComponent";
import PassengerForm from "@web/components/domain/passengers/PassengerForm";
import PassengerDetails from "@web/components/domain/passengers/PassengerDetails";
import PassengerStatsCards from "@web/components/domain/passengers/PassengerStatsCards";
import Table from "@web/components/common/data-display/Table";
import Notification from "@web/components/common/feedback/Notification";
import LoadingSpinner from "@web/components/common/feedback/LoadingSpinner";
import ErrorAlert from "@web/components/common/feedback/ErrorAlert";
import ActionButton from "@web/components/common/buttons/ActionButton";
import { Dialog } from "@web/components/common/feedback";
import { usePassengers, useNotification } from "@web/hooks";
import { formatCPF, formatPhoneNumber, formatDateFromDatabase, getTypeFormat } from "@shared/formatters";

const formatType = (value) => {
  const { className, text } = getTypeFormat(value);
  return React.createElement('span', { className }, text);
}

const TABLE_HEADERS = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", label: "CPF", sortable: true },
  { id: "email", label: "E-mail", sortable: true },
  { id: "telefone", label: "Telefone", sortable: false },
  { id: "data_nascimento", label: "Data Nascimento", sortable: false },
  { id: "pcd", label: "PCD", sortable: true, formatter: (value) => value ? "Sim" : "Não" },
  { id: "tipo_passageiro", 
    label: "Tipo", 
    sortable: true,
    formatter: (value) => formatType(value)
  },
  { id: "cidade", label: "Cidade", sortable: true },
  { id: "rota_nome", label: "Rota", sortable: true, formatter: (value) => value || "Não informado" },
  { id: "ponto_nome", label: "Ponto", sortable: true, formatter: (value) => value || "Não informado" }
];

function Passengers({ pageFunctions }) {
  const popUpRef = useRef(null);
      const dialogRef = useRef(null);
  
  // Usar hook customizado para gerenciar dados dos passageiros
  const {
    passengers,
    isLoading,
    error,
    createPassenger,
    updatePassenger,
    deletePassenger,
    refetch
  } = usePassengers();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Passageiros", true, true);
  }, [pageFunctions]);

  const handleCreatePassenger = useCallback(() => {
    popUpRef.current.show({
      title: "Novo Passageiro",
      content: PassengerForm,
      props: {
        onSubmit: async (formData) => {
          const result = await createPassenger(formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Passageiro criado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  }, [createPassenger, showSuccess, showError]);

  const handleEditPassenger = useCallback((passenger) => {
    const initialData = {
      nome: passenger.nome,
      cpf: passenger.cpf,
      email: passenger.email,
      telefone: passenger.telefone,
      tipo_passageiro: passenger.tipo_passageiro_id,
      data_nascimento: passenger.data_nascimento,
      pcd: passenger.pcd,
      logradouro: passenger.logradouro,
      numero_endereco: passenger.numero_endereco,
      complemento_endereco: passenger.complemento_endereco,
      bairro: passenger.bairro,
      cidade: passenger.cidade,
      uf: passenger.uf,
      cep: passenger.cep,
      rota_id: passenger.rota_id,
      ponto_id: passenger.ponto_id
    };

    popUpRef.current.show({
      title: `Editar Passageiro: ${passenger.nome}`,
      content: PassengerForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          const result = await updatePassenger(passenger.id, formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Passageiro atualizado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  }, [updatePassenger, showSuccess, showError]);

  const handleDeletePassenger = useCallback(async (id) => {
            dialogRef.current.showConfirm({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este passageiro?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        const result = await deletePassenger(id);
        if (result.success) {
          popUpRef.current.hide();
          showSuccess("Passageiro excluído com sucesso!");
        } else {
          showError(result.error);
        }
      },
      onCancel: () => {}
    });
  }, [deletePassenger, showSuccess, showError]);

  const handleRowClick = useCallback((passenger) => {
    popUpRef.current.show({
      title: `Passageiro: ${passenger.nome}`,
      content: PassengerDetails,
      props: {
        passenger: passenger,
        onEdit: handleEditPassenger,
        onDelete: handleDeletePassenger,
      }
    });
  }, [handleEditPassenger, handleDeletePassenger]);

  return (
    <div className="ps-3 pe-3 pt-3">
      {/* Cards de Estatísticas */}
      <PassengerStatsCards passengers={passengers} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Passageiros</h1>
              </div>
              
              <ActionButton
                onClick={handleCreatePassenger}
                icon="bi bi-plus-circle"
                text="Novo Passageiro"
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
                message="Carregando passageiros..." 
                variant="primary"
              />
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={TABLE_HEADERS}
                  data={passengers}
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
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do passageiro.
              Para adicionar um novo passageiro, clique no botão "Novo Passageiro".
            </p>
          </div>
        </div>
        <br/>

        <PopUpComponent 
          ref={popUpRef}
        />

        {/* Dialog unificado para confirmações */}
        <Dialog ref={dialogRef} />

        {/* Componente de Notificação */}
        <Notification 
          notification={notification} 
          onClose={hideNotification} 
        />
      </div>
    </div>
  );
}

export default Passengers;