import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
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
