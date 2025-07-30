import React, { useState, useEffect, useRef, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@web/api/api';
import PopUpComponent from '@web/components/PopUpComponent';
import PassengerDetails from "@web/components/passengers/PassengerDetails"
import PassengerForm from "@web/components/passengers/PassengerForm"


/**
 * 
 * @param {string | Component} title
 * @param {{name, value, link?}[]} items
 * @returns 
 */
function DetailsListGroup({title, items}) {
  function toRealString(str) {
    if(!str) return "Não informado";  
    if(typeof str === "object") return JSON.stringify(str, null, 2);
    return str;
  }

  function useLinkIfExists(item) {
    if(!item.link) return <span>{toRealString(item.value)}</span>;
    return <a href={item.link} target="_blank" rel="noopener noreferrer">{toRealString(item.value)}</a>;
  }
  return (
    <div className="container mt-4">
      <h2>{title}</h2>
      <ul className="list-group">
        {items.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>{item.name}:</strong> {useLinkIfExists(item)}
          </li>
        ))}
      </ul>
    </div>
  );

}

function PassengerDetailPage({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Passageiro", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { passengerId } = useParams();
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);

  const fetchPassengerDetails = async () => {
    try {
      const response = await api.passengers.getById(passengerId);
      if (response) {
        setPassenger(response);
      } else {
        console.error("Dados do passageiro não encontrados", response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do passageiro:", error);
      popUpRef.current.show({
        title: "Erro",
        content: () => <div>Não foi possível carregar os detalhes do passageiro. Tente novamente mais tarde.</div>,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPassengerDetails();
  }, [passengerId]);

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes do passageiro...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  const Details = () => {
    if (!passenger) {
      return <div>Nenhum dado encontrado</div>;
    }
    const correctedPassenger = {
      nome: passenger.nome_completo, 
      tipo_passageiro: 2,
      ...passenger
    }
    return (
      <>
      <PassengerDetails 
        passenger={correctedPassenger}
        onEdit={()=>alert("edit")}
        onDelete={()=>alert("edit")}
      />
      <pre>
        {JSON.stringify(passenger,"",2)}
      </pre>
      </>
    );
  };

  return (
    <main className=''>
      {loading ? <LoadingDetails /> : <Details />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default PassengerDetailPage;
