import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/core/feedback/PopUpComponent';
import VehicleForm from '@web/components/domain/vehicles/VehicleForm';
import Notification from '@web/components/common/feedback/Notification';
import Dialog from '@web/components/common/feedback/Dialog';

import { useVehicles, useDetailPage, useNotification } from '@web/hooks';
import { formatDateFromDatabase } from '@shared/formatters';

import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/features/details';

// Função para determinar o ícone baseado no tipo de veículo
const getVehicleIcon = (tipoNome) => {
  if (!tipoNome) return 'bi-car-front-fill';
  
  const tipo = tipoNome.toLowerCase();
  
  if (tipo.includes('ônibus') || tipo.includes('onibus') || tipo.includes('micro-ônibus') || tipo.includes('micro-onibus')) {
    return 'bi-bus-front-fill';
  } else if (tipo.includes('van')) {
    return 'bi-truck';
  } else {
    return 'bi-car-front-fill';
  }
};

function VehicleDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Veículos", true, true); }, [pageFunctions]);
  
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const popUpRef = useRef(null);
  const dialogRef = useRef(null);
  
  // Usar o hook de veículos
  const { getVehicleById, updateVehicle, deleteVehicle } = useVehicles();
  
  // Usar o hook de detail page
  const { data: vehicle, loading, error, refetch } = useDetailPage(getVehicleById, vehicleId);

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  const handleEditVehicle = () => {
    const initialData = {
      nome: vehicle.nome,
      placa: vehicle.placa,
      tipo_veiculo_id: vehicle.tipo_veiculo_id,
      modelo: vehicle.modelo,
      marca: vehicle.marca,
      ano_fabricacao: vehicle.ano_fabricacao,
      capacidade: vehicle.capacidade,
      data_ultima_manutencao: vehicle.data_ultima_manutencao,
      data_proxima_manutencao: vehicle.data_proxima_manutencao,
      quilometragem: vehicle.quilometragem,
      status_veiculo_id: vehicle.status_veiculo_id
    };
    
    popUpRef.current.show({
      title: `Editar Veículo: ${vehicle.nome}`,
      content: VehicleForm,
      props: {
        initialData,
        onSubmit: async (formData) => {
          try {
            const result = await updateVehicle(vehicle.id || vehicle.veiculo_id, formData);
            if (result.success) {
              popUpRef.current.hide();
              refetch(); // Recarrega os dados usando o hook
              showSuccess("Veículo atualizado com sucesso!");
            } else {
              showError(result.error);
            }
          } catch (err) {
            showError(`Erro ao atualizar veículo: ${err.message || "Tente novamente mais tarde"}`);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteVehicle = async () => {
    dialogRef.current.showConfirm({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este veículo?",
      type: "danger",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          const result = await deleteVehicle(vehicle.id || vehicle.veiculo_id);
          if (result.success) {
            showSuccess("Veículo excluído com sucesso!");
            setTimeout(() => {
              navigate('/vehicles'); // Redireciona para a lista de veículos
            }, 1000); // tempo para o usuário ver a notificação 
          } else {
            showError(result.error);
          }
        } catch (error) {
          console.error("Erro ao excluir veículo:", error);
          showError("Não foi possível excluir o veículo. Tente novamente mais tarde.");
        }
      }
    });
  };

  // Configurar ações do veículo
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeleteVehicle
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditVehicle
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {vehicle && (
        <>
          <DetailHeader 
            title={vehicle.nome}
            icon={getVehicleIcon(vehicle.tipo_nome)}
            subtitle={`Placa: ${vehicle.placa}`}
            badges={[
              ...(vehicle.status_nome ? [{
                icon: "bi-reward", 
                text: vehicle.status_nome, 
                variant: "success" 
              }] : []),
              ...(vehicle.tipo_nome ? [{
                icon: getVehicleIcon(vehicle.tipo_nome),
                text: vehicle.tipo_nome,
                variant: "info"
              }] : []),
              {
                icon: "bi-calendar-event",
                text: formatDateFromDatabase(vehicle.data_proxima_manutencao)
              }
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection 
              title="Detalhes do Veículo"
              icon="bi-info-circle"
            >
              <DetailItem 
                icon={getVehicleIcon(vehicle.tipo_nome)}
                label="Tipo de Veículo" 
                value={vehicle.tipo_nome} 
              />
              <DetailItem 
                icon="bi-car-front-fill"
                label="Modelo" 
                value={vehicle.modelo} 
              />
              <DetailItem 
                icon="bi-building" 
                label="Marca" 
                value={vehicle.marca} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Ano de Fabricação" 
                value={vehicle.ano_fabricacao} 
              />
              <DetailItem 
                icon="bi-people" 
                label="Capacidade" 
                value={`${vehicle.capacidade} passageiros`} 
              />
            </DetailSection>

            <DetailSection 
              title="Manutenção"
              icon="bi-gear-wide-connected"
            >
              <DetailItem 
                icon="bi-speedometer" 
                label="Quilometragem" 
                value={`${vehicle.quilometragem} km`} 
              />
              <DetailItem 
                icon="bi-calendar-check" 
                label="Última Manutenção" 
                value={formatDateFromDatabase(vehicle.data_ultima_manutencao)} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Próxima Manutenção" 
                value={formatDateFromDatabase(vehicle.data_proxima_manutencao)} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Veículo"
            description="Editar informações ou remover veículo do sistema"
            actions={actions}
          />

          <DetailDebug data={vehicle} />
        </>
      )}

      <PopUpComponent ref={popUpRef} />

      <Dialog ref={dialogRef} />

      <Notification
        notification={notification}
        onClose={hideNotification}
      />
    </DetailPage>
  );
}

export default VehicleDetail;
