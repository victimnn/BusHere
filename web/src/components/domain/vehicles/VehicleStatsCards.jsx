import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../../core/feedback/PopUpComponent';
import { Table } from '@web/components/common/data-display';
import { StatCard } from '@web/components/common/data-display';

// Constantes para status de veículos
const STATUS_MAP = { 
  1: 'Em Operação', 
  2: 'Em Manutenção', 
  3: 'Inativo' 
};

const STATS_MESSAGE = {
  total: (count) => `Total de ${count} veículo(s) cadastrado(s)`,
  operational: (count) => `${count} veículo(s) em operação`,
  maintenance: (count) => `${count} veículo(s) em manutenção`,
  inactive: (count) => `${count} veículo(s) inativo(s)`
};

const STATS_CONFIG = {
  total: {
    title: "Total de Veículos",
    iconClass: "bi bi-car-front-fill",
    className: "col-12 col-sm-6 col-lg-3",
    gradient: "bg-gradient-info",
    popupTitle: 'Total de Veículos'
  },
  operational: {
    title: "Em Operação",
    iconClass: "bi bi-check-circle-fill",
    className: "col-12 col-sm-6 col-lg-3",
    gradient: "bg-gradient-primary",
    popupTitle: 'Veículos Em Operação'
  },
  maintenance: {
    title: "Em Manutenção",
    iconClass: "bi bi-tools",
    className: "col-12 col-sm-6 col-lg-3",
    gradient: "bg-gradient-warning",
    popupTitle: 'Veículos Em Manutenção'
  },
  inactive: {
    title: "Inativos",
    iconClass: "bi bi-x-circle-fill",
    className: "col-12 col-sm-6 col-lg-3",
    gradient: "bg-gradient-danger",
    popupTitle: 'Veículos Inativos'
  }
};

// Função utilitária para filtrar veículos por categoria
const filterVehiclesByCategory = (vehicles, category) => {
  switch (category) {
    case 'operational':
      return vehicles.filter(vehicle => vehicle.status_veiculo_id === 1);
    
    case 'maintenance':
      return vehicles.filter(vehicle => vehicle.status_veiculo_id === 2);
    
    case 'inactive':
      return vehicles.filter(vehicle => vehicle.status_veiculo_id === 3);
    
    case 'total':
    default:
      return vehicles;
  }
};

const VehiclesListPopup = ({ vehicles, category }) => {
  const tableHeaders = useMemo(() => [
    { id: "nome", label: "Nome", sortable: true },
    { id: "placa", label: "Placa", sortable: true },
    { id: "tipo_nome", label: "Tipo", sortable: true },
    { id: "modelo", label: "Modelo", sortable: true },
    { id: "marca", label: "Marca", sortable: true },
    { id: "ano_fabricacao", label: "Ano", sortable: true },
    { id: "capacidade", label: "Capacidade", sortable: true },
    { id: "status_nome", label: "Status", sortable: true }
  ], []);

  const processedVehicles = useMemo(() => 
    vehicles.map(vehicle => ({
      ...vehicle,
      status_nome: vehicle.status_nome || STATUS_MAP[vehicle.status_veiculo_id] || 'Não informado'
    })), [vehicles]
  );

  return (
    <div className="vehicles-list-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '800px' }}>
      <div className="mb-3">
        <p className="text-muted mb-0">{STATS_MESSAGE[category](vehicles.length)}</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center p-4">
          <i className="bi bi-car-front fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Nenhum veículo encontrado neste card de estatística.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table 
            headers={tableHeaders}
            data={processedVehicles}
            itemsPerPage={10}
            searchable={false}
            className="table-striped table-hover"
          />
        </div>
      )}
    </div>
  );
};

const VehicleStatsCards = ({ vehicles = [] }) => {
  const popUpRef = useRef(null);

  // Memoização dos dados calculados para evitar recálculos desnecessários
  const statsData = useMemo(() => {
    const filteredData = {};
    Object.keys(STATS_CONFIG).forEach(category => {
      filteredData[category] = filterVehiclesByCategory(vehicles, category);
    });
    return filteredData;
  }, [vehicles]);

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
  const showVehiclesPopup = (category) => {
    const filteredVehicles = statsData[category];
    const config = statsConfig[category];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: VehiclesListPopup,
      props: {
        vehicles: filteredVehicles,
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
            onClick={() => showVehiclesPopup(category)}
            className="col-xl-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

export default VehicleStatsCards;
