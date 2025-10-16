import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importa ambos os temas como arquivos CSS
import './Light.scss';
import './Dark.scss';
// Registro do Service Worker e permissão de notificações

// VAPID public key (must match server and be base64, not URL-safe)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BBxDYc-ifzPZj4x3NJSrVZsyQ2bSFOkUirNM2ZN5rXrooblIV9otm_eA7xh46gh--pVySeDZPrGCJ8S7K5IQILE';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


async function subscribeUserToPush(registration, user) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permissão de notificação negada');
      return;
    }
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    // Adiciona o id_passageiro à subscription
    const subscriptionWithId = {
      ...subscription,
      id_passageiro: user?.passageiro_id
    };
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    await fetch(`${apiBaseUrl}/api/passenger/push-subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionWithId),
    });
    console.log('Push subscription enviada ao servidor:', subscriptionWithId);
  } catch (err) {
    console.error('Erro ao subscrever push:', err);
  }
}


function usePushSubscription(user, isAuthenticated) {
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Service Worker registrado:', reg);
          subscribeUserToPush(reg, user);
        })
        .catch(err => {
          console.error('Erro ao registrar Service Worker:', err);
        });
    }
  }, [user, isAuthenticated]);
}

function Main() {
  // Adiciona overscroll-behavior via CSS para bloquear pull-to-refresh
  useEffect(() => {
    document.body.style.overscrollBehavior = 'contain';
    return () => {
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  // Estado do tema escuro sincronizado com localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false; // padrão: claro quando não houver preferência
  });

  // Bloqueia o gesto de pull-to-refresh em mobile
  useEffect(() => {
    let maybePreventPullToRefresh = (e) => {
      if (window.scrollY === 0 && e.touches && e.touches[0].clientY > 0) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', maybePreventPullToRefresh, { passive: false });
    return () => {
      document.removeEventListener('touchmove', maybePreventPullToRefresh);
    };
  }, []);

  useEffect(() => {
    // Ativa/desativa os estilos dos temas via manipulação de <style> injetados pelo Vite
    // Seleciona os estilos injetados pelo Vite para cada tema
    const styleLight = document.querySelector('style[data-vite-dev-id*="Light.scss"]');
    const styleDark = document.querySelector('style[data-vite-dev-id*="Dark.scss"]');

    if (styleLight && styleDark) {
      if (isDark) {
        styleLight.disabled = true;
        styleDark.disabled = false;
      } else {
        styleLight.disabled = false;
        styleDark.disabled = true;
      }
    }
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);
