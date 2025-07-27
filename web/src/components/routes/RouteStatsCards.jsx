import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../PopUpComponent';
import Table from '../Table';
import StatCard from '../common/StatCard';

const STATUS_MAP = {
  1: 'Ativa',
  2: 'Inativa',
  3: 'Em Planejamento'
};

const STATS_MESSAGE = {
  total: (count) => `Total de ${count} rotas cadastradas`,
  active: (count) => `${count} rotas ativas`,
  inactive: (count) => `${count} rotas inativas`,
  planning: (count) => `${count} rotas em planejamento`
};

const STATS_CONFIG = {
  total: {
    title: "Total de Rotas",
    iconClass: "bi bi-signpost-split-fill",
    gradient: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
    popupTitle: 'Total de Rotas'
  },
  active: {
    title: "Ativas",
    iconClass: "bi bi-check-circle-fill",
    gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)",
    popupTitle: 'Rotas Ativas'
  },
  planning: {
    title: "Em Planejamento",
    iconClass: "bi bi-pencil-fill",
    gradient: "linear-gradient(135deg, #FFC107 0%, #E0A800 100%)",
    popupTitle: 'Rotas em Planejamento'
  },
  inactive: {
    title: "Inativas",
    iconClass: "bi bi-x-circle-fill",
    gradient: "linear-gradient(135deg, #DC3545 0%, #C82333 100%)",
    popupTitle: 'Rotas Inativas'
  }
};

const filterRoutesByCategory = (routes, category) => {
  switch (category) {
    case 'active':
      return routes.filter(route => route.status_nome === "Ativa");
    case 'inactive':
      return routes.filter(route => route.status_nome === "Inativa");
    case 'planning':
      return routes.filter(route => route.status_nome === "Em Planejamento");
    case 'total':
    default:
      return routes;
  }
};

const RoutesListPopup = ({ routes, category }) => {
  const tableHeaders = useMemo(() => [
    { id: "nome", label: "Nome", sortable: true },
    { id: "origem_descricao", label: "Origem", sortable: true },
    { id: "destino_descricao", label: "Destino", sortable: true },
    { id: "status", label: "Status", sortable: true }
  ], []);

  const processedRoutes = useMemo(() => 
    routes.map(route => ({
      ...route,
      status_nome: STATUS_MAP[route.status_rota_id] || 'Não informado'
    })), [routes]
  );

  return (
    <div className="routes-list-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '800px' }}>
      <div className="mb-3">
        <p className="text-muted mb-0">{STATS_MESSAGE[category](routes.length)}</p>
      </div>

      {routes.length === 0 ? (
        <div className="text-center p-4">
          <i className="bi bi-signpost-split fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Nenhuma rota encontrada neste card de estatística.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table 
            headers={tableHeaders}
            data={processedRoutes}
            itemsPerPage={10}
            searchable={false}
            className="table-striped table-hover"
          />
        </div>
      )}
    </div>
  );
};

const RouteStatsCards = ({ routes = [] }) => {
  const popUpRef = useRef(null);

  const statsData = useMemo(() => {
    const filteredData = {};
    Object.keys(STATS_CONFIG).forEach(category => {
      filteredData[category] = filterRoutesByCategory(routes, category);
    });
    return filteredData;
  }, [routes]);

  const statsConfig = useMemo(() => 
    Object.entries(STATS_CONFIG).reduce((acc, [category, config]) => {
      acc[category] = {
        ...config,
        value: statsData[category].length
      };
      return acc;
    }, {}), [statsData]
  );

  const showRoutesPopup = (category) => {
    const filteredRoutes = statsData[category];
    const config = statsConfig[category];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: RoutesListPopup,
      props: {
        routes: filteredRoutes,
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
            onClick={() => showRoutesPopup(category)}
            className="col-xl-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

export default RouteStatsCards;
