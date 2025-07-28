import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api'; // Import your API functions
import PopUpComponent from '../../components/PopUpComponent';

function BusDetail( {pageFunctions} ) {
  useEffect(() => { pageFunctions.set("Ônibus", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { busId } = useParams(); // Obtém o ID do ônibus da URL
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  const fetchBusDetails = async () => {
    try {
      const response = await api.buses.getById(busId);
      if (response) {
        setBus(response);
      } else {
        console.error("Dados do ônibus não encontrados", response);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do ônibus:", error);
      popUpRef.current.show(
        {
          title: "Erro",
          content: () => <div>Não foi possível carregar os detalhes do ônibus. Tente novamente mais tarde.</div>,
        }
      )
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const BusRoutes = () => {
    const Route = ({name, id}) => (
      <li className="list-group-item">
        <strong>{name}:</strong> de <Link to="/stops/1">AAA</Link> até <Link to="/stops/2">BBB</Link>
        <Link to={`/routes/${id}`} className="btn btn-primary btn-sm float-end">Ver Rota</Link>
      </li>
    );



    return (
      <div className="container mt-4">
        <h2>Rotas do Ônibus</h2>
        tem que fazer isso na API
        {/* TODO(): api/bus/:id/routes */}
        <ul className="list-group">
          <Route name="Rota 1" id="1" />
          <Route name="Rota 2" id="2" />
          <Route name="Rota 3" id="3" />
        </ul>
      </div>
    );
  }

  const LoadingDetails = () => (
    <div className="text-center">
      <p>Carregando detalhes do ônibus...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
  const Details = () => {
    const prettyDate = (date) => {
      if (!date) return "N/A";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = new Date(date).toLocaleDateString(undefined, options);
      const timeDifference = new Date() - new Date(date);
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const extraText = daysDifference > 0 ? ` (${daysDifference} dias atrás)` : `(faltam ${Math.abs(daysDifference)} dias)`;
      const Icon = () => (
        <i 
          className="bi bi-clock-history ms-1"
          data-togle="tooltip"
          data-placement="bottom"
          data-delay='{"show": 500, "hide": 1000}'
          title={extraText}
        />
      )
      return (<>{dateStr}<Icon /></>);
    }
    const { nome, placa, modelo, marca, ano_fabricacao, capacidade, data_ultima_manutencao, data_proxima_manutencao, quilometragem, status } = bus;    return (
      //<>{JSON.stringify(bus)}</>
      <>
      <div className="container">
        <h2>Detalhes do Ônibus {busId}</h2>
        <ul className="list-group">
          <li className="list-group-item"><strong>Nome:</strong> {nome}</li>
          <li className="list-group-item"><strong>Placa:</strong> {placa}</li>
          <li className="list-group-item"><strong>Modelo:</strong> {modelo}</li>
          <li className="list-group-item"><strong>Marca:</strong> {marca}</li>
          <li className="list-group-item"><strong>Ano de Fabricação:</strong> {ano_fabricacao}</li>
          <li className="list-group-item"><strong>Capacidade:</strong> {capacidade}</li>
          <li className="list-group-item"><strong>Quilometragem:</strong> {quilometragem}</li>
          <li className="list-group-item"><strong>Data da Última Manutenção:</strong> {prettyDate(data_ultima_manutencao)}</li>
          <li className="list-group-item"><strong>Data da Próxima Manutenção:</strong> {prettyDate(data_proxima_manutencao)}</li>
          <li className="list-group-item"><strong>Status:</strong> {String(status)}</li>
        </ul>
      </div>

      <BusRoutes />
      </>
    )
  }
  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <Details />}
      
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default BusDetail;