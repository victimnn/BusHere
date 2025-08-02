import React, { useEffect, useRef } from "react";
import Table from "@web/components/Table";
import { useRecentActivities } from "@web/hooks/useRecentActivities";

const TABLE_HEADERS = [
  { id: "operacao", label: "Operação", sortable: true },
  { id: "tabela", label: "Tabela", sortable: true },
  { id: "timestamp", label: "Data/Hora", sortable: true },
  { id: "usuario_id", label: "Usuário", sortable: true }
];

// Função para formatar a data
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return timestamp;
  }
};

// Função para mapear operações para cores
const getOperationBadge = (operation) => {
  const badges = {
    'INSERT': 'badge bg-success',
    'UPDATE': 'badge bg-warning text-dark',
    'DELETE': 'badge bg-danger'
  };
  return badges[operation] || 'badge bg-secondary';
};

function RecentActivityTable({ data = [], itemsPerPage = 5 }) {
  // Transformar os dados para incluir formatação
  const transformedData = data.map(item => ({
    ...item,
    timestamp: formatTimestamp(item.timestamp),
    operacao: (
      <span className={getOperationBadge(item.operacao)}>
        {item.operacao}
      </span>
    )
  }));

  return (
    <div className="mb-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Atividades Recentes
        </h5>
      </div>
      <Table 
        headers={TABLE_HEADERS} 
        data={transformedData} 
        itemsPerPage={itemsPerPage}
        searchable={false}
        className="table-striped table-hover"  
      />
    </div>
  );
}

export default RecentActivityTable;


