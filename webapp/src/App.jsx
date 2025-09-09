import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import { AuthProvider } from "./context/AuthContext";

// Importe os componentes necessários
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import NoticesPage from "./pages/NoticesPage";
import BillsPage from "./pages/BillsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import LoginPage from "./pages/LoginPage";

function App({ isDark, setIsDark }) {
  return (
    <AuthProvider>
      <Router>
        <main className="d-flex w-100 h-100 flex-column">
          <Routes>
            <Route path="/" index element={<HomePage isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/conta" element={<AccountPage />} />
            <Route path="/avisos" element={<NoticesPage />} />
            <Route path="/boletos" element={<BillsPage />} />
            <Route path="/ajustes" element={<SettingsPage />} />
            <Route path="/ajuda" element={<HelpPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Adicione outras rotas conforme necessário */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
