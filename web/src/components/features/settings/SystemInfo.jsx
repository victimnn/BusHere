import React from 'react';
import PropTypes from 'prop-types';
import DetailSection from '../details/DetailSection';
import DetailItem from '../details/DetailItem';

/**
 * Componente para exibir informações do sistema
 */
const SystemInfo = ({ 
  version = "1.0.0",
  lastUpdate = "12/08/2025",
  environment = "Produção",
  status = "Online",
  stats = {
    activeTime: "2h 34m",
    lastLogin: "Hoje, 14:32",
    settingsSaved: "Sim",
    memory: "45 MB",
    cache: "12 MB"
  },
  animationDelay = "0s"
}) => {
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
              value={version}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-calendar-event"
              label="Última Atualização"
              value={lastUpdate}
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
              value={<span className="badge bg-success fs-6">{environment}</span>}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-wifi"
              label="Status"
              value={
                <span className="badge bg-success fs-6">
                  <i className="bi bi-check-circle me-1"></i>
                  {status}
                </span>
              }
              bg="bg-transparent"
              size="col-12"
            />
          </div>
        </div>

        {/* Estatísticas de Uso */}
        <div className="col-12 mb-3">
          <div className="border rounded p-3">
            <h6 className="mb-3">Estatísticas de Uso</h6>
            <DetailItem
              icon="bi-clock"
              label="Tempo Ativo"
              value={stats.activeTime}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-calendar-check"
              label="Último Login"
              value={stats.lastLogin}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-check2-circle"
              label="Configurações Salvas"
              value={<span className="fw-bold text-success">{stats.settingsSaved}</span>}
              bg="bg-transparent"
              size="col-12"
            />
          </div>
        </div>

        {/* Performance */}
        <div className="col-12">
          <div className="border rounded p-3">
            <h6 className="mb-3">Performance</h6>
            <DetailItem
              icon="bi-memory"
              label="Memória"
              value={stats.memory}
              bg="bg-transparent"
              size="col-12"
            />
            <hr className="my-2" />
            <DetailItem
              icon="bi-hdd-stack"
              label="Cache"
              value={<span className="fw-bold text-info">{stats.cache}</span>}
              bg="bg-transparent"
              size="col-12"
            />
          </div>
        </div>
      </DetailSection>
    </div>
  );
};

SystemInfo.propTypes = {
  version: PropTypes.string,
  lastUpdate: PropTypes.string,
  environment: PropTypes.string,
  status: PropTypes.string,
  stats: PropTypes.shape({
    activeTime: PropTypes.string,
    lastLogin: PropTypes.string,
    settingsSaved: PropTypes.string,
    memory: PropTypes.string,
    cache: PropTypes.string
  }),
  animationDelay: PropTypes.string
};

export default SystemInfo;
