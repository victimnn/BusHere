import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/ui/PopUpComponent';
import RouteForm from "@web/components/pageComponents/routes/RouteForm";
import Notification from '@web/components/common/Notification';

import { useRoutes } from '@web/hooks/useRoutes';
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
} from '@web/components/pageComponents/details';

function RouteDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Rota", true, true); }, [pageFunctions]);
  
  const navigate = useNavigate();
  const { routeId } = useParams();
  const popUpRef = useRef(null);
  
  // Usar o hook de rotas
  const { getRouteById, updateRoute, deleteRoute, getStatusRotaNome } = useRoutes();
  
  // Usar o hook de detail page
  const { data: route, loading, error, refetch } = useDetailPage(getRouteById, routeId);

  // Hook para notificações
    const { notification, hideNotification, showSuccess, showError } = useNotification();

  const handleEditRoute = () => {
    const initialData = {
      codigo_rota: route.codigo_rota,
      nome: route.nome,
      origem_descricao: route.origem_descricao,
      destino_descricao: route.destino_descricao,
      distancia_km: route.distancia_km,
      tempo_viagem_estimado_minutos: route.tempo_viagem_estimado_minutos,
      status_rota_id: route.status_rota_id,
      ativo: route.ativo
    };
    
    popUpRef.current.show({
      title: `Editar Rota: ${route.nome}`,
      content: RouteForm,
      props: {
        initialData,
        onSubmit: async (formData) => {
          try {
            const result = await updateRoute(route.id || route.rota_id, formData);
            if (result.success) {
              popUpRef.current.hide();
              refetch(); // Recarrega os dados usando o hook
              showSuccess("Rota atualizada com sucesso!");
            } else {
              showError(result.error);
            }
          } catch (err) {
            showError(`Erro ao atualizar rota: ${err.message || "Tente novamente mais tarde"}`);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeleteRoute = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        const result = await deleteRoute(route.id || route.rota_id);
        if (result.success) {
          showSuccess("Rota excluída com sucesso!");
          setTimeout(() => {
            navigate('/routes'); // Redireciona para a lista de rotas
          }, 1000); // tempo para o usuário ver a notificação 
        } else {
          showError(result.error);
        }
      } catch (error) {
        console.error("Erro ao excluir rota:", error);
        showError("Não foi possível excluir a rota. Tente novamente mais tarde.");
      }
    }
  };

  // Configurar ações da rota
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeleteRoute
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditRoute
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {route && (
        <>
          <DetailHeader
            title={route.nome}
            icon="bi-geo-alt-fill"
            badges={[
              {
                icon: "bi-info-circle",
                text: route.status_nome || getStatusRotaNome(route.status_rota_id)
              },
              ...(route.codigo_rota ? [{
                icon: "bi-tag",
                text: route.codigo_rota
              }] : [])
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection 
              title="Informações Básicas" 
              icon="bi-map"
            >
              <DetailItem 
                icon="bi-signpost" 
                label="Nome da Rota" 
                value={route.nome} 
              />
              <DetailItem 
                icon="bi-tag" 
                label="Código da Rota" 
                value={route.codigo_rota} 
              />
              <DetailItem 
                icon="bi-geo" 
                label="Origem" 
                value={route.origem_descricao} 
              />
              <DetailItem 
                icon="bi-geo-alt" 
                label="Destino" 
                value={route.destino_descricao} 
              />
            </DetailSection>

            <DetailSection 
              title="Informações Técnicas" 
              icon="bi-speedometer2"
            >
              <DetailItem 
                icon="bi-rulers" 
                label="Distância (km)" 
                value={route.distancia_km ? `${route.distancia_km} km` : 'Não informado'} 
              />
              <DetailItem 
                icon="bi-clock" 
                label="Tempo Estimado" 
                value={route.tempo_viagem_estimado_minutos ? `${route.tempo_viagem_estimado_minutos} min` : 'Não informado'} 
              />
              <DetailItem 
                icon="bi-info-circle" 
                label="Status" 
                value={route.status_nome || getStatusRotaNome(route.status_rota_id)} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações da Rota"
            description="Editar informações ou remover rota do sistema"
            actions={actions}
          />

          <DetailDebug data={route} />
        </>
      )}
      
      <PopUpComponent ref={popUpRef} />

      <Notification notification={notification} onClose={hideNotification} />
    </DetailPage>
  );
}

export default RouteDetail;
