import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@web/api/api';
import PopUpComponent from '@web/components/PopUpComponent';

function DriverDetail({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Motorista", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { driverId } = useParams();
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);

  const fetchDriverDetails = async () => {
    try {
      const response = await api.drivers.getById(driverId);
      if (response) {
        setDriverDetails(response);
      } else {
        console.error("Dados do motorista não encontrados", response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do motorista:", error);
      popUpRef.current.show({
        title: "Erro",
        content: () => <div>Não foi possível carregar os detalhes do motorista. Tente novamente mais tarde.</div>,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes do motorista...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  const DriverDetails = () => {
    if (!driverDetails) {
      return <div>Nenhum dado encontrado</div>;
    }

    return (
      <div className="container">
        <h2>Detalhes do Motorista {driverId}</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dados JSON</h5>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(driverDetails, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <DriverDetails />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default DriverDetail;
