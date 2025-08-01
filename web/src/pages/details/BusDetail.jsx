import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/PopUpComponent';
import BusForm from '@web/components/buses/BusForm';
import Notification from '@web/components/common/Notification';

import { useBuses } from '@web/hooks/useBuses';
import { useDetailPage } from '@web/hooks/useDetailPage';
import { useNotification } from '@web/hooks/useNotification';
import { formatDateFromDatabase } from '@shared/formatters';

import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/details';

function BusDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Ônibus", true, true); }, [pageFunctions]);
  
  const navigate = useNavigate();
  const { busId } = useParams();
  const popUpRef = useRef(null);
  
  // Usar o hook de ônibus
  const { getBusById, updateBus, deleteBus } = useBuses();
  
  // Usar o hook de detail page
  const { data: bus, loading, error, refetch } = useDetailPage(getBusById, busId);

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  const handleEditBus = () => {
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
      status_onibus_id: bus.status_onibus_id
    };
    
    popUpRef.current.show({
      title: `Editar Ônibus: ${bus.nome}`,
      content: BusForm,
      props: {
        initialData,
        onSubmit: async (formData) => {
          try {
            const result = await updateBus(bus.id || bus.onibus_id, formData);
            if (result.success) {
              popUpRef.current.hide();
              refetch(); // Recarrega os dados usando o hook
              showSuccess("Ônibus atualizado com sucesso!");
            } else {
              showError(result.error);
            }
          } catch (err) {
            showError(`Erro ao atualizar ônibus: ${err.message || "Tente novamente mais tarde"}`);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteBus = async () => {
    if (window.confirm("Tem certeza que deseja excluir este ônibus?")) {
      try {
        const result = await deleteBus(bus.id || bus.onibus_id);
        if (result.success) {
          showSuccess("Ônibus excluído com sucesso!");
          setTimeout(() => {
            navigate('/buses'); // Redireciona para a lista de ônibus
          }, 1000); // tempo para o usuário ver a notificação 
        } else {
          showError(result.error);
        }
      } catch (error) {
        console.error("Erro ao excluir ônibus:", error);
        showError("Não foi possível excluir o ônibus. Tente novamente mais tarde.");
      }
    }
  };

  // Configurar ações do ônibus
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeleteBus
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditBus
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {bus && (
        <>
          <DetailHeader 
            title={bus.nome}
            icon="bi-bus-front-fill"
            subtitle={`Placa: ${bus.placa}`}
            badges={[
              ...(bus.status_onibus ? [{
                icon: "bi-reward", 
                text: bus.status_onibus.nome, 
                variant: bus.status_onibus.cor 
              }] : []),
              {
                icon: "bi-calendar-event",
                text: formatDateFromDatabase(bus.data_proxima_manutencao)
              }
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection 
              title="Detalhes do Ônibus"
              icon="bi-info-circle"
            >
              <DetailItem 
                icon="bi-bus-front-fill"
                label="Modelo" 
                value={bus.modelo} 
              />
              <DetailItem 
                icon="bi-bus-front-fill" 
                label="Marca" 
                value={bus.marca} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Ano de Fabricação" 
                value={bus.ano_fabricacao} 
              />
              <DetailItem 
                icon="bi-people" 
                label="Capacidade" 
                value={`${bus.capacidade} passageiros`} 
              />
            </DetailSection>

            <DetailSection 
              title="Manutenção"
              icon="bi-gear-wide-connected"
            >
              <DetailItem 
                icon="bi-speedometer" 
                label="Quilometragem" 
                value={`${bus.quilometragem} km`} 
              />
              <DetailItem 
                icon="bi-calendar-check" 
                label="Última Manutenção" 
                value={formatDateFromDatabase(bus.data_ultima_manutencao)} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Próxima Manutenção" 
                value={formatDateFromDatabase(bus.data_proxima_manutencao)} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Ônibus"
            description="Editar informações ou remover ônibus do sistema"
            actions={actions}
          />

          <DetailDebug data={bus} />
        </>
      )}

      <PopUpComponent ref={popUpRef} />

      <Notification
        notification={notification}
        onClose={hideNotification}
      />
    </DetailPage>
  );
}

export default BusDetail;