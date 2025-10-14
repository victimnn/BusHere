import { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importa ambos os temas como arquivos CSS
import './Light.scss';
import './Dark.scss';
// Registro do Service Worker e permissão de notificações
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service Worker registrado:', reg);
      })
      .catch(err => {
        console.error('Erro ao registrar Service Worker:', err);
      });
  });
}

if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida');
    } else {
      console.log('Permissão de notificação negada');
    }
  });
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
      <App isDark={isDark} setIsDark={setIsDark} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);
