import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, InfoCard, ActionButton } from '../components/common';
import api from "../api/api";

function gerarCpf() {
  // Função para gerar dígito verificador
  function calcDV(nums) {
    let x = 0;
    for (let i = nums.length + 1, j = 0; i >= 2; i--, j++) x += +nums[j] * i;
    const y = x % 11;
    return y < 2 ? 0 : 11 - y;
  }
  // Gera 9 dígitos aleatórios
  const nums = Array.from({length: 9}, () => Math.floor(Math.random() * 10));
  const d1 = calcDV(nums);
  const d2 = calcDV([...nums, d1]);
  return [...nums, d1, d2].join("");
}


const AccountPage = () => {
  async function handleInsertTestUser() {
    try {
      const response = await api.auth.register({
        name: "Test User",
        email: Math.random().toFixed(3) + "@example.com",
        password: "password",
        cpf: gerarCpf(),
        address: {
          street: "Test Street",
          number: "123",
          complement: "Apt 1",
          neighborhood: "Test Neighborhood",
          city: "Test City",
          state: "Test State",
          zip: "12345-678"
        }
      });
      alert("Usuário de teste inserido com sucesso!:\n" + response.user.email+"/password");
      console.log("Usuário de teste inserido com sucesso:", response);
    } catch (error) {
      alert("Usuario não inserido");
      console.error("Erro ao inserir usuário de teste:", error);
    }
  }

  async function handleLoginUser() {
    const email = prompt("Digite o email do usuario");
    const password = "password";

    try {
      const response = await api.auth.login({
        email,
        password
      });
      alert("Login realizado com sucesso!");
      console.log("Login realizado com sucesso:", response);
    } catch (error) {
      alert("Erro ao realizar login");
      console.error("Erro ao realizar login:", error);
    }
  }

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
                  <h5 className="mb-1 fw-bold">{user?.name}</h5>
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
                        <span className="fw-medium">{user?.name}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Email</small>
                        <span className="fw-medium">{user?.email}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">ID</small>
                        <span className="fw-medium">{user?.id}</span>
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
                      <ActionButton 
                        icon="bi-person-plus"
                        variant="outline-secondary"
                        fullWidth
                        onClick={handleInsertTestUser}
                      >
                        Inserir Usuario de teste
                      </ActionButton>
                      <ActionButton 
                        icon="bi-person"
                        variant="outline-secondary"
                        fullWidth
                        onClick={handleLoginUser}
                      >
                        Logar em usuario
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
