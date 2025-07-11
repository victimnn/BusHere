import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import PassengerForm from "../components/passengers/PassengerForm";
import PassengerDetails from "../components/passengers/PassengerDetails";
import PassengerStatsCards from "../components/passengers/PassengerStatsCards";
import Table from "../components/Table";
import api from "../api/api";

import { formatCPF, formatPhoneNumber, removeFormatting } from "../utils/formatters";

// header da tabela
const tableHeaders = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", label: "CPF", sortable: true },
  { id: "email", label: "E-mail", sortable: true },
  { id: "telefone", label: "Telefone", sortable: false },
  { id: "tipo_passageiro", label: "Tipo", sortable: true }
];

function Passengers({ pageFunctions }) {
  useEffect(() => {
    pageFunctions.set("Passageiros", true, true);
  }, []);
  
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const [passengers, setPassengers] = useState([]); // Estado para armazenar os passageiros
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para armazenar erros
  const [currentPage, setCurrentPage] = useState(1); // Controle de paginação
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [tiposPassageiro, setTiposPassageiro] = useState([]); // Estado para armazenar os tipos de passageiro
    
  // Função para buscar os tipos de passageiro
  const fetchTiposPassageiro = async () => {
    try {
      const response = await api.passengers.getTypes();
      if (response && response.data) {
        setTiposPassageiro(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de passageiro:', error);
      // Fallback com tipos padrão
      setTiposPassageiro([
        { tipo_passageiro_id: 1, nome: 'Estudante' },
        { tipo_passageiro_id: 2, nome: 'Corporativo' }
      ]);
    }
  };
  
  // Função para obter o nome do tipo de passageiro pelo ID
  const getTipoPassageiroNome = (tipo_passageiro_id) => {
    const tipo = tiposPassageiro.find(t => t.tipo_passageiro_id === tipo_passageiro_id);
    return tipo ? tipo.nome : 'Não informado';    
  };
  
  // Função para buscar os passageiros do servidor
  const fetchPassengers = async () => {
    try {
      setIsLoading(true);
      const response = await api.passengers.list(currentPage, 100, searchTerm);
      
      // Adaptar os dados do servidor para o formato esperado pelo frontend
      let passengersData = [];
      if (response && response.data && Array.isArray(response.data)) {
        passengersData = response.data.map(passenger => ({
          id: passenger.passageiro_id,
          nome: passenger.nome_completo,
          cpf: formatCPF(passenger.cpf),
          email: passenger.email,
          telefone: formatPhoneNumber(passenger.telefone),
          tipo_passageiro_id: passenger.tipo_passageiro_id,
          tipo_passageiro: getTipoPassageiroNome(passenger.tipo_passageiro_id)
        }));
      }
      
      setPassengers(passengersData);
      setError(null);
      
      console.log('Dados recebidos da API:', response);
      console.log('Dados transformados:', passengersData);
    } catch (err) {
      console.error("Erro ao buscar passageiros:", err);
      setError("Não foi possível carregar os passageiros. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposPassageiro();
  }, []);

  useEffect(() => {
    if (tiposPassageiro.length > 0) {
      fetchPassengers();
    }    
  }, [currentPage, searchTerm, tiposPassageiro]); // Recarrega quando mudar a página, termo de busca ou tipos
    
  // Handler para criar um novo passageiro
  const handleCreatePassenger = () => {
    popUpRef.current.show(
      ({ close }) => (
        <PassengerForm 
          onSubmit={async (formData) => {
            try {
              // Adaptar os dados do frontend para o formato esperado pelo backend
              const backendData = {
                nome_completo: formData.nome,
                cpf: removeFormatting(formData.cpf), // Remove pontos e traço
                telefone: removeFormatting(formData.telefone), // Remove parênteses, espaço e traço
                email: formData.email || '',
                tipo_passageiro_id: formData.tipo_passageiro, // Adiciona o tipo de passageiro
                // Hash temporário apenas para testes
                senha_hash: 'temp_hash_' + Date.now(), 
                // Valores mínimos obrigatórios para o banco de dados
                logradouro: 'Endereço não informado',
                numero_endereco: '1', // Número genérico ao invés de 0
                bairro: 'Não informado',
                cidade: 'Não informada',
                uf: 'XX',
                cep: '00000000' // Sem traço
              };
              
              console.log('Enviando dados:', backendData);
              await api.passengers.create(backendData);
              close();
              fetchPassengers(); // Recarrega a lista
            } catch (err) {
              console.error("Erro ao criar passageiro:", err);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao criar passageiro: ";
              if (err.message && err.message.includes('já cadastrado')) {
                errorMessage += err.message;
              } else if (err.message && err.message.includes('409')) {
                errorMessage += "CPF ou email já cadastrado no sistema.";
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
      "Novo Passageiro"
    );
  };
    
  // Handler para editar um passageiro
  const handleEditPassenger = (passenger) => {
    // Prepara os dados iniciais com os campos corretos
    const initialData = {
      nome: passenger.nome,
      cpf: passenger.cpf,
      email: passenger.email,
      telefone: passenger.telefone,
      tipo_passageiro: passenger.tipo_passageiro_id
    };
    
    popUpRef.current.show(
      ({ close }) => (
        <PassengerForm 
          initialData={initialData}
          onSubmit={async (formData) => {
            try {
              // Adaptar os dados do frontend para o formato esperado pelo backend
              const backendData = {
                nome_completo: formData.nome,
                cpf: removeFormatting(formData.cpf), // Remove pontos e traço
                email: formData.email,
                telefone: removeFormatting(formData.telefone), // Remove parênteses, espaço e traço
                tipo_passageiro_id: formData.tipo_passageiro // Adiciona o tipo de passageiro
              };
              
              console.log('Enviando dados para atualização:', backendData);
              await api.passengers.update(passenger.id, backendData);
              close();
              fetchPassengers(); // Recarrega a lista
            } catch (err) {
              console.error("Erro ao atualizar passageiro:", err);
              
              // Provide more specific error messages
              let errorMessage = "Erro ao atualizar passageiro: ";
              if (err.message && err.message.includes('já está sendo usado')) {
                errorMessage += err.message;
              } else if (err.message && err.message.includes('409')) {
                errorMessage += "CPF ou email já está sendo usado por outro passageiro.";
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
      `Editar Passageiro: ${passenger.nome}`
    );
  };
    
  // Handler para excluir um passageiro
  const handleDeletePassenger = async (id) => {
    if (confirm("Tem certeza que deseja excluir este passageiro?")) {
      try {
        await api.passengers.delete(id);
        fetchPassengers(); // Recarrega a lista
        popUpRef.current.hide(); // Fecha o popup se estiver aberto
      } catch (err) {
        console.error("Erro ao excluir passageiro:", err);
        alert("Erro ao excluir passageiro: " + (err.message || "Tente novamente mais tarde"));
      }
    }
  };
  // Handler para quando uma linha for clicada
  const handleRowClick = (passenger) => {
    popUpRef.current.show(
      () => (
        <PassengerDetails 
          passenger={passenger} 
          onEdit={handleEditPassenger} 
          onDelete={handleDeletePassenger} 
        />
      ), 
      {}, 
      `Passageiro: ${passenger.nome}`
    );
  };

  return (
    <main className="ps-5 pe-5 pt-3">
      {/* Cards de Estatísticas */}
      <PassengerStatsCards passengers={passengers} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Passageiros</h1>
              </div>
              
              <button
                onClick={handleCreatePassenger}
                className="btn btn-primary btn-lg d-flex align-items-center"
              >
                <i className="bi bi-plus-circle me-2"></i>
                <span>Novo Passageiro</span>
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
                <p className="text-muted">Carregando passageiros...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={tableHeaders}
                  data={passengers}
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
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do passageiro.
              Para adicionar um novo passageiro, clique no botão "Novo Passageiro".
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

export default Passengers;