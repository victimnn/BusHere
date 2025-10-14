import React from 'react';
import PropTypes from 'prop-types';

const NoticeCard = ({ 
  notice, 
  priorityStyle, 
  scopeInfo, 
  expiringFlag, 
  newFlag,
  formatDate 
}) => {
  return (
    <div
      className={`modern-card card border-0 shadow-sm border-start border-4 ${priorityStyle.border}`}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div 
              className={`stat-icon ${priorityStyle.badge} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center`}
              style={{ width: '40px', height: '40px' }}
            >
              <i className={`bi ${priorityStyle.icon} ${priorityStyle.color}`}></i>
            </div>
            <h6 className="mb-0 fw-bold">{notice.titulo}</h6>
          </div>
          
          <div className="d-flex gap-2 flex-wrap">
            {newFlag && (
              <span className="badge text-white" style={{ backgroundColor: '#0d6efd' }}>
                <i className="bi bi-star-fill me-1"></i>Novo
              </span>
            )}
            
            <span 
              className={`badge text-white border-0`}
              style={{ 
                backgroundColor: 
                  notice.prioridade === 'ALTA' ? '#dc3545' : 
                  notice.prioridade === 'MEDIA' ? '#0d6efd' : 
                  notice.prioridade === 'BAIXA' ? '#198754' : '#6c757d'
              }}
            >
              {notice.prioridade}
            </span>
          </div>
        </div>

        <p className="text-secondary mb-3" style={{ whiteSpace: 'pre-line' }}>
          {notice.conteudo}
        </p>

        <div className="d-flex flex-wrap gap-3 align-items-center small">
          <div className="d-flex align-items-center">
            <div 
              className={`bg-${scopeInfo.color.replace('text-', '')} bg-opacity-10 rounded-circle p-2 me-2`}
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className={`bi ${scopeInfo.icon} ${scopeInfo.color}`}></i>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Escopo</div>
              <div className="fw-semibold">{scopeInfo.label}</div>
            </div>
          </div>

          <div className="vr"></div>

          <div className="d-flex align-items-center">
            <div 
              className="bg-info bg-opacity-10 rounded-circle p-2 me-2"
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="bi bi-calendar text-info"></i>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Publicado</div>
              <div className="fw-semibold">{formatDate(notice.data_publicacao)}</div>
            </div>
          </div>

          {notice.data_expiracao && (
            <>
              <div className="vr"></div>
              
              <div className={`d-flex align-items-center ${expiringFlag ? 'text-warning' : ''}`}>
                <div 
                  className={`${expiringFlag ? 'bg-warning' : 'bg-secondary'} bg-opacity-10 rounded-circle p-2 me-2`}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className={`bi ${expiringFlag ? 'bi-hourglass-split text-warning' : 'bi-clock text-secondary'}`}></i>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {expiringFlag ? 'Expira em breve!' : 'Válido até'}
                  </div>
                  <div className={`fw-semibold ${expiringFlag ? 'text-warning' : ''}`}>
                    {formatDate(notice.data_expiracao)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

NoticeCard.propTypes = {
  notice: PropTypes.object.isRequired,
  priorityStyle: PropTypes.object.isRequired,
  scopeInfo: PropTypes.object.isRequired,
  expiringFlag: PropTypes.bool.isRequired,
  newFlag: PropTypes.bool.isRequired,
  formatDate: PropTypes.func.isRequired
};

export default NoticeCard;
