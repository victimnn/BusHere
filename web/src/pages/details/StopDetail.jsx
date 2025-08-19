import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/core/feedback/PopUpComponent';
import StopForm from "@web/components/domain/stops/StopForm";
import { Notification } from '@web/components/common';
import Dialog from '@web/components/common/feedback/Dialog';

import { useStops, useDetailPage, useNotification } from '@web/hooks';
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

function StopDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Ponto", true, true); }, [pageFunctions]);
  
  const navigate = useNavigate();
  const { stopId } = useParams();
  const popUpRef = useRef(null);
  const dialogRef = useRef(null);
  
  // Usar o hook de pontos
  const { getStopById, updateStop, deleteStop } = useStops();
  
  // Usar o hook de detail page
  const { data: stop, loading, error, refetch } = useDetailPage(getStopById, stopId);

  // Hook para notificações
    const { notification, hideNotification, showSuccess, showError } = useNotification();

  const handleEditStop = () => {

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
            refetch(); // Atualiza os dados da página
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteStop = async () => {
    dialogRef.current.showConfirm({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este ponto?",
      type: "danger",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          const result = await deleteStop(stop.id || stop.ponto_id);
          if (result.success) {
            showSuccess("Ponto excluído com sucesso!");
            setTimeout(() => {
              navigate('/stops'); // Redireciona para a lista de pontos
            }, 1000); // tempo para o usuário ver a notificação 
          } else {
            showError(result.error);
          }
        } catch (error) {
          console.error("Erro ao excluir ponto:", error);
          showError("Não foi possível excluir o ponto. Tente novamente mais tarde.");
        }
      }
    });
  };

  // Configurar ações do ponto
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeleteStop
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditStop
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {stop && (
        <>
          <DetailHeader
            title={stop.nome}
            icon="bi-geo-alt-fill"
            badges={[
              {
                icon: "bi-info-circle",
                text: stop.status || (stop.ativo ? 'Ativo' : 'Inativo')
              }
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection 
              title="Informações Básicas" 
              icon="bi-geo"
            >
              <DetailItem 
                icon="bi-signpost" 
                label="Nome do Ponto" 
                value={stop.nome} 
              />
              <DetailItem 
                icon="bi-geo-alt" 
                label="Coordenadas" 
                value={stop.coordinates || `${Number(stop.latitude).toFixed(4)}, ${Number(stop.longitude).toFixed(4)}`} 
              />
              <DetailItem 
                icon="bi-map" 
                label="Endereço" 
                value={stop.endereco || stop.address || 'Não informado'} 
              />
              <DetailItem 
                icon="bi-info-circle" 
                label="Referência" 
                value={stop.referencia || 'Não informado'} 
              />
            </DetailSection>

            <DetailSection 
              title="Informações de Localização" 
              icon="bi-pin-map"
            >
              <DetailItem 
                icon="bi-geo" 
                label="Logradouro/Número" 
                value={`${stop.logradouro || 'Não informado'}, ${stop.numero_endereco || 'Não informado'}`} 
              />
              <DetailItem 
                icon="bi-building" 
                label="Bairro" 
                value={stop.bairro || 'Não informado'} 
              />
              <DetailItem 
                icon="bi-geo-alt" 
                label="Cidade/UF" 
                value={stop.cidade && stop.uf ? `${stop.cidade} - ${stop.uf}` : 'Não informado'} 
              />
              <DetailItem 
                icon="bi-mailbox" 
                label="CEP" 
                value={stop.cep || 'Não informado'} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Ponto"
            description="Editar informações ou remover ponto do sistema"
            actions={actions}
          />

          <DetailDebug data={stop} />
        </>
      )}
      
      <PopUpComponent ref={popUpRef} />
      <Dialog ref={dialogRef} />

      <Notification notification={notification} onClose={hideNotification} />
    </DetailPage>
  );
}

export default StopDetail;