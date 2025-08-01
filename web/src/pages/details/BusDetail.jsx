import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PopUpComponent from '@web/components/PopUpComponent';
import BusForm from '@web/components/buses/BusForm';
import BusDetails from '@web/components/buses/BusDetails';
import LoadingSpinner from '@web/components/common/LoadingSpinner';
import ErrorAlert from '@web/components/common/ErrorAlert';
import Notification from '@web/components/common/Notification';
import { useBuses } from '@web/hooks/useBuses';
import { useDetailPage } from '@web/hooks/useDetailPage';
import { useNotification } from '@web/hooks/useNotification';

function BusDetail({ pageFunctions }) {
  useEffect(() => { 
    pageFunctions.set("Ônibus", true, true); 
  }, [pageFunctions]);
  
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

  if (loading) {
    return (
      <main className="p-3 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <LoadingSpinner 
          size="large" 
          message="Carregando detalhes do ônibus..." 
          variant="primary"
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-3">
        <ErrorAlert 
          error={error}
          onRetry={refetch}
          variant="danger"
        />
      </main>
    );
  }

  if (!bus) {
    return (
      <main className="p-3">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Ônibus não encontrado.
        </div>
      </main>
    );
  }

  return (
    <main className="p-3">
      <BusDetails 
        bus={bus}
        onEdit={handleEditBus}
        onDelete={handleDeleteBus}
      />
      
      <PopUpComponent ref={popUpRef} />
      
      {/* Componente de Notificação */}
      <Notification 
        notification={notification} 
        onClose={hideNotification} 
      />
    </main>
  );
}

export default BusDetail;