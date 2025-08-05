import React, { useEffect, useRef } from "react";
import Table from "@web/components/Table";
import { useRecentActivities } from "@web/hooks/useRecentActivities";

const TABLE_HEADERS = [
  { id: "operacao", label: "Operação", sortable: true },
  { id: "tabela", label: "Tabela", sortable: true },
  { id: "registro_id", label: "ID do Registro", sortable: true },
  { id: "timestamp", label: "Data/Hora", sortable: true },
  { id: "usuario_id", label: "Usuário", sortable: true },
  { id: "dados_antigos", label: "Dados Antigos", sortable: false },
  { id: "dados_novos", label: "Dados Novos", sortable: false },
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
    dados_antigos: item.dados_antigos ? JSON.parse(item.dados_antigos) : '-',
    dados_novos: {a: "1", b: "2"}, 
    operacao: (
      <span className={getOperationBadge(item.operacao)}>
        {item.operacao}
      </span>
    )
  }));

  console.log("aaa",transformedData   )

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
        onRowClick={(row)=> console.log('Row clicked:', row)} 
      />
    </div>
  );
}

export default RecentActivityTable;


