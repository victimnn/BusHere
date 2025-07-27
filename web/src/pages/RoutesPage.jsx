import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import RouteDetails from "../components/routes/RouteDetails";
import RouteForm from "../components/routes/RouteForm";
import RouteStatsCards from "../components/routes/RouteStatsCards";
import Table from "../components/Table";
import api from "../api/api";

// header da tabela
const tableHeaders = [
  { id: "rota_id", label: "ID", sortable: true },
  { id: "codigo_rota", label: "Código", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "origem_descricao", label: "Origem", sortable: true },
  { id: "destino_descricao", label: "Destino", sortable: true },
  { id: "distancia_km", label: "Distância (km)", sortable: true },
  { id: "tempo_viagem_estimado_minutos", label: "Tempo de Viagem (min)", sortable: true },
  { id: "status", label: "Status", sortable: true },
];

function RoutesPage({ pageFunctions }) {
  useEffect(() => {
    pageFunctions.set("Rotas", true, true);
  }, []);
  
  const popUpRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await api.routes.list();
      setRoutes(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar rotas:", err);
      setError("Não foi possível carregar as rotas. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleCreateRoute = () => {
    popUpRef.current.show({
      title: "Nova Rota",
      content: RouteForm,
      props: {
        onSubmit: async (formData) => {
          try {
            await api.routes.create(formData);
            popUpRef.current.hide();
            fetchRoutes();
          } catch (err) {
            console.error("Erro ao criar rota:", err);
            alert("Erro ao criar rota: " + (err.message || "Tente novamente mais tarde"));
          }
        },
        onCancel: popUpRef.current.hide,
        isCreateForm: true
      }
    });
  };

  const handleEditRoute = (route) => {
    popUpRef.current.show({
      title: `Editar Rota: ${route.nome}`,
      content: RouteForm,
      props: {
        initialData: route,
        onSubmit: async (formData) => {
          try {
            await api.routes.update(route.rota_id, formData);
            popUpRef.current.hide();
            fetchRoutes();
          } catch (err) {
            console.error("Erro ao atualizar rota:", err);
            alert("Erro ao atualizar rota: " + (err.message || "Tente novamente mais tarde"));
          }
        },
        onCancel: popUpRef.current.hide,
      }
    });
  };

  const handleDeleteRoute = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        await api.routes.delete(id);
        fetchRoutes();
        popUpRef.current.hide();
      } catch (err) {
        console.error("Erro ao excluir rota:", err);
        alert("Erro ao excluir rota: " + (err.message || "Tente novamente mais tarde"));
      }
    }
  };

  const handleRowClick = (route) => {
    popUpRef.current.show({
      title: `Rota: ${route.nome}`,
      content: RouteDetails,
      props: {
        route: route,
        onEdit: handleEditRoute,
        onDelete: handleDeleteRoute,
      }
    });
  };

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
            
            <button
              onClick={handleCreateRoute}
              className="btn btn-primary btn-lg d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              <span>Nova Rota</span>
            </button>
          </div>
        </div>
        
        <div className="card-body p-3">
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}
          
          {isLoading ? (
            <div className="d-flex flex-column justify-content-center align-items-center my-5 py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="text-muted">Carregando rotas...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table 
                headers={tableHeaders}
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
      </div>
    </main>
  );
}

export default RoutesPage;