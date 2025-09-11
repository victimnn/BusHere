import React, { useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/core/feedback/PopUpComponent';
import PassengerForm from '@web/components/domain/passengers/PassengerForm';
import Notification from '@web/components/common/feedback/Notification';
import Dialog from '@web/components/common/feedback/Dialog';

import { usePassengers, useDetailPage, useNotification, useRoutes, useStops } from '@web/hooks';

import { formatCPF, formatPhoneNumber, formatDateFromDatabase, formatCEP } from '@shared/formatters';

import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/features/details';

function PassengerDetailPage({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Passageiro", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { passengerId } = useParams();
  const popUpRef = useRef(null);
  const dialogRef = useRef(null);
  
  // Usar o hook de passageiros
  const { getPassengerById, updatePassenger, deletePassenger, getTipoPassageiroNome } = usePassengers();

  // Usar o hook de detail page
  const { data: passenger, loading, error, refetch } = useDetailPage(getPassengerById, passengerId);

  // Hooks para buscar dados relacionados
  const { routes, getRouteById } = useRoutes();
  const { stops, getStopById } = useStops();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

    const handleEditPassenger = () => {
    const initialData = {
      nome: passenger.nome_completo,
      cpf: passenger.cpf,
      email: passenger.email,
      telefone: passenger.telefone,
      tipo_passageiro: passenger.tipo_passageiro_id,
      data_nascimento: passenger.data_nascimento,
      pcd: passenger.pcd,
      // Dados de endereço
      cep: passenger.cep,
      logradouro: passenger.logradouro,
      numero_endereco: passenger.numero_endereco,
      complemento_endereco: passenger.complemento_endereco,
      bairro: passenger.bairro,
      cidade: passenger.cidade,
      uf: passenger.uf,
      // Relacionamentos
      rota_id: passenger.rota_id,
      ponto_id: passenger.ponto_id
    };
    
    popUpRef.current.show({
      title: `Editar Passageiro: ${passenger.nome_completo}`,
      content: PassengerForm,
      props: {
        initialData,
        onSubmit: async (formData) => {
          try {
            const result = await updatePassenger(passengerId, formData);
            if (result.success) {
              popUpRef.current.hide();
              refetch(); // Recarrega os dados usando o hook
              showSuccess("Passageiro atualizado com sucesso!");
            } else {
              dialogRef.current.showAlert({
                title: "Erro",
                message: result.error,
                type: "danger",
                buttonText: "OK"
              });
            }
          } catch (err) {
            dialogRef.current.showAlert({
              title: "Erro",
              message: `Erro ao atualizar passageiro: ${err.message || "Tente novamente mais tarde"}`,
              type: "danger",
              buttonText: "OK"
            });
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeletePassenger = async () => {
    dialogRef.current.showConfirm({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir este passageiro?",
      type: "danger",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          const result = await deletePassenger(passengerId);
          if (result.success) {
            showSuccess("Passageiro excluido com sucesso!");
            setTimeout(() => {
              navigate('/passengers'); // Redireciona para a lista de passageiros
            }, 1000); // tempo para o usuário ver a notificação
          } else {
            popUpRef.current.show({
              title: "Erro",
              content: () => <div>{result.error}</div>,
            });
          }
        } catch (error) {
          console.error("Erro ao excluir passageiro:", error);
          popUpRef.current.show({
            title: "Erro",
            content: () => <div>Não foi possível excluir o passageiro. Tente novamente mais tarde.</div>,
          });
        }
      }
    });
  };

  // Função para formatar endereço completo
  const formatAddress = (p) => {
    if (!p.logradouro) return "Não informado";
    const parts = [
      p.logradouro,
      p.numero_endereco,
      p.complemento_endereco,
      p.bairro && `- ${p.bairro}`,
      p.cidade,
      p.uf && `- ${p.uf}`,
      p.cep && `CEP: ${formatCEP(p.cep)}`
    ].filter(Boolean);
    return parts.join(', ').replace(', -', ' -');
  };

  // Função para buscar dados da rota
  const getRouteInfo = (rotaId) => {
    if (!rotaId) return null;
    const route = routes.find(r => r.rota_id === rotaId) || getRouteById?.(rotaId);
    return route ? {
      nome: route.nome,
      status: route.status_rota_nome || 'Ativa'
    } : null;
  };

  // Função para buscar dados do ponto
  const getStopInfo = (pontoId) => {
    if (!pontoId) return null;
    const stop = stops.find(s => s.ponto_id === pontoId) || getStopById?.(pontoId);
    return stop ? {
      nome: stop.nome,
      cidade: stop.cidade,
      uf: stop.uf
    } : null;
  };

  // Função para formatar status PCD
  const formatPCDStatus = (pcd) => {
    if (pcd === null || pcd === undefined) return "Não informado";
    return pcd ? "Sim" : "Não";
  };

  // Configurar ações do passageiro
  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: handleDeletePassenger
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: handleEditPassenger
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {passenger && (
        <>
          <DetailHeader
            title={passenger.nome_completo}
            icon="bi-person-fill"
            badges={[
              {
                icon: "bi-person-badge",
                text: getTipoPassageiroNome(passenger.tipo_passageiro_id)
              },
              ...(passenger.cpf ? [{
                icon: "bi-card-text",
                text: formatCPF(passenger.cpf)
              }] : []),
              ...(passenger.pcd ? [{
                icon: "bi-person-heart",
                text: "PCD",
                variant: "bg-info"
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
                value={passenger.nome_completo} 
              />
              <DetailItem 
                icon="bi-card-text" 
                label="CPF" 
                value={passenger.cpf} 
                formatter={formatCPF} 
              />
              <DetailItem 
                icon="bi-calendar-event" 
                label="Data de Nascimento" 
                value={passenger.data_nascimento} 
                formatter={formatDateFromDatabase} 
              />
              <DetailItem 
                icon="bi-person-heart" 
                label="Pessoa com Deficiência (PCD)" 
                value={passenger.pcd} 
                formatter={formatPCDStatus} 
              />
              {passenger.data_criacao && (
                <DetailItem 
                  icon="bi-calendar-plus" 
                  label="Data de Cadastro" 
                  value={passenger.data_criacao} 
                  formatter={formatDateFromDatabase} 
                />
              )}
            </DetailSection>

            <DetailSection 
              title="Informações de Contato" 
              icon="bi-telephone"
            >
              <DetailItem 
                icon="bi-envelope" 
                label="E-mail" 
                value={passenger.email} 
              />
              <DetailItem 
                icon="bi-telephone" 
                label="Telefone" 
                value={passenger.telefone} 
                formatter={formatPhoneNumber} 
              />
            </DetailSection>
          </DetailContainer>

          <DetailContainer columns={2}>
            <DetailSection 
              title="Endereço" 
              icon="bi-geo-alt"
            >
              <DetailItem 
                icon="bi-geo-alt" 
                label="Endereço Completo" 
                value={formatAddress(passenger)} 
              />
              {passenger.cep && (
                <DetailItem 
                  icon="bi-mailbox" 
                  label="CEP" 
                  value={passenger.cep} 
                  formatter={formatCEP} 
                />
              )}
              {passenger.logradouro && (
                <DetailItem 
                  icon="bi-signpost" 
                  label="Logradouro" 
                  value={passenger.logradouro} 
                />
              )}
              {passenger.numero_endereco && (
                <DetailItem 
                  icon="bi-hash" 
                  label="Número" 
                  value={passenger.numero_endereco} 
                />
              )}
              {passenger.complemento_endereco && (
                <DetailItem 
                  icon="bi-plus-circle" 
                  label="Complemento" 
                  value={passenger.complemento_endereco} 
                />
              )}
              {passenger.bairro && (
                <DetailItem 
                  icon="bi-building" 
                  label="Bairro" 
                  value={passenger.bairro} 
                />
              )}
              {passenger.cidade && (
                <DetailItem 
                  icon="bi-geo" 
                  label="Cidade" 
                  value={passenger.cidade} 
                />
              )}
              {passenger.uf && (
                <DetailItem 
                  icon="bi-flag" 
                  label="UF" 
                  value={passenger.uf} 
                />
              )}
            </DetailSection>

            <DetailSection 
              title="Informações de Transporte" 
              icon="bi-bus-front"
            >
              {passenger.rota_id ? (
                <>
                  <DetailItem 
                    icon="bi-bus-front" 
                    label="Rota" 
                    value={getRouteInfo(passenger.rota_id)?.nome || passenger.rota_nome || "Carregando..."} 
                  />
                  <DetailItem 
                    icon="bi-check-circle" 
                    label="Status da Rota" 
                    value={getRouteInfo(passenger.rota_id)?.status || "Ativa"} 
                  />
                </>
              ) : (
                <DetailItem 
                  icon="bi-exclamation-triangle" 
                  label="Rota" 
                  value="Nenhuma rota associada" 
                />
              )}
              
              {passenger.ponto_id ? (
                <>
                  <DetailItem 
                    icon="bi-geo-alt-fill" 
                    label="Ponto de Embarque" 
                    value={getStopInfo(passenger.ponto_id)?.nome || passenger.ponto_nome || "Carregando..."} 
                  />
                  {getStopInfo(passenger.ponto_id)?.cidade && (
                    <DetailItem 
                      icon="bi-geo" 
                      label="Localização" 
                      value={`${getStopInfo(passenger.ponto_id)?.cidade}, ${getStopInfo(passenger.ponto_id)?.uf}`} 
                    />
                  )}
                </>
              ) : (
                <DetailItem 
                  icon="bi-exclamation-triangle" 
                  label="Ponto de Embarque" 
                  value="Nenhum ponto associado" 
                />
              )}
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Passageiro"
            description="Editar informações ou remover passageiro do sistema"
            actions={actions}
          />

          <DetailDebug data={passenger} />
        </>
      )}
      
      <PopUpComponent ref={popUpRef} />
      <Dialog ref={dialogRef} />

      <Notification notification={notification} onClose={hideNotification} />

    </DetailPage>
  );
}

export default PassengerDetailPage;