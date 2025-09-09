import React, { useState } from 'react';
import { PageHeader, InfoCard, ActionButton } from '../components/common';

const SettingsPage = () => {
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
