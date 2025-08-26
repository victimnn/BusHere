import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../common/buttons/ActionButton';

/**
 * Componente para exibir informações do perfil do usuário da empresa
 */
const UserProfile = ({ 
  user, 
  onLogout,
  animationDelay = "0s"
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!user) return null;

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para obter iniciais do nome
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para obter status do usuário
  const getUserStatus = () => {
    // O campo ativo pode vir como número (1 = true, 0 = false) ou boolean
    const isActive = user.ativo === true || user.ativo === 1;
    if (!isActive) return { text: 'Inativo', color: 'danger' };
    return { text: 'Ativo', color: 'success' };
  };

  const status = getUserStatus();

  return (
    <div 
      className="card p-4 mb-4 shadow-sm border-0 animate__animated animate__fadeInUp" 
      style={{ animationDelay }}
    >
      {/* Header do Perfil */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div 
            className="bg-primary rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '50px', height: '50px' }}
          >
            {user.nome ? (
              <span className="text-white fw-bold fs-6">
                {getInitials(user.nome)}
              </span>
            ) : (
              <i className="bi bi-person-fill text-white fs-6"></i>
            )}
          </div>
          <div>
            <h6 className="mb-1">{user.nome || 'Usuário'}</h6>
            <small className="text-muted">{user.email || 'email@exemplo.com'}</small>
            <div className="mt-1">
              <span className={`badge bg-${status.color} fs-6`}>
                {status.text}
              </span>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <ActionButton
            variant="outline-primary"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            icon={showDetails ? "bi-chevron-up" : "bi-chevron-down"}
            text={showDetails ? "Menos" : "Mais"}
            className="px-3"
          />
          <ActionButton
            variant="outline-danger"
            size="sm"
            onClick={onLogout}
            icon="bi-box-arrow-right"
            text="Sair"
            className="px-3"
          />
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {showDetails && (
        <div className="border-top pt-3">
          <div className="row g-3">
            {/* Informações Básicas */}
            <div className="col-md-6">
              <div className="border rounded p-3">
                <h6 className="mb-2 text-primary">
                  <i className="bi bi-person-badge me-2"></i>
                  Informações Básicas
                </h6>
                <div className="mb-2">
                  <small className="text-muted">Nome Completo:</small>
                  <div className="fw-medium">{user.nome || 'N/A'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Login:</small>
                  <div className="fw-medium">{user.login_usuario || 'N/A'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Email:</small>
                  <div className="fw-medium">{user.email || 'N/A'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Telefone:</small>
                  <div className="fw-medium">{user.telefone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="col-md-6">
              <div className="border rounded p-3">
                <h6 className="mb-2 text-info">
                  <i className="bi bi-gear me-2"></i>
                  Informações do Sistema
                </h6>
                <div className="mb-2">
                  <small className="text-muted">ID do Usuário:</small>
                  <div className="fw-medium">{user.usuario_empresa_id || 'N/A'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Data de Criação:</small>
                  <div className="fw-medium">{formatDate(user.criacao)}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Última Atualização:</small>
                  <div className="fw-medium">{formatDate(user.atualizacao)}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Último Login:</small>
                  <div className="fw-medium">{formatDate(user.data_ultimo_login)}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">IP do Último Login:</small>
                  <div className="fw-medium">{user.ip_ultimo_login || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Status da Conta */}
            <div className="col-12">
              <div className="border rounded p-3">
                <h6 className="mb-2 text-success">
                  <i className="bi bi-shield-check me-2"></i>
                  Status da Conta
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <small className="text-muted">Status da Conta:</small>
                    <div className="fw-medium">
                      <span className={`badge bg-${(user.ativo === true || user.ativo === 1) ? 'success' : 'danger'}`}>
                        {(user.ativo === true || user.ativo === 1) ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">Tipo de Usuário:</small>
                    <div className="fw-medium">
                      {user.login_usuario === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">Sessão Ativa:</small>
                    <div className="fw-medium">
                      <span className="badge bg-success">Sim</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="col-12">
              <div className="d-flex gap-2 justify-content-center">
                <ActionButton
                  variant="outline-warning"
                  size="sm"
                  onClick={() => console.log('Funcionalidade de edição em desenvolvimento')}
                  icon="bi-pencil"
                  text="Editar Perfil"
                />
                <ActionButton
                  variant="outline-info"
                  size="sm"
                  onClick={() => console.log('Funcionalidade de histórico em desenvolvimento')}
                  icon="bi-clock-history"
                  text="Histórico de Login"
                />
                <ActionButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => console.log('Funcionalidade de permissões em desenvolvimento')}
                  icon="bi-key"
                  text="Permissões"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    usuario_empresa_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    login_usuario: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    data_ultimo_login: PropTypes.string,
    criacao: PropTypes.string,
    atualizacao: PropTypes.string,
    ativo: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    ip_ultimo_login: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired,
  animationDelay: PropTypes.string
};

export default UserProfile;
