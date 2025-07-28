import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import PopUpComponent from '../../components/PopUpComponent';
import MapComponent from '../../components/MapComponent';
import StopDetails from '../../components/stops/StopDetails';

function StopDetail({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Ponto", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { stopId } = useParams();
  const [stop, setStop] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null);
  const fetchDetails = async () => {
    try {
      const response = await api.stops.getById(stopId);
      if (response) {
        setStop(response);
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
    fetchDetails();
  }, [stopId]);

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes do ponto...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
  const Details = () => {
    if (!stop) {
      return <div>Nenhum dado encontrado</div>;
    }
    const center = [stop.latitude, stop.longitude];

    return (
      <>
      <div className='container d-flex flex-row' style={{ minHeight: "80vh" }}>
        <MapComponent 
          className="w-100 h-100"
          center={center}
          zoom={15}
        />

        <StopDetails
          stop={stop}
        />

      </div>


      <div className="container">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dados JSON</h5>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(stop, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      </>
    );
  };

  return (
    <main className='p-3 container-fluid'>
      {loading ? <LoadingDetails /> : <Details />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default StopDetail;
