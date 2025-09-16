import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, InfoCard, ActionButton } from '../components/common';
import api from "../api/api";

const AccountPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-12">
          <PageHeader 
            icon="bi-person" 
            title="Minha Conta" 
          />
          
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person text-white" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-1 fw-bold">{user?.nome_completo || 'Usuário'}</h5>
                  <p className="text-muted mb-0 small">{user?.email}</p>
                </div>
              </div>
              
              <div className="row g-3">
                <div className="col-12">
                  <InfoCard
                    header={{ icon: 'bi-info-circle', title: 'Informações Pessoais' }}
                    variant="light"
                  >
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted d-block">Nome</small>
                        <span className="fw-medium">{user?.nome_completo || 'Não informado'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Email</small>
                        <span className="fw-medium">{user?.email || 'Não informado'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">CPF</small>
                        <span className="fw-medium">{user?.cpf || 'Não informado'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Telefone</small>
                        <span className="fw-medium">{user?.telefone || 'Não informado'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Cidade</small>
                        <span className="fw-medium">{user?.cidade || 'Não informado'}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">UF</small>
                        <span className="fw-medium">{user?.uf || 'Não informado'}</span>
                      </div>
                    </div>
                  </InfoCard>
                </div>
                
                <div className="col-12">
                  <InfoCard
                    header={{ icon: 'bi-gear', title: 'Ações' }}
                    variant="light"
                  >
                    <div className="d-grid gap-2">
                      <ActionButton 
                        icon="bi-pencil"
                        variant="outline-primary"
                        fullWidth
                      >
                        Editar Perfil
                      </ActionButton>
                      <ActionButton 
                        icon="bi-box-arrow-right"
                        variant="outline-danger"
                        fullWidth
                        onClick={logout}
                      >
                        Sair da Conta
                      </ActionButton>
                    </div>
                  </InfoCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
