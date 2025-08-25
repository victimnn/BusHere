import { useState, useEffect } from 'react';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './Light.scss';
import './Dark.scss';

function Main() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const styleLight = document.querySelector('style[data-vite-dev-id*="Light.scss"]');
    const styleDark = document.querySelector('style[data-vite-dev-id*="Dark.scss"]');
    if (isDark) {
      styleLight.disabled = true;
      styleDark.disabled = false;
    } else {
      styleLight.disabled = false;
      styleDark.disabled = true;
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <StrictMode>
      <App isDark={isDark} setIsDark={setIsDark} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);
