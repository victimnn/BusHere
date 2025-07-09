import React, { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import DriverForm from "../components/drivers/DriverForm";
import DriverDetails from "../components/drivers/DriverDetails";
import Table from "../components/Table";
import api from "../api/api";

import { formatCPF, formatPhoneNumber, removeFormatting, formatDateFromDatabase } from "../utils/formatters";

// header da tabela
const tableHeaders = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", label: "CPF", sortable: true },
  { id: "cnh_numero", label: "CNH", sortable: true },
  { id: "cnh_categoria", label: "Categoria", sortable: true },
  { id: "telefone", label: "Telefone", sortable: false },
  { id: "status_nome", label: "Status", sortable: true }
];

function Drivers({ pageFunctions }) {
    useEffect(() => {
    pageFunctions.set("Motoristas", true, true);
  }, []);
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
    const [drivers, setDrivers] = useState([]); // Estado para armazenar os motoristas
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para armazenar erros
    const [currentPage, setCurrentPage] = useState(1); // Controle de paginação
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
    const [statusMotorista, setStatusMotorista] = useState([]); // Estado para armazenar os status de motorista
    
    // Função para buscar os status de motorista
    const fetchStatusMotorista = async () => {
      try {
        const response = await api.drivers.getStatus();
        if (response && response.data) {
          setStatusMotorista(response.data);
        }      } catch (error) {
        console.error('Erro ao carregar status de motorista:', error);
        // Fallback com status padrão
        setStatusMotorista([
          { status_motorista_id: 1, nome: 'Ativo' },
          { status_motorista_id: 2, nome: 'Férias' },
          { status_motorista_id: 3, nome: 'Afastado' },
          { status_motorista_id: 4, nome: 'Inativo' }
        ]);
      }
    };
    
    // Função para obter o nome do status pelo ID
    const getStatusNome = (status_motorista_id) => {
      const status = statusMotorista.find(s => s.status_motorista_id === status_motorista_id);
      return status ? status.nome : 'Não informado';    
    };
    
    // Função para buscar os motoristas do servidor
    const fetchDrivers = async () => {
      try {
        setIsLoading(true);
        const response = await api.drivers.list(currentPage, 100, searchTerm);
        
        // Adaptar os dados do servidor para o formato esperado pelo frontend
        let driversData = [];
        if (response && response.data && Array.isArray(response.data)) {
          driversData = response.data.map(driver => ({
            id: driver.motorista_id,
            nome: driver.nome,
            cpf: formatCPF(driver.cpf),
            cnh_numero: driver.cnh_numero,
            cnh_categoria: driver.cnh_categoria,
            cnh_validade: driver.cnh_validade,
            telefone: formatPhoneNumber(driver.telefone),
            email: driver.email,
            data_admissao: driver.data_admissao,
            status_motorista_id: driver.status_motorista_id,
            status_nome: driver.status_nome || getStatusNome(driver.status_motorista_id)
          }));
        }
        
        setDrivers(driversData);
        setError(null);
        
        console.log('Dados recebidos da API:', response);
        console.log('Dados transformados:', driversData);
      } catch (err) {
        console.error("Erro ao buscar motoristas:", err);
        setError("Não foi possível carregar os motoristas. Tente novamente mais tarde.");
        
      } finally {
        setIsLoading(false);
      }
    };
      // useEffect para carregar os status de motorista quando o componente for montado
    useEffect(() => {
      fetchStatusMotorista();
    }, []);
      // para carregar os motoristas quando os status estiverem carregados
    useEffect(() => {
      if (statusMotorista.length > 0) {
        fetchDrivers();
      }    
    }, [currentPage, searchTerm, statusMotorista]); // Recarrega quando mudar a página, termo de busca ou status
    
    // Handler para criar um novo motorista
    const handleCreateDriver = () => {
      popUpRef.current.show(
        ({ close }) => (
          <DriverForm 
            onSubmit={async (formData) => {
              try {
                // Adaptar os dados do frontend para o formato esperado pelo backend
                const backendData = {
                  nome: formData.nome,
                  cpf: removeFormatting(formData.cpf), // Remove pontos e traço
                  cnh_numero: formData.cnh_numero,
                  cnh_categoria: formData.cnh_categoria,
                  cnh_validade: formData.cnh_validade,
                  telefone: removeFormatting(formData.telefone), // Remove parênteses, espaço e traço
                  email: formData.email || null,
                  data_admissao: formData.data_admissao || null,
                  status_motorista_id: formData.status_motorista_id
                };
                  console.log('Enviando dados:', backendData);
                await api.drivers.create(backendData);
                close();
                fetchDrivers(); // Recarrega a lista
              } catch (err) {
                console.error("Erro ao criar motorista:", err);
                
                // Provide more specific error messages
                let errorMessage = "Erro ao criar motorista: ";
                if (err.message && err.message.includes('já cadastrado')) {
                  errorMessage += err.message;
                } else if (err.message && err.message.includes('409')) {
                  errorMessage += "CPF, CNH ou email já cadastrado no sistema.";
                } else {
                  errorMessage += err.message || "Tente novamente mais tarde";
                }
                
                alert(errorMessage);
              }
            }}onCancel={close}
          />), 
        {},
        "Novo Motorista"
      );
    };
    
    // Handler para editar um motorista
    const handleEditDriver = (driver) => {
      // Prepara os dados iniciais com os campos corretos
      const initialData = {
        nome: driver.nome,
        cpf: driver.cpf,
        cnh_numero: driver.cnh_numero,
        cnh_categoria: driver.cnh_categoria,
        cnh_validade: formatDateFromDatabase(driver.cnh_validade),
        telefone: driver.telefone,
        email: driver.email,
        data_admissao: formatDateFromDatabase(driver.data_admissao),
        status_motorista_id: driver.status_motorista_id
      };
      
      popUpRef.current.show(
        ({ close }) => (
          <DriverForm 
            initialData={initialData}
            onSubmit={async (formData) => {
              try {
                // Adaptar os dados do frontend para o formato esperado pelo backend
                const backendData = {
                  nome: formData.nome,
                  cpf: removeFormatting(formData.cpf), // Remove pontos e traço
                  cnh_numero: formData.cnh_numero,
                  cnh_categoria: formData.cnh_categoria,
                  cnh_validade: formData.cnh_validade,
                  telefone: removeFormatting(formData.telefone), // Remove parênteses, espaço e traço
                  email: formData.email,
                  data_admissao: formData.data_admissao,
                  status_motorista_id: formData.status_motorista_id
                };
                  console.log('Enviando dados para atualização:', backendData);
                await api.drivers.update(driver.id, backendData);
                close();
                fetchDrivers(); // Recarrega a lista
              } catch (err) {
                console.error("Erro ao atualizar motorista:", err);
                
                // Provide more specific error messages
                let errorMessage = "Erro ao atualizar motorista: ";
                if (err.message && err.message.includes('já está sendo usado')) {
                  errorMessage += err.message;
                } else if (err.message && err.message.includes('409')) {
                  errorMessage += "CPF, CNH ou email já está sendo usado por outro motorista.";
                } else {
                  errorMessage += err.message || "Tente novamente mais tarde";
                }
                
                alert(errorMessage);
              }
            }}
            onCancel={close}
          /> ), 
        {}, 
        "Editar Motorista"
      );
    };
    
    // Handler para excluir um motorista
    const handleDeleteDriver = async (id) => {
      if (confirm("Tem certeza que deseja excluir este motorista?")) {
        try {
          await api.drivers.delete(id);
          fetchDrivers(); // Recarrega a lista
          popUpRef.current.hide(); // Fecha o popup se estiver aberto
        } catch (err) {
          console.error("Erro ao excluir motorista:", err);
          alert("Erro ao excluir motorista: " + (err.message || "Tente novamente mais tarde"));
        }
      }
    };
  
    // Handler para quando uma linha for clicada
    const handleRowClick = (driver) => {
      popUpRef.current.show(
        () => (
          <DriverDetails 
            driver={driver} 
            onEdit={handleEditDriver} 
            onDelete={handleDeleteDriver} 
          />
        ), 
        {}, 
        `Motorista: ${driver.nome}`
      );
    };

    return (
      <main className="container p-3">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-person-fill-gear fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Motoristas</h1>
              </div>
              
              <button
                onClick={handleCreateDriver}
                className="btn btn-primary btn-lg d-flex align-items-center"
              >
                <i className="bi bi-plus-circle me-2"></i>
                <span>Novo Motorista</span>
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
                <p className="text-muted">Carregando motoristas...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table 
                  headers={tableHeaders}
                  data={drivers}
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
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do motorista.
              Para adicionar um novo motorista, clique no botão "Novo Motorista".
            </p>
          </div>
        </div>
  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    );
  }

export default Drivers;