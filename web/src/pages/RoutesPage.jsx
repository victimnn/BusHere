import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import RouteDetails from "../components/routes/RouteDetails";
import RouteForm from "../components/routes/RouteForm";
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
  
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const [routes, setRoutes] = useState([]); // Estado para armazenar as rotas
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [currentPage, setCurrentPage] = useState(1); // Controle de paginação
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca

  // Função para buscar as rotas do servidor
  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await api.routes.list(currentPage, 100, searchTerm);
      
      // Adaptar os dados do servidor para o formato esperado pelo frontend
      let routesData = [];
      if (response && response.data && Array.isArray(response.data)) {
        routesData = response.data.map(route => ({ 
          ...route, 
          status: route.status_nome 
        }));
      }
      
      setRoutes(routesData);
      setError(null);
      
      console.log('Dados recebidos da API:', response);
      console.log('Dados transformados:', routesData);
    } catch (err) {
      console.error("Erro ao buscar rotas:", err);
      setError("Não foi possível carregar as rotas. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [currentPage, searchTerm]); // Recarrega quando mudar a página ou termo de busca

  // Handler para criar uma nova rota
  const handleCreateRoute = () => {
    popUpRef.current.show({
      title: "Nova Rota",
      content: RouteForm,
      props: {
        onSubmit: async (formData) => {
          try {
            console.log('Enviando dados:', formData);
            await api.routes.create(formData);
            popUpRef.current.hide();
            fetchRoutes(); // Recarrega a lista
          } catch (err) {
            console.error("Erro ao criar rota:", err);
            
            // Provide more specific error messages
            let errorMessage = "Erro ao criar rota: ";
            if (err.message && err.message.includes('já cadastrado')) {
              errorMessage += err.message;
            } else if (err.message && err.message.includes('409')) {
              errorMessage += "Código de rota já cadastrado no sistema.";
            } else {
              errorMessage += err.message || "Tente novamente mais tarde";
            }
            
            alert(errorMessage);
          }
        },
        onCancel: popUpRef.current.hide,
      }
    });
  };
  
  // Handler para editar uma rota
  const handleEditRoute = (route) => {
    popUpRef.current.show({
      title: `Editar Rota: ${route.nome}`,
      content: RouteForm,
      props: {
        initialData: route,
        onSubmit: async (formData) => {
          try {
            console.log('Enviando dados para atualização:', formData);
            await api.routes.update(route.rota_id, formData);
            popUpRef.current.hide();
            fetchRoutes(); // Recarrega a lista
          } catch (err) {
            console.error("Erro ao atualizar rota:", err);
            
            // Provide more specific error messages
            let errorMessage = "Erro ao atualizar rota: ";
            if (err.message && err.message.includes('já está sendo usado')) {
              errorMessage += err.message;
            } else if (err.message && err.message.includes('409')) {
              errorMessage += "Código de rota já está sendo usado por outra rota.";
            } else {
              errorMessage += err.message || "Tente novamente mais tarde";
            }
            
            alert(errorMessage);
          }
        },
        onCancel: popUpRef.current.hide,
      }
    });
  };

  // Handler para excluir uma rota
  const handleDeleteRoute = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        await api.routes.delete(id);
        fetchRoutes(); // Recarrega a lista
        popUpRef.current.hide(); // Fecha o popup se estiver aberto
      } catch (err) {
        console.error("Erro ao excluir rota:", err);
        alert("Erro ao excluir rota: " + (err.message || "Tente novamente mais tarde"));
      }
    }
  };

  // Handler para quando uma linha for clicada
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
    <main className="container p-3">
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
    </main>
  );
}

export default RoutesPage;
