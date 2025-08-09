import React, { useMemo, useCallback, useState, useEffect } from "react";
import Table from "@web/components/ui/Table";
import TableActionButton from "@web/components/common/table/TableActionButton";
import { useRecentActivities } from "@web/hooks/useRecentActivities";

import { getOperationBadge, formatTimestamp } from "@shared/formatters";

const TABLE_HEADERS = [
  // { id: "mudanca_id", label: "ID", sortable: true },
  { id: "tabela", label: "Tabela", sortable: true },
  { id: "registro_id", label: "ID Registro", sortable: true },
  { id: "operacao", label: "Operação", sortable: true },
  { id: "timestamp", label: "Data/Hora", sortable: true },
  { id: "usuario", label: "Usuário", sortable: true },
  { id: "dados_antigos", label: "Dados Antigos", sortable: false },
  { id: "dados_novos", label: "Dados Novos", sortable: false },
];

function RecentActivityTable({ data = [], itemsPerPage = 5, popUpRef = null }) {
  // Estado para controlar se é a primeira carga
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  // Usa o hook para obter dados se não forem fornecidos via props
  const { activities: hookActivities, isLoading, error } = useRecentActivities();
  
  // Determina qual fonte de dados usar
  const sourceData = data.length > 0 ? data : hookActivities;
  
  // Effect para marcar que já carregou uma vez
  useEffect(() => {
    if (sourceData.length > 0) {
      setHasLoadedOnce(true);
    }
  }, [sourceData.length]);
  
  // Flags para determinar estado da interface
  const shouldShowLoading = isLoading && !hasLoadedOnce;
  const shouldShowError = error && !isLoading && sourceData.length === 0 && hasLoadedOnce;

  const createDataButton = useCallback((data, label) => {
    if (!data || data === null || data === undefined) {
      return <span className="text-muted">-</span>;
    }

    const handleClick = () => {
      if (popUpRef && popUpRef.current) {
        popUpRef.current.show({
          title: label,
          content: ({ close }) => (
            <div className="p-3">
              <div className="border rounded p-3 bg-light" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <pre className="mb-0 small text-wrap">{JSON.stringify(data, null, 2)}</pre>
              </div>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {typeof data === 'object' ? `${Object.keys(data).length} campo(s)` : 'Dados simples'}
                </small>
                <button type="button" className="btn btn-secondary btn-sm" onClick={close}>
                  <i className="bi bi-x-circle me-1"></i>Fechar
                </button>
              </div>
            </div>
          )
        });
      }
    };

    return (
      <TableActionButton
        variant="outline-primary"
        size="sm"
        icon="bi bi-eye"
        text="Ver"
        onClick={handleClick}
        title={`Ver ${label.toLowerCase()}`}
      />
    );
  }, [popUpRef]);

  const transformedData = useMemo(() => {
    if (!Array.isArray(sourceData)) return [];
    
    return sourceData.map(item => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp),
      // Cria botões para os dados antigos e novos
      dados_antigos: createDataButton(item.dados_antigos, "Dados Antigos"),
      dados_novos: createDataButton(item.dados_novos, "Dados Novos"),
      usuario: item.usuario?.nome || `Usuário ${item.usuario_id}` || 'Usuário não identificado',
      operacao: (
        <span className={getOperationBadge(item.operacao)}>
          {item.operacao}
        </span>
      )
    }));
  }, [sourceData, createDataButton]);

  // Renderiza estado de loading só quando é necessário
  if (shouldShowLoading) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="text-primary rounded-circle p-2 me-3">
                <i className="bi bi-clock-history fs-3"></i>
              </div>
              <h5 className="mb-0 fw-semibold">Atividades Recentes</h5>
            </div>
          </div>
        </div>
        <div className="card-body p-3 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza estado de erro so quando é necessário
  if (shouldShowError) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="text-primary rounded-circle p-2 me-3">
                <i className="bi bi-clock-history fs-3"></i>
              </div>
              <h5 className="mb-0 fw-semibold">Atividades Recentes</h5>
            </div>
          </div>
        </div>
        <div className="card-body p-3 text-center">
          <div className="text-danger">
            <i className="bi bi-exclamation-triangle fs-1"></i>
            <p className="mt-2">Erro ao carregar atividades recentes</p>
            <small className="text-muted">{error.message}</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="text-primary rounded-circle p-2 me-3">
              <i className="bi bi-clock-history fs-3"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-semibold">Atividades Recentes</h5>
              {transformedData.length > 0 && (
                <small className="text-muted">
                  {transformedData.length} atividade{transformedData.length !== 1 ? 's' : ''} 
                  {isLoading && " • Atualizando..."}
                </small>
              )}
            </div>
          </div>
          {isLoading && transformedData.length > 0 && (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Atualizando...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-body p-3">
        {transformedData.length === 0 && hasLoadedOnce && !shouldShowLoading && !shouldShowError ? (
          <div className="text-center py-4">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="mt-2 text-muted mb-1">Nenhuma atividade recente encontrada</p>
            <small className="text-muted">
              As atividades aparecerão aqui quando houver mudanças no sistema
            </small>
          </div>
        ) : transformedData.length > 0 ? (
          <div className="table-responsive">
            <Table 
              headers={TABLE_HEADERS} 
              data={transformedData} 
              itemsPerPage={itemsPerPage}
              searchable={false}
              className="table-striped table-hover" 
              popUpRef={popUpRef} 
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RecentActivityTable;