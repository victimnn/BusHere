import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@web/api/api';
import PopUpComponent from '@web/components/PopUpComponent';

function StopDetail({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Ponto", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { stopId } = useParams();
  const [stopDetails, setStopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);

  const fetchStopDetails = async () => {
    try {
      const response = await api.stops.getById(stopId);
      if (response) {
        setStopDetails(response);
      } else {
        console.error("Dados do ponto não encontrados", response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do ponto:", error);
      popUpRef.current.show({
        title: "Erro",
        content: () => <div>Não foi possível carregar os detalhes do ponto. Tente novamente mais tarde.</div>,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStopDetails();
  }, [stopId]);

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes do ponto...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  const StopDetails = () => {
    if (!stopDetails) {
      return <div>Nenhum dado encontrado</div>;
    }

    return (
      <div className="container">
        <h2>Detalhes do Ponto {stopId}</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dados JSON</h5>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(stopDetails, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <StopDetails />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default StopDetail;
