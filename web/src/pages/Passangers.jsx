import { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import PassengerForm from "../components/passengers/PassengerForm";
import PassengerDetails from "../components/passengers/PassengerDetails";
import Table from "../components/Table";
import api from "../api/api";

import React from 'react';

// header da tabela
const tableHeaders = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", label: "CPF", sortable: true },
  { id: "telefone", label: "Telefone", sortable: false }
];

function Passangers(){
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
    const [passengers, setPassengers] = useState([]); // Estado para armazenar os passageiros
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para armazenar erros
    const [currentPage, setCurrentPage] = useState(1); // Controle de paginação
    const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
      // Função para buscar os passageiros do servidor
    const fetchPassengers = async () => {
      try {
        setIsLoading(true);
        const response = await api.passengers.list(currentPage, 10, searchTerm);
        
        // Adaptar os dados do servidor para o formato esperado pelo frontend
        let passengersData = [];
        if (response && response.data && Array.isArray(response.data)) {
          passengersData = response.data.map(passenger => ({
            id: passenger.passageiro_id,
            nome: passenger.nome_completo,
            cpf: passenger.cpf,
            telefone: passenger.telefone,
            email: passenger.email
          }));
        }
        
        setPassengers(passengersData);
        setError(null);
        
        console.log('Dados recebidos da API:', response);
        console.log('Dados transformados:', passengersData);
      } catch (err) {
        console.error("Erro ao buscar passageiros:", err);
        setError("Não foi possível carregar os passageiros. Tente novamente mais tarde.");
        
        // Usando dados mockados em caso de erro no bd
        // setPassengers([
        //   { id: 1, nome: "Victor Ramos", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
        //   { id: 2, nome: "Renan Andrade", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
        //   { id: 3, nome: "Luiz Souza", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
        //   { id: 4, nome: "Sarah Porsch", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
        //   { id: 5, nome: "Marcelo Henrique", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
        //   { id: 6, nome: "Rubens Carlos", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
        // ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // para carregar os passageiros quando o componente for montado
    useEffect(() => {
      fetchPassengers();
    }, [currentPage, searchTerm]); // Recarrega quando mudar a página ou o termo de busca
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
                  cpf: formData.cpf,
                  telefone: formData.telefone,
                  email: formData.email || '',
                  // Hash temporário apenas para testes
                  senha_hash: 'temp_hash_' + Date.now(), 
                  // Valores mínimos obrigatórios para o banco de dados
                  logradouro: 'Endereço não informado',
                  numero_endereco: '0',
                  bairro: 'Não informado',
                  cidade: 'Não informada',
                  uf: 'XX',
                  cep: '00000-000'
                };
                
                console.log('Enviando dados para criação:', backendData);
                await api.passengers.create(backendData);
                close();
                fetchPassengers(); // Recarrega a lista
              } catch (err) {
                console.error("Erro ao criar passageiro:", err);
                alert("Erro ao criar passageiro: " + (err.message || "Tente novamente mais tarde"));
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
      popUpRef.current.show(
        ({ close }) => (
          <PassengerForm 
            initialData={passenger}
            onSubmit={async (formData) => {
              try {
                // Adaptar os dados do frontend para o formato esperado pelo backend
                const backendData = {
                  nome_completo: formData.nome,
                  cpf: formData.cpf,
                  telefone: formData.telefone,
                  email: formData.email || ''
                };
                
                console.log('Enviando dados para atualização:', backendData);
                await api.passengers.update(passenger.id, backendData);
                close();
                fetchPassengers(); // Recarrega a lista
              } catch (err) {
                console.error("Erro ao atualizar passageiro:", err);
                alert("Erro ao atualizar passageiro: " + (err.message || "Tente novamente mais tarde"));
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
          popUpRef.current.close(); // Fecha o popup se estiver aberto
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
    };    return (
      <main className="container p-3">
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
            )}          </div>
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
      </main>
    );
  }

export default Passangers