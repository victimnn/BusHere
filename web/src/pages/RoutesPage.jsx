import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/ui/PopUpComponent";
import RouteDetails from "@web/components/pageComponents/routes/RouteDetails";
import RouteForm from "@web/components/pageComponents/routes/RouteForm";
import RouteStops from "@web/components/pageComponents/routes/RouteStops";
import RouteStatsCards from "@web/components/pageComponents/routes/RouteStatsCards";
import Table from "@web/components/ui/Table";
import TableActionButton from "@web/components/common/table/TableActionButton";
import Notification from "@web/components/common/Notification";
import LoadingSpinner from "@web/components/common/LoadingSpinner";
import ErrorAlert from "@web/components/common/ErrorAlert";
import ActionButton from "@web/components/common/ActionButton";
import { useRoutes, useRouteWithStops, useNotification } from "@web/hooks";
import { formatDateFromDatabase, getStatusFormat, formatKilometers, formatTime } from "@shared/formatters";
import { useNavigate } from "react-router-dom";

// Função para formatar status como JSX usando a função utilitária
const formatStatus = (value) => {
  const { className, text } = getStatusFormat(value);
  return React.createElement('span', { className }, text);
};

function RoutesPage({ pageFunctions }) {
  const popUpRef = useRef(null);
  const navigate = useNavigate();
  // Usar hook customizado para gerenciar dados das rotas
  const {
    routes,
    isLoading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    refetch
  } = useRoutes();

  // Hook para operações com associações ônibus-motorista
  const { updateRouteWithAssignment } = useRouteWithStops();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Rotas", true, true);
  }, [pageFunctions]);

  // Handler para visualizar pontos da rota
  const handleViewStops = useCallback((route) => {
    popUpRef.current.show({
      title: `Pontos da Rota: ${route.nome}`,
      content: RouteStops,
      props: {
        route: route,
      }
    });
  }, []);

  // header da tabela
  const TABLE_HEADERS = [
    { id: "rota_id", label: "ID", sortable: true },
    { id: "codigo_rota", label: "Código", sortable: true },
    { id: "nome", label: "Nome", sortable: true },
    { id: "origem_descricao", label: "Origem", sortable: true },
    { id: "destino_descricao", label: "Destino", sortable: true },
    { id: "onibus_nome", 
      label: "Ônibus", 
      sortable: true,
      formatter: (value, route) => {
        if (!value) return <span className="text-muted">Não atribuído</span>;
        return (
          <div className="d-flex flex-column">
            <small className="fw-semibold">{value}</small>
            {route.onibus_placa && <small className="text-muted">{route.onibus_placa}</small>}
          </div>
        );
      }
    },
    { id: "motorista_nome", 
      label: "Motorista", 
      sortable: true,
      formatter: (value, route) => {
        if (!value) return <span className="text-muted">Não atribuído</span>;
        return (
          <div className="d-flex flex-column">
            <small className="fw-semibold">{value}</small>
            {route.motorista_cnh && <small className="text-muted">CNH: {route.motorista_cnh}</small>}
          </div>
        );
      }
    },
    { id: "distancia_km", 
      label: "Distância", 
      sortable: true,
      formatter: (value) => formatKilometers(value)
    },
    { id: "tempo_viagem_estimado_minutos", 
      label: "Tempo de Viagem", 
      sortable: true,
      formatter: (value) => formatTime(value)
    },
    { id: "actions",
      label: "Pontos",
      sortable: false,
      formatter: (value, route) => (
        <TableActionButton
          variant="outline-primary"
          size="sm"
          icon="bi bi-geo-alt"
          text="Ver"
          onClick={() => handleViewStops(route)}
          title="Ver pontos da rota"
        />
      )
    },
    { id: "status", 
      label: "Status", 
      sortable: true,
      formatter: (value) => formatStatus(value)
    },
  ];

  const handleCreateRoute = useCallback(() => {
    popUpRef.current.show({
      title: "Nova Rota",
      content: RouteForm,
      props: {
        onSubmit: async (formData) => {
          const result = await createRoute(formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Rota criada com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  }, [createRoute, showSuccess, showError]);
  
  // Handler para editar uma rota (navegar para página de edição com pontos)
  const handleEditRoute = useCallback((route) => {
    navigate(`/routes/${route.rota_id}/edit`);
  }, [navigate]);

  // Handler para excluir uma rota
  const handleDeleteRoute = useCallback(async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
      const result = await deleteRoute(id);
      if (result.success) {
        popUpRef.current.hide();
        showSuccess("Rota excluída com sucesso!");
      } else {
        showError(result.error);
      }
    }
  }, [deleteRoute, showSuccess, showError]);

  // Handler para quando uma linha for clicada
  const handleRowClick = useCallback((route) => {
    popUpRef.current.show({
      title: `Rota: ${route.nome}`,
      content: RouteDetails,
      props: {
        route: route,
        onEdit: handleEditRoute,
        onDelete: handleDeleteRoute,
      }
    });
  }, [handleEditRoute, handleDeleteRoute]);

  return (
    <main className="ps-3 pe-3 pt-3">
      <RouteStatsCards routes={routes} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="text-primary rounded-circle p-2 me-3">
                <i className="bi bi-signpost-split-fill fs-3"></i>
              </div>
              <h1 className="h3 mb-0 fw-semibold">Rotas</h1>
            </div>
            <ActionButton
              onClick={()=>{navigate("/routes/new")}}
              icon="bi bi-plus-circle"
              text="Nova Rota"
              variant="primary"
              size="lg"
              disabled={isLoading}
            />

            {/* <ActionButton
              onClick={handleCreateRoute}
              icon="bi bi-plus-circle"
              text="Nova Rota"
              variant="primary"
              size="lg"
              disabled={isLoading}
            /> */}
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
              message="Carregando rotas..." 
              variant="primary"
            />
          ) : (
            <div className="table-responsive">
              <Table 
                headers={TABLE_HEADERS}
                data={routes}
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
            <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos da rota.
            Para adicionar uma nova rota, clique no botão "Nova Rota".
          </p>
        </div>
      </div>

      <PopUpComponent 
        ref={popUpRef}
      />

      {/* Componente de Notificação */}
      <Notification 
        notification={notification} 
        onClose={hideNotification} 
      />
      </div>
    </main>
  );
}

export default RoutesPage;