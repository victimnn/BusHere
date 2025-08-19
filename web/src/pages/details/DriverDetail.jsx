import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/core/feedback/PopUpComponent';
import DriverForm from "@web/components/domain/drivers/DriverForm";
import { Notification } from '@web/components/common';
import Dialog from '@web/components/common/feedback/Dialog';

import { useDrivers, useDetailPage, useNotification } from '@web/hooks';
import { formatCPF, formatPhoneNumber, formatDateFromDatabase } from '@shared/formatters';

import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/features/details';

function DriverDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Motorista", true, true); }, [pageFunctions]);
  
  const navigate = useNavigate();
  const { driverId } = useParams();
  const popUpRef = useRef(null);
  const dialogRef = useRef(null);
  
  // Usar o hook de motoristas
  const { getDriverById, updateDriver, deleteDriver, getStatusMotoristaName } = useDrivers();
  
  // Usar o hook de detail page
  const { data: driver, loading, error, refetch } = useDetailPage(getDriverById, driverId);

  // Hook para notificações
    const { notification, hideNotification, showSuccess, showError } = useNotification();

  const handleEditDriver = () => {
    const initialData = {
      nome: driver.nome,
      cpf: driver.cpf,
      cnh_numero: driver.cnh_numero,
      cnh_categoria: driver.cnh_categoria,
      cnh_validade: driver.cnh_validade,
      telefone: driver.telefone,
      email: driver.email,
      data_admissao: driver.data_admissao,
      status_motorista_id: driver.status_motorista_id
    };
    
    popUpRef.current.show({
      title: `Editar Motorista: ${driver.nome}`,
      content: DriverForm,
      props: {
        initialData,
        onSubmit: async (formData) => {
          try {
            const result = await updateDriver(driver.id || driver.motorista_id, formData);
            if (result.success) {
              popUpRef.current.hide();
              refetch(); // Recarrega os dados usando o hook
              showSuccess("Motorista atualizado com sucesso!");
            } else {
              showError(result.error);
            }
          } catch (err) {
            showError(`Erro ao atualizar motorista: ${err.message || "Tente novamente mais tarde"}`);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteDriver = async () => {
    dialogRef.current.showConfirm({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este motorista?",
      type: "danger",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          const result = await deleteDriver(driver.id || driver.motorista_id);
          if (result.success) {
            showSuccess("Motorista excluído com sucesso!");
            setTimeout(() => {
              navigate('/drivers'); // Redireciona para a lista de motoristas
            }, 1000); // tempo para o usuário ver a notificação 
          } else {
            showError(result.error);
          }
        } catch (error) {
          console.error("Erro ao excluir motorista:", error);
          showError("Não foi possível excluir o motorista. Tente novamente mais tarde.");
        }
      }
    });
  };

  // Configurar ações do motorista
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeleteDriver
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditDriver
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {driver && (
        <>
          <DetailHeader
            title={driver.nome}
            icon="bi-person-fill-gear"
            badges={[
              {
                icon: "bi-award",
                text: driver.status_nome || getStatusMotoristaName(driver.status_motorista_id)
              },
              ...(driver.cpf ? [{
                icon: "bi-card-text",
                text: driver.cpf
              }] : [])
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection 
              title="Informações Pessoais" 
              icon="bi-person-vcard"
            >
              <DetailItem 
                icon="bi-person" 
                label="Nome Completo" 
                value={driver.nome} 
              />
              <DetailItem 
                icon="bi-card-text" 
                label="CPF" 
                value={driver.cpf} 
              />
              <DetailItem 
                icon="bi-telephone" 
                label="Telefone" 
                value={driver.telefone} 
              />
              <DetailItem 
                icon="bi-envelope" 
                label="E-mail" 
                value={driver.email} 
              />
              <DetailItem 
                icon="bi-calendar-plus" 
                label="Data de Admissão" 
                value={driver.data_admissao} 
              />
            </DetailSection>

            <DetailSection 
              title="Informações da CNH" 
              icon="bi-credit-card"
            >
              <DetailItem 
                icon="bi-credit-card" 
                label="Número da CNH" 
                value={driver.cnh_numero} 
              />
              <DetailItem 
                icon="bi-award" 
                label="Categoria" 
                value={driver.cnh_categoria} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Validade da CNH" 
                value={driver.cnh_validade} 
              />
              <DetailItem 
                icon="bi-info-circle" 
                label="Status" 
                value={driver.status_nome || getStatusMotoristaName(driver.status_motorista_id)} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Motorista"
            description="Editar informações ou remover motorista do sistema"
            actions={actions}
          />

          <DetailDebug data={driver} />
        </>
      )}
      
      <PopUpComponent ref={popUpRef} />

      <Dialog ref={dialogRef} />

      <Notification notification={notification} onClose={hideNotification} />
    </DetailPage>
  );
}

export default DriverDetail;
