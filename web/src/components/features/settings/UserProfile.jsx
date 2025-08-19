import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../common/buttons/ActionButton';

/**
 * Componente para exibir informações do perfil do usuário
 */
const UserProfile = ({ 
  user, 
  onLogout,
  animationDelay = "0s"
}) => {
  if (!user) return null;

  return (
    <div 
      className="card p-4 mb-4 shadow-sm border-0 animate__animated animate__fadeInUp" 
      style={{ animationDelay }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div 
            className="bg-primary rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '45px', height: '45px' }}
          >
            <i className="bi bi-person-fill text-white fs-6"></i>
          </div>
          <div>
            <h6 className="mb-1">{user.nome || 'Usuário'}</h6>
            <small className="text-muted">{user.email || 'email@exemplo.com'}</small>
          </div>
        </div>
        <ActionButton
          variant="outline-danger"
          size="sm"
          onClick={onLogout}
          icon="bi-box-arrow-right"
          text="Sair"
          className="px-3"
          style={{ 
            transition: 'all 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired,
  animationDelay: PropTypes.string
};

export default UserProfile;
