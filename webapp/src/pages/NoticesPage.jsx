import React from 'react';
import { useNoticesPage } from '../hooks';
import { NoticesHeader, NoticeCard, EmptyNotices, FormActionButtons, StatCard } from '../components';

const NoticesPage = () => {
  const {
    notices,
    loading,
    error,
    loadNotices,
    getPriorityStyle,
    getScopeInfo,
    formatDate,
    isExpiringSoon,
    isNew
  } = useNoticesPage();

  if (loading) {
    return (
      <div className="account-page p-0">
        <div className="container-fluid px-3 py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3 text-muted">Carregando avisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-page p-0">
        <NoticesHeader noticesCount={0} />
        <div className="container-fluid px-3">
          <div className="modern-card card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="alert alert-danger mb-3" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
              <FormActionButtons
                onClick={loadNotices}
                label="Tentar Novamente"
                icon="bi-arrow-clockwise"
                variant="primary"
                type="button"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page p-0">
      <NoticesHeader noticesCount={notices.length} />

      <div className="container-fluid px-3">
        {/* Stats Section */}
        {/* <div className="row g-3 mb-4">
          <StatCard
            icon="bi-bell-fill"
            iconColor="text-primary"
            bgColor="bg-primary"
            label="Total de Avisos"
            value={notices.length}
            colClass="col-6 col-lg-3"
          />
          
          <StatCard
            icon="bi-star-fill"
            iconColor="text-warning"
            bgColor="bg-warning"
            label="Novos (24h)"
            value={notices.filter(n => isNew(n.data_publicacao)).length}
            colClass="col-6 col-lg-3"
          />

          <StatCard
            icon="bi-exclamation-triangle-fill"
            iconColor="text-danger"
            bgColor="bg-danger"
            label="Alta Prioridade"
            value={notices.filter(n => n.prioridade === 'ALTA').length}
            colClass="col-6 col-lg-3"
          />

          <StatCard
            icon="bi-hourglass-split"
            iconColor="text-info"
            bgColor="bg-info"
            label="Expirando"
            value={notices.filter(n => isExpiringSoon(n.data_expiracao)).length}
            colClass="col-6 col-lg-3"
          />
        </div> */}

        {/* Notices List */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            {notices.length === 0 ? (
              <EmptyNotices />
            ) : (
              <div className="d-flex flex-column gap-3">
                {notices.map(notice => {
                  const priorityStyle = getPriorityStyle(notice.prioridade);
                  const scopeInfo = getScopeInfo(notice.escopo_aviso_id, notice.nome_escopo);
                  const expiringFlag = isExpiringSoon(notice.data_expiracao);
                  const newFlag = isNew(notice.data_publicacao);

                  return (
                    <NoticeCard
                      key={notice.aviso_id}
                      notice={notice}
                      priorityStyle={priorityStyle}
                      scopeInfo={scopeInfo}
                      expiringFlag={expiringFlag}
                      newFlag={newFlag}
                      formatDate={formatDate}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {notices.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div className="modern-card card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-3 fw-bold">
                    <i className="bi bi-lightning text-warning me-2"></i>
                    Ações Rápidas
                  </h6>
                  
                  <FormActionButtons
                    onClick={loadNotices}
                    label="Atualizar Avisos"
                    icon="bi-arrow-clockwise"
                    variant="primary"
                    type="button"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-muted py-3">
          <small>
            <i className="bi bi-bell me-1"></i>
            Mantenha-se informado sobre as últimas atualizações.
          </small>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
