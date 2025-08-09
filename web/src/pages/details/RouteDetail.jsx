import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/ui/PopUpComponent';
import RouteForm from "@web/components/pageComponents/routes/RouteForm";
import Notification from '@web/components/common/Notification';

import { useRoutes } from '@web/hooks/useRoutes';
import { useRouteWithStops } from '@web/hooks/useRouteWithStops';
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
  const { updateRoute, deleteRoute, getStatusRotaNome } = useRoutes();
  
  // Usar o hook para buscar rota com pontos e associações
  const { getRouteWithAssignments } = useRouteWithStops();
  
  // Usar o hook de detail page
  const { data: route, loading, error, refetch } = useDetailPage(getRouteWithAssignments, routeId);

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

  // Função para navegar para edição completa da rota com pontos
  const handleEditRouteWithStops = () => {
    console.log('Navegando para edição de rota com pontos:', `/routes/${routeId}/edit`);
    navigate(`/routes/${routeId}/edit`);
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
      text: "Editar Rota e Pontos",
      icon: "bi-map",
      variant: "btn-primary",
      onClick: handleEditRouteWithStops
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

          {/* Seção de Ônibus e Motorista */}
          {(route.onibus_nome || route.motorista_nome) && (
            <DetailContainer columns={2}>
              {route.onibus_nome && (
                <DetailSection 
                  title="Ônibus Designado" 
                  icon="bi-bus-front"
                >
                  <DetailItem 
                    icon="bi-bus-front" 
                    label="Nome do Ônibus" 
                    value={route.onibus_nome} 
                  />
                  <DetailItem 
                    icon="bi-card-text" 
                    label="Placa" 
                    value={route.onibus_placa || 'Não informado'} 
                  />
                </DetailSection>
              )}

              {route.motorista_nome && (
                <DetailSection 
                  title="Motorista Designado" 
                  icon="bi-person-badge"
                >
                  <DetailItem 
                    icon="bi-person" 
                    label="Nome do Motorista" 
                    value={route.motorista_nome} 
                  />
                  <DetailItem 
                    icon="bi-credit-card" 
                    label="CNH" 
                    value={route.motorista_cnh || 'Não informado'} 
                  />
                </DetailSection>
              )}
            </DetailContainer>
          )}

          {/* Seção de Pontos da Rota */}
          {route.pontos && route.pontos.length > 0 && (
            <DetailSection 
              title={`Pontos da Rota (${route.pontos.length})`}
              icon="bi-geo-alt-fill"
              className="mt-4"
            >
              <div className="row g-3">
                {route.pontos.map((ponto, index) => (
                  <div key={ponto.ponto_rota_id || index} className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="badge bg-primary rounded-circle me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {ponto.ordem}
                          </div>
                          <h6 className="card-title mb-0 fw-semibold">{ponto.nome}</h6>
                        </div>
                        
                        {(ponto.logradouro || ponto.bairro || ponto.cidade) && (
                          <p className="card-text text-muted small mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {[ponto.logradouro, ponto.bairro, ponto.cidade].filter(Boolean).join(', ')}
                          </p>
                        )}
                        
                        {ponto.horario_previsto_passagem && (
                          <p className="card-text text-muted small mb-0">
                            <i className="bi bi-clock me-1"></i>
                            Horário previsto: {ponto.horario_previsto_passagem}
                          </p>
                        )}
                        
                        <p className="card-text text-muted small mb-0">
                          <i className="bi bi-geo me-1"></i>
                          Lat: {ponto.latitude}, Lng: {ponto.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Observações da Associação */}
          {route.observacoes_assignment && (
            <DetailSection 
              title="Observações" 
              icon="bi-journal-text"
              className="mt-4"
            >
              <DetailItem 
                icon="bi-chat-text" 
                label="Observações da Designação" 
                value={route.observacoes_assignment} 
              />
            </DetailSection>
          )}

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
