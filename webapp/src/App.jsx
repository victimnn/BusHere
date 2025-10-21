import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from "./context/AuthContext";

// Importe os componentes necessários
import { Layout } from "./components";
import { 
  HomePage, 
  AccountPage,
  EditProfilePage,
  NoticesPage, 
  BillsPage, 
  SettingsPage, 
  HelpPage, 
  LoginPage, 
  RegisterPage,
  InvitePage,
} from "./pages";

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
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BBxDYc-ifzPZj4x3NJSrVZsyQ2bSFOkUirNM2ZN5rXrooblIV9otm_eA7xh46gh--pVySeDZPrGCJ8S7K5IQILE';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    // Monta o objeto no formato esperado pelo backend
    const subscriptionWithId = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime || null,
      keys: {
        p256dh: subscription.keys?.p256dh || (subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))) : undefined),
        auth: subscription.keys?.auth || (subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))) : undefined)
      },
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

function App({ isDark, setIsDark }) {
  const { user, isAuthenticated } = useAuth();
  usePushSubscription(user, isAuthenticated);
  return (
    <Router>
      <main className="d-flex w-100 h-100 flex-column">
        <Routes>
          {/* Páginas sem Layout (login/register não precisam de sidebar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Rotas públicas */}
          <Route path="/" index element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <HomePage />
            </Layout>
          } />
          <Route path="/conta" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <AccountPage />
            </Layout>
          } />
          <Route path="/conta/editar" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <EditProfilePage />
            </Layout>
          } />
          <Route path="/avisos" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <NoticesPage />
            </Layout>
          } />
          <Route path="/boletos" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <BillsPage />
            </Layout>
          } />
          <Route path="/ajustes" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <SettingsPage />
            </Layout>
          } />
          <Route path="/ajuda" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <HelpPage />
            </Layout>
          } />
          <Route path="/convite/:code" element={
            <Layout isDark={isDark} setIsDark={setIsDark}>
              <InvitePage />
            </Layout>
          } />
          {/* Adicione outras rotas conforme necessário */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
