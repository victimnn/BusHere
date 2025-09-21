import React from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function InstallButton({ className = '', variant = 'primary', size = 'sm' }) {
  const { showInstallButton, installApp, isInstalled } = useInstallPrompt();

  // Não renderizar se não deve mostrar o botão ou se já estiver instalado
  if (!showInstallButton || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      // Mostrar feedback positivo
      console.log('App instalado com sucesso!');
    }
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={handleInstall}
      title="Instalar BusHere! no seu dispositivo"
    >
      <i className="bi bi-download me-2"></i>
      Instalar App
    </button>
  );
}