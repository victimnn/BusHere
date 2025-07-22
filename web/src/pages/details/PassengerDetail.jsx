import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import PopUpComponent from '../../components/PopUpComponent';

function PassengerDetail({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Passageiro", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { passengerId } = useParams();
  const [passengerDetails, setPassengerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);

  const fetchPassengerDetails = async () => {
    try {
      const response = await api.passengers.getById(passengerId);
      if (response) {
        setPassengerDetails(response);
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

  const PassengerDetails = () => {
    if (!passengerDetails) {
      return <div>Nenhum dado encontrado</div>;
    }

    return (
      <div className="container">
        <h2>Detalhes do Passageiro {passengerId}</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dados JSON</h5>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(passengerDetails, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <PassengerDetails />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default PassengerDetail;
