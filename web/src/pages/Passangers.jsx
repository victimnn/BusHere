import { useRef } from "react";
import PopUpComponent from "../components/PopUpComponent";

import React from 'react';

const obterDadosDeUsuariosTeste = () => {
  return [
    { user_id: 1, full_name: "João Silva", cpf: "12345678901", },
    { user_id: 2, full_name: "Maria Oliveira", cpf: "23456789012", },
    { user_id: 3, full_name: "Pedro Santos", cpf: "34567890123", },
    { user_id: 4, full_name: "Ana Costa", cpf: "45678901234", },
    { user_id: 5, full_name: "Lucas Pereira", cpf: "56789012345", },
    { user_id: 6, full_name: "Juliana Almeida", cpf: "67890123456", },
    { user_id: 7, full_name: "Ricardo Lima", cpf: "78901234567", },
    { user_id: 8, full_name: "Fernanda Rocha", cpf: "89012345678", },
    { user_id: 9, full_name: "Gabriel Martins", cpf: "90123456789", },
    { user_id: 10, full_name: "Larissa Ferreira", cpf: "01234567890", }
  ]
}


function Tabela({ header, body }){
  return (
    <table className="table table-hover table-striped">
      <thead>
        <tr>
          {header.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {body.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((item, colIndex) => (
              <td key={colIndex}>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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
          
        {/* texto com a cor secundaria */}
        <p className="text-secondary">Texto com a cor secundaria</p> 

        <Tabela style={{ marginTop: "auto" }}
          header={ ["ID", "Nome", "CPF"] }
          body={obterDadosDeUsuariosTeste().map((usuario) => [
            usuario.user_id,
            usuario.full_name,
            usuario.cpf
          ])}
        />
  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Passangers