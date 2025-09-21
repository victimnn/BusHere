import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import { AuthProvider } from "./context/AuthContext";

// Importe os componentes necessários
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import NoticesPage from "./pages/NoticesPage";
import BillsPage from "./pages/BillsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App({ isDark, setIsDark }) {
  return (
    <AuthProvider>
      <Router>
        <main className="d-flex w-100 h-100 flex-column">
          <Routes>
            {/* Páginas com Layout (sidebar + floating button) */}
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
            
            {/* Páginas sem Layout (login/register não precisam de sidebar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Adicione outras rotas conforme necessário */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
