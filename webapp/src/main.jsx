import { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importa ambos os temas como arquivos CSS
import './Light.scss';
import './Dark.scss';

function Main() {
  // Estado do tema escuro sincronizado com localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false; // padrão: claro quando não houver preferência
  });

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
