import React from 'react';
import { useSettingsPage } from '../hooks';
import { 
  SettingsHeader,
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
  DataActionsSettings,
  DevActionsSettings,
  FormActionButtons
} from '../components';

const SettingsPage = () => {
  const {
    notifications,
    privacy,
    appearance,
    loading,
    error,
    handleNotificationChange,
    handlePrivacyChange,
    handleAppearanceChange,
    handleExportData,
    handleDeleteAccount,
    handleResetSettings,
    handleInsertTestUser,
    handleLogin,
    handleLogout,
    handleGetRoute,
    handleGetStops
  } = useSettingsPage();

  if (loading) {
    return (
      <div className="account-page p-0">
        <div className="container-fluid px-3 py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3 text-muted">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-page p-0">
        <SettingsHeader />
        <div className="container-fluid px-3">
          <div className="modern-card card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="alert alert-danger mb-3" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
              <FormActionButtons
                onClick={() => window.location.reload()}
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
      <SettingsHeader />
      
      <div className="container-fluid px-3">
        {/* Settings Sections */}
        <div className="row g-3 mb-4">
          {/* Notifications */}
          <div className="col-12 col-lg-6">
            <NotificationSettings
              notifications={notifications}
              onNotificationChange={handleNotificationChange}
            />
          </div>

          {/* Privacy */}
          <div className="col-12 col-lg-6">
            <PrivacySettings
              privacy={privacy}
              onPrivacyChange={handlePrivacyChange}
            />
          </div>

          {/* Appearance */}
          <div className="col-12 col-lg-6">
            <AppearanceSettings
              appearance={appearance}
              onAppearanceChange={handleAppearanceChange}
            />
          </div>

          {/* Data Actions */}
          <div className="col-12 col-lg-6">
            <DataActionsSettings
              onExportData={handleExportData}
              onDeleteAccount={handleDeleteAccount}
              onResetSettings={handleResetSettings}
              loading={loading}
            />
          </div>

          {/* Dev Actions */}
          <div className="col-12">
            <DevActionsSettings
              onInsertTestUser={handleInsertTestUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onGetRoute={handleGetRoute}
              onGetStops={handleGetStops}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted py-3">
          <small>
            <i className="bi bi-gear me-1"></i>
            Suas preferências são salvas automaticamente.
          </small>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
