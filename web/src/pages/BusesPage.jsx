import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import BusDetails from "../components/buses/BusDetails";
import BusForm from "../components/buses/BusForm";
import BusStatsCards from "../components/buses/BusStatsCards";
import Table from "../components/Table";
import api from "../api/api";

// header da tabela
const tableHeaders = [
  { id: "onibus_id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "placa", label: "Placa", sortable: true },
  { id: "modelo", label: "Modelo", sortable: true },
  { id: "marca", label: "Marca", sortable: true },
  { id: "ano_fabricacao", label: "Ano", sortable: true },
  { id: "capacidade", label: "Capacidade", sortable: true },
  { id: "data_ultima_manutencao", label: "Última Manutenção", sortable: true },
  { id: "data_proxima_manutencao", label: "Próxima Manutenção", sortable: true },
  { id: "quilometragem", label: "Quilometragem", sortable: true },
  { id: "status", label: "Status", sortable: true },
];

function Buses({ pageFunctions }) {
  useEffect(() => {
    pageFunctions.set("Ônibus", true, true);
  }, []);
  
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const [buses, setBuses] = useState([]); // Estado para armazenar os ônibus
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [currentPage, setCurrentPage] = useState(1); // Controle de paginação
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  
  // Função para buscar os ônibus do servidor
  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const response = await api.buses.list(currentPage, 100, searchTerm);
      
      // Adaptar os dados do servidor para o formato esperado pelo frontend
      let busesData = [];
      if (response && response.data && Array.isArray(response.data)) {
        busesData = response.data.map(bus => {
          // Função para formatar a data para DD/MM/AAAA
          const formatDate = (dateString) => {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
          };

          return {
            ...bus,
            status: bus.status_nome,
            data_ultima_manutencao: formatDate(bus.data_ultima_manutencao),
            data_proxima_manutencao: formatDate(bus.data_proxima_manutencao)
          };
        });
      }
      
      setBuses(busesData);
      setError(null);
      
      console.log('Dados recebidos da API:', response);
      console.log('Dados transformados:', busesData);
    } catch (err) {
      console.error("Erro ao buscar ônibus:", err);
      setError("Não foi possível carregar os ônibus. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [currentPage, searchTerm]); // Recarrega quando mudar a página ou termo de busca

  // Handler para criar um novo ônibus
  const handleCreateBus = () => {
    popUpRef.current.show(
      ({ close }) => (
        <BusForm
          onSubmit={async (formData) => {
            try {
              console.log('Enviando dados:', formData);
              await api.buses.create(formData);
              close();
              fetchBuses(); // Recarrega a lista
            } catch (err) {
              console.error("Erro ao criar ônibus:", err);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao criar ônibus: ";
              if (err.message && err.message.includes('já cadastrado')) {
                errorMessage += err.message;
              } else if (err.message && err.message.includes('409')) {
                errorMessage += "Placa já cadastrada no sistema.";
              } else {
                errorMessage += err.message || "Tente novamente mais tarde";
              }
              
              alert(errorMessage);
            }
          }}
          onCancel={close}
        />
      ),
      {},
      "Novo Ônibus"
    );
  };
  
  // Handler para editar um ônibus
  const handleEditBus = (bus) => {
    popUpRef.current.show(
      ({ close }) => (
        <BusForm
          initialData={bus}
          onSubmit={async (formData) => {
            try {
              console.log('Enviando dados para atualização:', formData);
              await api.buses.update(bus.onibus_id, formData);
              close();
              fetchBuses(); // Recarrega a lista
            } catch (err) {
              console.error("Erro ao atualizar ônibus:", err);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao atualizar ônibus: ";
              if (err.message && err.message.includes('já está sendo usado')) {
                errorMessage += err.message;
              } else if (err.message && err.message.includes('409')) {
                errorMessage += "Placa já está sendo usada por outro ônibus.";
              } else {
                errorMessage += err.message || "Tente novamente mais tarde";
              }
              
              alert(errorMessage);
            }
          }}
          onCancel={close}
        />
      ),
      {},
      `Editar Ônibus: ${bus.nome}`
    );
  };

  // Handler para excluir um ônibus
  const handleDeleteBus = async (id) => {
    if (confirm("Tem certeza que deseja excluir este ônibus?")) {
      try {
        await api.buses.delete(id);
        fetchBuses(); // Recarrega a lista
        popUpRef.current.hide(); // Fecha o popup se estiver aberto
      } catch (err) {
        console.error("Erro ao excluir ônibus:", err);
        alert("Erro ao excluir ônibus: " + (err.message || "Tente novamente mais tarde"));
      }
    }
  };

  // Handler para quando uma linha for clicada
  const handleRowClick = (bus) => {
    popUpRef.current.show(
      () => (
        <BusDetails 
          bus={bus} 
          onEdit={handleEditBus} 
          onDelete={handleDeleteBus} 
        />
      ), 
      {}, 
      `Ônibus: ${bus.nome}`
    );
  };

  return (
    <main className="ps-5 pe-5 pt-3">
      {/* Cards de Estatísticas */}
      <BusStatsCards buses={buses} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="text-primary rounded-circle p-2 me-3">
                <i className="bi bi-bus-front-fill fs-3"></i>
              </div>
              <h1 className="h3 mb-0 fw-semibold">Ônibus</h1>
            </div>
            
            <button
              onClick={handleCreateBus}
              className="btn btn-primary btn-lg d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              <span>Novo Ônibus</span>
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
              <p className="text-muted">Carregando ônibus...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table 
                headers={tableHeaders}
                data={buses}
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
            <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do ônibus.
            Para adicionar um novo ônibus, clique no botão "Novo Ônibus".
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

export default Buses;
