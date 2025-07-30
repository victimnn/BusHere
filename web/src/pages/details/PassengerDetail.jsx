import React, { useState, useEffect, useRef, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@web/api/api';
import PopUpComponent from '@web/components/PopUpComponent';
import { formatCPF, formatPhoneNumber, formatDateFromDatabase } from '@shared/formatters';


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
    <div className="container mt-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Carregando...</span>
          </div>
          <h5 className="text-muted mb-2">Carregando detalhes do passageiro...</h5>
          <p className="text-muted mb-0">Aguarde enquanto buscamos as informações.</p>
        </div>
      </div>
    </div>
  );

  const Details = () => {
    if (!passenger) {
      return (
        <div className="container mt-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-person-slash fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">Nenhum dado encontrado</h5>
              <p className="text-muted mb-0">Não foi possível carregar as informações do passageiro.</p>
            </div>
          </div>
        </div>
      );
    }

    const formatCPFWithDefault = (cpf) => {
      if (!cpf) return "Não informado";
      return formatCPF(cpf);
    };

    const formatPhoneWithDefault = (phone) => {
      if (!phone) return "Não informado";
      return formatPhoneNumber(phone);
    };

    const formatDateWithDefault = (date) => {
      if (!date) return "Não informado";
      return formatDateFromDatabase(date);
    };

    const getPassengerTypeText = (type) => {
      const types = {
        1: "Estudante",
        2: "Corporativo",
      };
      return types[type] || "Não informado";
    };

    return (
      <div className="container detail-page">
        {/* Header Card com informações principais */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-primary text-white py-4">
            <div className="d-flex align-items-center">
              <div className="avatar bg-white text-primary rounded-circle me-4 d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
                <i className="bi bi-person-fill fs-2"></i>
              </div>
              <div>
                <h3 className="mb-1 fw-bold">{passenger.nome_completo || "Nome não informado"}</h3>
                <div className="d-flex gap-3 mb-0">
                  <span className="badge bg-light text-primary fs-6">
                    <i className="bi bi-person-badge me-1"></i>
                    {getPassengerTypeText(passenger.tipo_passageiro)}
                  </span>
                  {passenger.cpf && (
                    <span className="badge bg-light text-primary fs-6">
                      <i className="bi bi-card-text me-1"></i>
                      {formatCPFWithDefault(passenger.cpf)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Detalhadas */}
        <div className="row g-4">
          {/* Informações Pessoais */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-person-vcard text-primary me-2"></i>
                  Informações Pessoais
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-person text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Nome Completo</small>
                        <span className="fw-medium">{passenger.nome_completo || "Não informado"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-card-text text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">CPF</small>
                        <span className="fw-medium">{formatCPFWithDefault(passenger.cpf)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-calendar-event text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Data de Nascimento</small>
                        <span className="fw-medium">{formatDateWithDefault(passenger.data_nascimento)}</span>
                      </div>
                    </div>
                  </div>
                  {passenger.data_cadastro && (
                    <div className="col-12">
                      <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                        <i className="bi bi-calendar-plus text-primary me-3 fs-5"></i>
                        <div>
                          <small className="text-muted d-block">Data de Cadastro</small>
                          <span className="fw-medium">{formatDateWithDefault(passenger.data_cadastro)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-telephone text-primary me-2"></i>
                  Informações de Contato
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-envelope text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">E-mail</small>
                        <span className="fw-medium">{passenger.email || "Não informado"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Telefone</small>
                        <span className="fw-medium">{formatPhoneWithDefault(passenger.telefone)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-item d-flex align-items-center p-3 rounded bg-light">
                      <i className="bi bi-geo-alt text-primary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Endereço</small>
                        <span className="fw-medium">
                          {passenger.endereco || "Não informado"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {passenger.observacoes && (
                    <div className="col-12">
                      <div className="detail-item d-flex align-items-start p-3 rounded bg-light">
                        <i className="bi bi-chat-text text-primary me-3 fs-5 mt-1"></i>
                        <div>
                          <small className="text-muted d-block">Observações</small>
                          <span className="fw-medium">{passenger.observacoes}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 fw-semibold">Ações do Passageiro</h6>
                <small className="text-muted">Editar informações ou remover passageiro do sistema</small>
              </div>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-outline-danger btn-lg px-4" 
                  onClick={() => alert("delete")}
                >
                  <i className="bi bi-trash me-2"></i> Excluir
                </button>
                <button 
                  className="btn btn-primary btn-lg px-4" 
                  onClick={() => alert("edit")}
                >
                  <i className="bi bi-pencil-square me-2"></i> Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-warning text-dark py-2">
              <h6 className="mb-0">
                <i className="bi bi-bug me-2"></i>
                Dados de Debug (apenas em desenvolvimento)
              </h6>
            </div>
            <div className="card-body">
              <pre className="bg-dark text-light p-3 rounded" style={{fontSize: '0.8rem', overflow: 'auto'}}>
                {JSON.stringify(passenger, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className='p-3'>
      {loading ? <LoadingDetails /> : <Details />}
      <PopUpComponent ref={popUpRef} />
    </main>
  );
}

export default PassengerDetailPage;
