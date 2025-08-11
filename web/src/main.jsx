
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importa ambos os temas como arquivos CSS
import '@web/Style.scss';
import '@web/Dark.scss';


function Main() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Ativa/desativa os estilos dos temas via manipulação de <style> injetados pelo Vite
    // Seleciona os estilos injetados pelo Vite para cada tema
    const styleLight = document.querySelector('style[data-vite-dev-id*="Style.scss"]');
    const styleDark = document.querySelector('style[data-vite-dev-id*="Dark.scss"]');

    if (isDark) {
      if (styleLight) styleLight.disabled = true;
      if (styleDark) styleDark.disabled = false;
    } else {
      if (styleLight) styleLight.disabled = false;
      if (styleDark) styleDark.disabled = true;
    }
  }, [isDark]);

  return (
    <StrictMode>
      <App isDark={isDark} setIsDark={setIsDark} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);