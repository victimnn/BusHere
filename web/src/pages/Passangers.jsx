import { useRef } from "react";
import PopUpComponent from "../components/PopUpComponent";
import Table from "../components/Table";

import React from 'react';

// dados de exemplo
const passengersData = [
  { id: 1, nome: "Victor Ramos", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
  { id: 2, nome: "Renan Andrade", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
  { id: 3, nome: "Luiz Souza", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
  { id: 4, nome: "Sarah Porsch", cpf: "123.456.789-00", telefone: "(11) 99999-8888" },
  { id: 5, nome: "Marcelo Henrique", cpf: "987.654.321-00", telefone: "(11) 99999-7777" },
  { id: 6, nome: "Rubens Carlos", cpf: "456.789.123-00", telefone: "(11) 99999-6666" },
];

// header da tabela
const tableHeaders = [
  { id: "id", label: "ID", sortable: true },
  { id: "nome", label: "Nome", sortable: true },
  { id: "cpf", label: "CPF", sortable: true },
  { id: "telefone", label: "Telefone", sortable: false }
];


function PopUpContent() {
  return (
    <div className="p-3 bg-blue">
      <h2>Conteúdo do PopUp</h2>
      <p>Essa é a page dos passageiros.</p>
    </div>
  );
}

function Passangers(){
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  
    // Handler para quando uma linha for clicada
    const handleRowClick = (passenger) => {
      console.log("Passageiro selecionado:", passenger);
      // da abrir um popup com detalhes do passageiro aqui
    };

    return (
      <main className="flex-column justify-content-center align-items-center">
        <h1>Passageiros</h1> 
  
        <button
          onClick={() => {
            popUpRef.current.show(PopUpContent, {}, "PopUp dos Passageiros"); // Chama a função show do PopUpComponent, sempre 3 parametos
          }}
          className="btn btn-primary"
        >
          Abrir PopUp
        </button>

        <Table 
        headers={tableHeaders} // header da tabela
        data={passengersData} // dados a serem exibidos na tabela
        itemsPerPage={5} // número de itens por página
        searchable={true} // permite pesquisa na tabela
        className="table-bordered" // classe opcional para estilização
        onRowClick={handleRowClick} // passa a função de clique da linha
        />
  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Passangers