import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      if (window.navigator && window.navigator.standalone) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Se já estiver instalado, não mostrar o botão
    if (checkIfInstalled()) {
      return;
    }

    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event captured');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listener para quando o app for instalado
    const handleAppInstalled = () => {
      console.log('PWA: App foi instalado');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.warn('PWA: Nenhum prompt de instalação disponível');
      return false;
    }

    try {
      console.log('PWA: Mostrando prompt de instalação');
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA: Erro ao mostrar prompt de instalação:', error);
      return false;
    }
  };

  return {
    showInstallButton,
    installApp,
    isInstalled
  };
}