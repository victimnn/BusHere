import React, { useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/ui/PopUpComponent';
import PassengerForm from '@web/components/pageComponents/passengers/PassengerForm';
import Notification from '@web/components/common/Notification';

import { usePassengers } from '@web/hooks/usePassengers';
import { useDetailPage } from '@web/hooks/useDetailPage';
import { useNotification } from '@web/hooks/useNotification';

import { formatCPF, formatPhoneNumber, formatDateFromDatabase } from '@shared/formatters';

import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/pageComponents/details';

function PassengerDetailPage({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Passageiro", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { passengerId } = useParams();
  const popUpRef = useRef(null);
  
  // Usar o hook de passageiros
  const { getPassengerById, updatePassenger, deletePassenger, getTipoPassageiroNome } = usePassengers();

  // Usar o hook de detail page
  const { data: passenger, loading, error, refetch } = useDetailPage(getPassengerById, passengerId);

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

    const handleEditPassenger = () => {
    const initialData = {
      nome: passenger.nome_completo,
      cpf: passenger.cpf,
      email: passenger.email,
      telefone: passenger.telefone,
      tipo_passageiro: passenger.tipo_passageiro_id,
      data_nascimento: passenger.data_nascimento
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
              alert(result.error);
            }
          } catch (err) {
            alert(`Erro ao atualizar passageiro: ${err.message || "Tente novamente mais tarde"}`);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  };

  const handleDeletePassenger = async () => {
    if (window.confirm("Tem certeza que deseja excluir este passageiro?")) {
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
  };

  const formatAddress = (p) => {
    if (!p.logradouro) return "Não informado";
    const parts = [
      p.logradouro,
      p.numero_endereco,
      p.complemento_endereco,
      p.bairro && `- ${p.bairro}`,
      p.cidade,
      p.uf && `- ${p.uf}`,
      p.cep && `CEP: ${p.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}`
    ].filter(Boolean);
    return parts.join(', ').replace(', -', ' -');
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
              <DetailItem 
                icon="bi-geo-alt" 
                label="Endereço" 
                value={formatAddress(passenger)} 
              />
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

      <Notification notification={notification} onClose={hideNotification} />

    </DetailPage>
  );
}

export default PassengerDetailPage;