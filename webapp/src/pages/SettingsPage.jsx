import React, { useState } from 'react';
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

const SettingsPage = () => {
  async function handleInsertTestUser() {
    const email = prompt("Digite o email do usuário de teste:");
    const password = prompt("Digite a senha do usuário de teste:");
    try {
      const response = await api.auth.register({
        name: "Test User",
        email: email,
        password: password,
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

  async function handleLogin(){
    const email = prompt("Digite o email do usuário de teste:");
    const password = prompt("Digite a senha do usuário de teste:");
    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem("token", response.token);
      alert("Login realizado com sucesso! Token:\n" + response.token);
      console.log("Login realizado com sucesso:", response);
    } catch (error) {
      alert("Erro ao realizar login");
      console.error("Erro ao realizar login:", error);
    }
  }

  async function handleLogout(){
    api.auth.logout();
    alert("Logout realizado com sucesso!");
  }

  async function handleGetRoute(){
    try {
      const response = await api.routes.get();
      alert("Rotas obtidas com sucesso! Veja o console para detalhes.");
      console.log("Rotas obtidas com sucesso:", response);
    } catch (error) {
      alert("Erro ao obter rotas");
      console.error("Erro ao obter rotas:", error);
    }
  }

  async function handleGetStops(){
    try {
      const response = await api.stops.getAll();
      alert("Paradas obtidas com sucesso! Veja o console para detalhes.");
      console.log("Paradas obtidas com sucesso:", response);
    } catch (error) {
      alert("Erro ao obter paradas");
      console.error("Erro ao obter paradas:", error);
    }
  }

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    profileVisibility: 'public',
    dataAnalytics: false
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-12">
          <PageHeader 
            icon="bi-gear" 
            title="Configurações" 
          />
          
          <div className="row g-3">
            {/* Notificações */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-bell', title: 'Notificações' }}
                variant="light"
              >
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Notificações por Email
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pushNotifications"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  <label className="form-check-label" htmlFor="pushNotifications">
                    Notificações Push
                  </label>
                </div>
                
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="smsNotifications"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                  <label className="form-check-label" htmlFor="smsNotifications">
                    Notificações por SMS
                  </label>
                </div>
              </InfoCard>
            </div>
            
            {/* Privacidade */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-shield-lock', title: 'Privacidade' }}
                variant="light"
              >
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="locationSharing"
                    checked={privacy.locationSharing}
                    onChange={() => handlePrivacyChange('locationSharing', !privacy.locationSharing)}
                  />
                  <label className="form-check-label" htmlFor="locationSharing">
                    Compartilhar Localização
                  </label>
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-medium">Visibilidade do Perfil</label>
                  <select
                    className="form-select form-select-sm"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Público</option>
                    <option value="friends">Apenas Amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>
                
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="dataAnalytics"
                    checked={privacy.dataAnalytics}
                    onChange={() => handlePrivacyChange('dataAnalytics', !privacy.dataAnalytics)}
                  />
                  <label className="form-check-label" htmlFor="dataAnalytics">
                    Compartilhar Dados para Análise
                  </label>
                </div>
              </InfoCard>
            </div>
            
            {/* Aparência */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-display', title: 'Aparência' }}
                variant="light"
              >
                <div className="mb-3">
                  <label className="form-label small fw-medium">Tamanho da Fonte</label>
                  <select className="form-select form-select-sm">
                    <option>Pequeno</option>
                    <option selected>Médio</option>
                    <option>Grande</option>
                  </select>
                </div>
                
                <div className="mb-0">
                  <label className="form-label small fw-medium">Idioma</label>
                  <select className="form-select form-select-sm">
                    <option selected>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
              </InfoCard>
            </div>
            
            {/* Dados */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-download', title: 'Dados' }}
                variant="light"
              >
                <div className="d-grid gap-2">
                  <ActionButton 
                    icon="bi-download"
                    variant="outline-primary"
                    size="sm"
                    fullWidth
                  >
                    Exportar Dados
                  </ActionButton>
                  <ActionButton 
                    icon="bi-trash"
                    variant="outline-danger"
                    size="sm"
                    fullWidth
                  >
                    Excluir Conta
                  </ActionButton>
                  <ActionButton 
                    icon="bi-arrow-clockwise"
                    variant="outline-warning"
                    size="sm"
                    fullWidth
                  >
                    Resetar Configurações
                  </ActionButton>

                  <ActionButton 
                    icon="bi-arrow-clockwise"
                    variant="outline-warning"
                    size="sm"
                    fullWidth
                    onClick={handleInsertTestUser}
                  >
                    registrar
                  </ActionButton>

                  <ActionButton
                    icon="bi-box-arrow-in-left"
                    variant="outline-success"
                    size="sm"
                    fullWidth
                    onClick={handleLogin}
                  >
                    login
                  </ActionButton>


                  <ActionButton
                    icon="bi-box-arrow-right"
                    variant="outline-danger"
                    size="sm"
                    fullWidth
                    onClick={handleLogout}
                  >
                    logout
                  </ActionButton>

                  <ActionButton
                    icon="bi-sign-turn-right"
                    variant="outline-secondary"
                    size="sm"
                    fullWidth
                    onClick={handleGetRoute}
                  >
                    rota 
                  </ActionButton>

                  <ActionButton
                    icon="bi-sign-stop"
                    variant="outline-dark"
                    size="sm"
                    fullWidth
                    onClick={handleGetStops}
                  >
                    paradas
                  </ActionButton>

                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
