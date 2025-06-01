import { useRef, useState, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import PassengerForm from "../components/PassengerForm";
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

function PassengerDetails({ passenger, onEdit, onDelete }) {
  return (
    <div className="p-3">
      <h2>Detalhes do Passageiro</h2>
      {passenger && (
        <div>
          <div className="mb-4">
            <p><strong>ID:</strong> {passenger.id}</p>
            <p><strong>Nome:</strong> {passenger.nome}</p>
            <p><strong>CPF:</strong> {passenger.cpf}</p>
            <p><strong>Telefone:</strong> {passenger.telefone || "Não informado"}</p>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button 
              className="btn btn-danger" 
              onClick={() => onDelete(passenger.id)}
            >
              <i className="bi bi-trash me-1"></i> Excluir
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => onEdit(passenger)}
            >
              <i className="bi bi-pencil me-1"></i> Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
        
        // Assumindo que a API retorna { data: [...passengers], total: number }
        setPassengers(Array.isArray(response) ? response : response.data || []);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar passageiros:", err);
        setError("Não foi possível carregar os passageiros. Tente novamente mais tarde.");
        
        // Usando dados mockados em caso de erro ou durante desenvolvimento
        setPassengers([
          { id: 1, nome: "Victor Ramos", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
          { id: 2, nome: "Renan Andrade", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
          { id: 3, nome: "Luiz Souza", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
          { id: 4, nome: "Sarah Porsch", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
          { id: 5, nome: "Marcelo Henrique", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
          { id: 6, nome: "Rubens Carlos", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Efeito para carregar os passageiros quando o componente for montado
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
                await api.passengers.create(formData);
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
                await api.passengers.update(passenger.id, formData);
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
    };

    return (
      <main className="container p-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Passageiros</h1>
          
          <button
            onClick={handleCreatePassenger}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-circle me-1"></i> Novo Passageiro
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <Table 
            headers={tableHeaders}
            data={passengers}
            itemsPerPage={10}
            searchable={true}
            className="table-striped table-hover shadow-sm"
            onRowClick={handleRowClick}
          />
        )}
  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    );
  }

export default Passangers