import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../PopUpComponent';
import Table from '../Table';
import StatCard from '../common/StatCard';

// Constantes para status de ônibus
const STATUS_MAP = { 
  1: 'Em Operação', 
  2: 'Em Manutenção', 
  3: 'Inativo' 
};

const STATS_MESSAGE = {
  total: (count) => `Total de ${count} ônibus cadastrado(s)`,
  operational: (count) => `${count} ônibus em operação`,
  maintenance: (count) => `${count} ônibus em manutenção`,
  inactive: (count) => `${count} ônibus inativo(s)`
};

const STATS_CONFIG = {
  total: {
    title: "Total de Ônibus",
    iconClass: "bi bi-bus-front-fill",
    gradient: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
    popupTitle: 'Total de Ônibus'
  },
  operational: {
    title: "Em Operação",
    iconClass: "bi bi-check-circle-fill",
    gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)",
    popupTitle: 'Ônibus Em Operação'
  },
  maintenance: {
    title: "Em Manutenção",
    iconClass: "bi bi-tools",
    gradient: "linear-gradient(135deg, #FFC107 0%, #E0A800 100%)",
    popupTitle: 'Ônibus Em Manutenção'
  },
  inactive: {
    title: "Inativos",
    iconClass: "bi bi-x-circle-fill",
    gradient: "linear-gradient(135deg, #DC3545 0%, #C82333 100%)",
    popupTitle: 'Ônibus Inativos'
  }
};

// Função utilitária para filtrar ônibus por categoria
const filterBusesByCategory = (buses, category) => {
  switch (category) {
    case 'operational':
      return buses.filter(bus => bus.status_onibus_id === 1);
    
    case 'maintenance':
      return buses.filter(bus => bus.status_onibus_id === 2);
    
    case 'inactive':
      return buses.filter(bus => bus.status_onibus_id === 3);
    
    case 'total':
    default:
      return buses;
  }
};

const BusesListPopup = ({ buses, category }) => {
  const tableHeaders = useMemo(() => [
    { id: "nome", label: "Nome", sortable: true },
    { id: "placa", label: "Placa", sortable: true },
    { id: "modelo", label: "Modelo", sortable: true },
    { id: "marca", label: "Marca", sortable: true },
    { id: "ano_fabricacao", label: "Ano", sortable: true },
    { id: "capacidade", label: "Capacidade", sortable: true },
    { id: "status", label: "Status", sortable: true }
  ], []);

  const processedBuses = useMemo(() => 
    buses.map(bus => ({
      ...bus,
      status: bus.status_nome || STATUS_MAP[bus.status_onibus_id] || 'Não informado'
    })), [buses]
  );

  return (
    <div className="buses-list-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '800px' }}>
      <div className="mb-3">
        <p className="text-muted mb-0">{STATS_MESSAGE[category](buses.length)}</p>
      </div>

      {buses.length === 0 ? (
        <div className="text-center p-4">
          <i className="bi bi-bus-front fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Nenhum ônibus encontrado neste card de estatística.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table 
            headers={tableHeaders}
            data={processedBuses}
            itemsPerPage={10}
            searchable={false}
            className="table-striped table-hover"
          />
        </div>
      )}
    </div>
  );
};

const BusStatsCards = ({ buses = [] }) => {
  const popUpRef = useRef(null);

  // Memoização dos dados calculados para evitar recálculos desnecessários
  const statsData = useMemo(() => {
    const filteredData = {};
    Object.keys(STATS_CONFIG).forEach(category => {
      filteredData[category] = filterBusesByCategory(buses, category);
    });
    return filteredData;
  }, [buses]);

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
  const showBusesPopup = (category) => {
    const filteredBuses = statsData[category];
    const config = statsConfig[category];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: BusesListPopup,
      props: {
        buses: filteredBuses,
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
            onClick={() => showBusesPopup(category)}
            className="col-xl-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

export default BusStatsCards;
