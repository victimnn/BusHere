
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';

// Importe os componentes necessários
import HomePage from "./pages/HomePage";
// Adicione outros imports de páginas conforme forem criadas

function App() {
  return (
    <Router>
      <div className="app-mobile-container">
        <main className="app-mobile-main">
          <Routes>
            <Route path="/" index element={<HomePage />} />

            {/* Adicione outras rotas conforme necessário */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
