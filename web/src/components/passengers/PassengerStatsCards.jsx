import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../PopUpComponent';
import Table from '../Table';
import StatCard from '../common/StatCard';
import { formatCPF, formatPhoneNumber } from '../../utils/formatters';

// Constantes
const TIPO_PASSAGEIRO_MAP = { 1: 'Estudante', 2: 'Corporativo' };

const STATS_MESSAGE = {
  total: (count) => `Total de ${count} passageiro(s) cadastrado(s)`,
  pcd: (count) => `${count} passageiro(s) com deficiência`,
  active: (count) => `${count} passageiro(s) ativo(s)`,
  inactive: (count) => `${count} passageiro(s) inativo(s)`
};

const STATS_CONFIG = {
  total: {
    title: "Total de Passageiros",
    iconClass: "bi bi-people-fill",
    gradient: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
    popupTitle: 'Total de Passageiros'
  },
  pcd: {
    title: "Passageiros PCD",
    iconClass: "bi bi-universal-access",
    gradient: "linear-gradient(135deg, #17A2B8 0%, #138496 100%)",
    popupTitle: 'Passageiros com Deficiência'
  },
  active: {
    title: "Passageiros Ativos",
    iconClass: "bi bi-person-check-fill",
    gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)",
    popupTitle: 'Passageiros Ativos'
  },
  inactive: {
    title: "Passageiros Inativos",
    iconClass: "bi bi-person-x-fill",
    gradient: "linear-gradient(135deg, #DC3545 0%, #C82333 100%)",
    popupTitle: 'Passageiros Inativos'
  }
};

// Função utilitária para filtrar passageiros por categoria
const filterPassengersByCategory = (passengers, category) => {
  switch (category) {
    case 'pcd':
      return passengers.filter(passenger => passenger.pcd === true || passenger.pcd === 1);
    
    case 'active':
      return passengers.filter(passenger => passenger.ativo === true || passenger.ativo === 1);
    
    case 'inactive':
      return passengers.filter(passenger => passenger.ativo === false || passenger.ativo === 0);
    
    case 'total':
    default:
      return passengers;
  }
};

const PassengersListPopup = ({ passengers, category }) => {
  const tableHeaders = useMemo(() => {
    const baseHeaders = [
      { id: "nome", label: "Nome", sortable: true },
      { id: "cpf", label: "CPF", sortable: true },
      { id: "email", label: "E-mail", sortable: true },
      { id: "telefone", label: "Telefone", sortable: false },
      { id: "tipo_passageiro", label: "Tipo", sortable: true }
    ];

    // Adicionar colunas específicas baseadas na categoria
    if (category === 'pcd') {
      baseHeaders.push({ id: "pcd_status", label: "PCD", sortable: true });
    } else if (category === 'active' || category === 'inactive') {
      baseHeaders.push({ id: "ativo_status", label: "Status", sortable: true });
    }

    return baseHeaders;
  }, [category]);

  const processedPassengers = useMemo(() => 
    passengers.map(passenger => ({
      ...passenger,
      tipo_passageiro: TIPO_PASSAGEIRO_MAP[passenger.tipo_passageiro_id] || passenger.tipo_passageiro || 'Não informado',
      pcd_status: (passenger.pcd === true || passenger.pcd === 1) ? 'Sim' : 'Não',
      ativo_status: (passenger.ativo === true || passenger.ativo === 1) ? 'Ativo' : 'Inativo'
    })), [passengers]
  );

  return (
    <div className="passengers-list-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '800px' }}>
      <div className="mb-3">
        <p className="text-muted mb-0">{STATS_MESSAGE[category](passengers.length)}</p>
      </div>

      {passengers.length === 0 ? (
        <div className="text-center p-4">
          <i className="bi bi-person-x fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Nenhum passageiro encontrado neste card de estatística.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table 
            headers={tableHeaders}
            data={processedPassengers}
            itemsPerPage={10}
            searchable={false}
            className="table-striped table-hover"
          />
        </div>
      )}
    </div>
  );
};

const PassengerStatsCards = ({ passengers = [] }) => {
  const popUpRef = useRef(null);

  // Memoização dos dados calculados para evitar recálculos desnecessários
  const statsData = useMemo(() => {
    const filteredData = {};
    Object.keys(STATS_CONFIG).forEach(category => {
      filteredData[category] = filterPassengersByCategory(passengers, category);
    });
    return filteredData;
  }, [passengers]);

  // Configuração final dos stats com valores calculados
  const statsConfig = useMemo(() => 
    Object.entries(STATS_CONFIG).reduce((acc, [category, config]) => {
      acc[category] = {
        ...config,
        value: statsData[category].length
      };
      return acc;
    }, {}), [statsData]
  );

  // Função otimizada para mostrar popup
  const showPassengersPopup = (category) => {
    const filteredPassengers = statsData[category];
    const config = statsConfig[category];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: PassengersListPopup,
      props: {
        passengers: filteredPassengers,
        category: category,
      }
    });
  };

  return (
    <>
      <div className="row mb-4 g-3">
        {Object.entries(statsConfig).map(([category, config]) => (
          <StatCard
            key={category}
            title={config.title}
            value={config.value}
            iconClass={config.iconClass}
            gradient={config.gradient}
            onClick={() => showPassengersPopup(category)}
            className="col-lg-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

export default PassengerStatsCards;
