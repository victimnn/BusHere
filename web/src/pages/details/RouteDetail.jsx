import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import PopUpComponent from '../../components/PopUpComponent';

function RouteDetail({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Rota", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { routeId } = useParams();
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);

  const fetchRouteDetails = async () => {
    try {
      const response = await api.routes.getById(routeId);
      if (response) {
        setRouteDetails(response);
      } else {
        console.error("Dados da rota não encontrados", response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da rota:", error);
      popUpRef.current.show({
        title: "Erro",
        content: () => <div>Não foi possível carregar os detalhes da rota. Tente novamente mais tarde.</div>,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRouteDetails();
  }, [routeId]);

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes da rota...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  const RouteDetails = () => {
    if (!routeDetails) {
      return <div>Nenhum dado encontrado</div>;
    }

    return (
      <div className="container">
        <h2>Detalhes da Rota {routeId}</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dados JSON</h5>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(routeDetails, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <RouteDetails />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default RouteDetail;
