import React from 'react';
import PropTypes from 'prop-types';
import { useAccountPage } from '../hooks';
import { AccountHeader, UserInfoCard, StatCard, AccountActionButton } from '../components';

const AccountPage = ({ isDark, setIsDark }) => {
  const {
    user,
    getInitials,
    formatDate,
    getUserStatus,
    handleEditProfile,
    handleLogout
  } = useAccountPage(isDark);

  return (
    <div className="account-page p-0">
      <AccountHeader user={user} getInitials={getInitials} />

      <div className="container-fluid px-3">
        <div className="row g-3 mb-4">
          <UserInfoCard user={user} />

          <div className="col-12">
            <div className="row g-3">
              <StatCard
                icon="bi-calendar-check"
                iconColor="text-info"
                bgColor="bg-info"
                label="Membro desde"
                value={formatDate(user?.data_criacao)}
                colClass="col-6"
              />
              
              <StatCard
                icon="bi-shield-check"
                iconColor="text-success"
                bgColor="bg-success"
                label="Status"
                value={getUserStatus(user).text}
                valueColor={getUserStatus(user).color}
                colClass="col-6"
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="modern-card card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="mb-3 fw-bold">
                  <i className="bi bi-lightning text-warning me-2"></i>
                  Ações Rápidas
                </h6>
                
                <div className="d-grid gap-3">
                  <AccountActionButton
                    gradient="linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)"
                    icon="bi-pencil"
                    title="Editar Perfil"
                    subtitle="Atualizar informações pessoais"
                    onClick={handleEditProfile}
                  />
                  
                  <AccountActionButton
                    gradient="linear-gradient(135deg, #ff4757 0%, #c44569 100%)"
                    icon="bi-box-arrow-right"
                    title="Sair da Conta"
                    subtitle="Encerrar sessão atual"
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-muted py-3">
          <small>
            <i className="bi bi-shield-lock me-1"></i>
            Suas informações estão protegidas e seguras.
          </small>
        </div>
      </div>
    </div>
  );
};

AccountPage.propTypes = {
  isDark: PropTypes.bool.isRequired,
  setIsDark: PropTypes.func.isRequired
};

export default AccountPage;
