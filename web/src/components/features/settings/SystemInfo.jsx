import React from 'react';
import PropTypes from 'prop-types';
import DetailSection from '../details/DetailSection';
import DetailItem from '../details/DetailItem';
import { useSystemInfo } from '@web/hooks';

/**
 * Componente para exibir informações do sistema
 */
const SystemInfo = ({ animationDelay = "0s" }) => {
  const { systemInfo, isLoading, error, refetch } = useSystemInfo();

  if (isLoading) {
    return (
      <div 
        className="card p-4 border-0 animate__animated animate__fadeInUp flex-fill" 
        style={{ animationDelay }}
      >
        <DetailSection
          title="Informações do Sistema"
          icon="bi-info-circle"
          headerBg="body-bg"
          className="d-flex flex-column h-100"
        >
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </DetailSection>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="card p-4 border-0 animate__animated animate__fadeInUp flex-fill" 
        style={{ animationDelay }}
      >
        <DetailSection
          title="Informações do Sistema"
          icon="bi-info-circle"
          headerBg="body-bg"
          className="d-flex flex-column h-100"
        >
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Erro ao carregar informações:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={refetch}
              >
                <i className="bi bi-arrow-clockwise"></i> Tentar Novamente
              </button>
            </div>
          </div>
        </DetailSection>
      </div>
    );
  }

  return (
    <div 
      className="card p-4 border-0 animate__animated animate__fadeInUp flex-fill" 
      style={{ animationDelay }}
    >
      <DetailSection
        title="Informações do Sistema"
        icon="bi-info-circle"
        headerBg="body-bg"
        className="d-flex flex-column h-100"
      >
        {/* Versão e Atualização */}
        <div className="col-12 mb-3">
          <div className="border rounded p-3">
            <DetailItem
              icon="bi-tag"
              label="Versão"
              value={systemInfo.version}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-calendar-event"
              label="Última Atualização"
              value={systemInfo.lastUpdate}
              bg="bg-transparent"
              size="col-12"
            />
          </div>
        </div>

        {/* Ambiente e Status */}
        <div className="col-12 mb-3">
          <div className="border rounded p-3">
            <DetailItem
              icon="bi-server"
              label="Ambiente"
              value={
                <span className={`badge ${systemInfo.environment === 'Produção' ? 'bg-success' : 'bg-warning'} fs-6`}>
                  {systemInfo.environment}
                </span>
              }
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-wifi"
              label="Status do Servidor"
              value={
                <span className={`badge ${systemInfo.status === 'Online' ? 'bg-success' : 'bg-danger'} fs-6`}>
                  <i className={`bi ${systemInfo.status === 'Online' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                  {systemInfo.status}
                </span>
              }
              bg="bg-transparent"
              size="col-12"
            />
            {systemInfo.stats.dbStatus && (
              <>
                <hr className="my-2" />
                <DetailItem
                  icon="bi-database"
                  label="Status do Banco"
                  value={
                    <span className={`badge ${systemInfo.stats.dbStatus.includes('Conectado') ? 'bg-success' : 'bg-danger'} fs-6`}>
                      {systemInfo.stats.dbStatus}
                    </span>
                  }
                  bg="bg-transparent"
                  size="col-12"
                />
              </>
            )}
          </div>
        </div>

        {/* Estatísticas de Uso */}
        <div className="col-12 mb-3">
          <div className="border rounded p-3">
            <h6 className="mb-3">Estatísticas de Uso</h6>
            <DetailItem
              icon="bi-clock"
              label="Tempo Ativo"
              value={systemInfo.stats.activeTime}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-calendar-check"
              label="Último Login"
              value={systemInfo.stats.lastLogin}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-check2-circle"
              label="Configurações Salvas"
              value={<span className="fw-bold text-success">{systemInfo.stats.settingsSaved}</span>}
              bg="bg-transparent"
              size="col-12"
            />
            {systemInfo.stats.uptime && (
              <>
                <hr className="my-2" />
                <DetailItem
                  icon="bi-stopwatch"
                  label="Uptime do Servidor"
                  value={systemInfo.stats.uptime}
                  bg="bg-transparent"
                  size="col-12"
                />
              </>
            )}
          </div>
        </div>

        {/* Performance */}
        <div className="col-12">
          <div className="border rounded p-3">
            <h6 className="mb-3">Performance</h6>
            <DetailItem
              icon="bi-memory"
              label="Memória do Navegador"
              value={systemInfo.stats.memory}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-hdd-stack"
              label="Cache Local"
              value={<span className="fw-bold text-info">{systemInfo.stats.cache}</span>}
              bg="bg-transparent"
              size="col-12"
            />
            {systemInfo.stats.serverRam && (
              <>
                <hr className="my-2" />
                <DetailItem
                  icon="bi-server"
                  label="RAM do Servidor"
                  value={<span className="fw-bold text-warning">{systemInfo.stats.serverRam}</span>}
                  bg="bg-transparent"
                  size="col-12"
                />
              </>
            )}
          </div>
        </div>

        {/* Botão de Atualização */}
        <div className="col-12 mt-3">
          <button 
            className="btn btn-outline-primary w-100"
            onClick={refetch}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            {isLoading ? 'Atualizando...' : 'Atualizar Informações'}
          </button>
        </div>
      </DetailSection>
    </div>
  );
};

SystemInfo.propTypes = {
  animationDelay: PropTypes.string
};

export default SystemInfo;
