import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../../ui/PopUpComponent';
import Table from '../../ui/Table';
import StatCard from '../../common/StatCard';
import { formatCPF, formatPhoneNumber, formatDateFromDatabase } from '@shared/formatters';

// Constantes
const STATUS_MAP = { 
  1: 'Ativo', 
  2: 'Férias', 
  3: 'Afastado', 
  4: 'Inativo' 
};

const STATS_MESSAGE = {
  total: (count) => `Total de ${count} motorista(s) cadastrado(s)`,
  active: (count) => `${count} motorista(s) ativo(s)`,
  holiday: (count) => `${count} motorista(s) em férias`,
  expiring: (count) => `${count} motorista(s) com CNH próxima do vencimento (próximos 6 meses)`
};

const STATS_CONFIG = {
  total: {
    title: "Total de Motoristas",
    iconClass: "bi bi-person-fill-gear",
    gradient: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
    popupTitle: 'Total de Motoristas'
  },
  active: {
    title: "Motoristas Ativos",
    iconClass: "bi bi-person-check-fill",
    gradient: "linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)",
    popupTitle: 'Motoristas Ativos'
  },
  holiday: {
    title: "Motoristas em Férias",
    iconClass: "bi bi-person-fill-dash",
    gradient: "linear-gradient(135deg, #FFC107 0%, #E0A800 100%)",
    popupTitle: 'Motoristas em Férias'
  },
  expiring: {
    title: "CNH Próxima do Vencimento",
    iconClass: "bi bi-exclamation-triangle-fill",
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFC107 100%)",
    popupTitle: 'CNH Próxima do Vencimento'
  }
};

// Função utilitária para filtrar motoristas por stats
const filterDriversByCategory = (drivers, stats) => {
  // Define a data de hoje, zerando o horário para evitar problemas de fuso horário
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Define a data limite de 6 meses a partir de hoje
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(today.getMonth() + 6);

  switch (stats) {
    case 'active':
      return drivers.filter(driver => driver.status_motorista_id === 1);

    case 'holiday':
      return drivers.filter(driver => driver.status_motorista_id === 2);

    case 'expiring':
      return drivers.filter(driver => {
        // Ignora motoristas sem data de validade
        if (!driver.cnh_validade) return false;

        // Converte a data no formato 'DD/MM/YYYY' para um objeto Date
        const parts = driver.cnh_validade.split('/');
        if (parts.length !== 3) return false; // Formato inválido

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mês no JavaScript é de 0 a 11
        const year = parseInt(parts[2], 10);
        
        const cnhExpiration = new Date(year, month, day);

        // Verifica se a data é válida antes de comparar
        if (isNaN(cnhExpiration.getTime())) {
          return false;
        }
        
        // Retorna true se a CNH expira nos próximos 6 meses e ainda não venceu
        return cnhExpiration <= sixMonthsFromNow && cnhExpiration >= today;
      });
    
    case 'total':
    default:
      return drivers;
  }
};


const DriversListPopup = ({ drivers, stats }) => {
  const tableHeaders = useMemo(() => [
    { id: "nome", label: "Nome", sortable: true },
    { id: "cpf", label: "CPF", sortable: true },
    { id: "cnh_numero", label: "CNH", sortable: false },
    { id: "cnh_categoria", label: "Categoria", sortable: true },
    { id: "telefone", label: "Telefone", sortable: false },
    ...(stats === 'expiring' ? [{ id: "cnh_validade", label: "Validade CNH", sortable: true }] : []),
    { id: "status_nome", label: "Status", sortable: true }
  ], [stats]);

  const processedDrivers = useMemo(() => 
    drivers.map(driver => ({
      ...driver,
      cpf: formatCPF(driver.cpf),
      telefone: formatPhoneNumber(driver.telefone),
      cnh_validade: formatDateFromDatabase(driver.cnh_validade),
      status_nome: STATUS_MAP[driver.status_motorista_id] || 'Não informado'
    })), [drivers]
  );

  return (
    <div className="drivers-list-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '800px' }}>
      <div className="mb-3">
        <p className="text-muted mb-0">{STATS_MESSAGE[stats](drivers.length)}</p>
      </div>

      {drivers.length === 0 ? (
        <div className="text-center p-4">
          <i className="bi bi-person-x fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">Nenhum motorista encontrado neste card de estatistica.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table 
            headers={tableHeaders}
            data={processedDrivers}
            itemsPerPage={10}
            searchable={false}
            className="table-striped table-hover"
          />
        </div>
      )}
    </div>
  );
};

const DriversStatsCards = ({ drivers = [] }) => {
  const popUpRef = useRef(null);

  // Memoização dos dados calculados para evitar recálculos desnecessários
  const statsData = useMemo(() => {
    const filteredData = {};
    Object.keys(STATS_CONFIG).forEach(stats => {
      filteredData[stats] = filterDriversByCategory(drivers, stats);
    });
    return filteredData;
  }, [drivers]);

  // Configuração final dos stats com valores calculados
  const statsConfig = useMemo(() => 
    Object.entries(STATS_CONFIG).reduce((acc, [stats, config]) => {
      acc[stats] = {
        ...config,
        value: statsData[stats].length
      };
      return acc;
    }, {}), [statsData]
  );

  // Função otimizada para mostrar popup
  const showDriversPopup = (stats) => {
    const filteredDrivers = statsData[stats];
    const config = statsConfig[stats];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: DriversListPopup,
      props: {
        drivers: filteredDrivers,
        stats: stats,
      }
    });
  };

  return (
    <>
      <div className="row mb-4 g-3">
        {Object.entries(statsConfig).map(([stats, config]) => (
          <StatCard
            key={stats}
            title={config.title}
            value={config.value}
            iconClass={config.iconClass}
            gradient={config.gradient}
            onClick={() => showDriversPopup(stats)}
            className="col-xl-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

export default DriversStatsCards;
