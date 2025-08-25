
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import ThemeSwitch from "./components/ThemeSwitch";

// Importe os componentes necessários
import HomePage from "./pages/HomePage";
// Adicione outros imports de páginas conforme forem criadas

function App({ isDark, setIsDark }) {
  return (
    <Router>
      <main className="d-flex w-100 h-100 flex-column">
        <Routes>
          <Route path="/" index element={<HomePage />} />
          {/* Adicione outras rotas conforme necessário */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
