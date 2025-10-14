import { useState, useCallback } from 'react';
import api from '../../api/api';

export const useSettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    profileVisibility: 'public',
    dataAnalytics: false
  });

  const [appearance, setAppearance] = useState({
    fontSize: 'medium',
    language: 'pt-BR'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Notification handlers
  const handleNotificationChange = useCallback((type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  // Privacy handlers
  const handlePrivacyChange = useCallback((setting, value) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  // Appearance handlers
  const handleAppearanceChange = useCallback((setting, value) => {
    setAppearance(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  // Test/Dev functions
  const gerarCpf = () => {
    function calcDV(nums) {
      let x = 0;
      for (let i = nums.length + 1, j = 0; i >= 2; i--, j++) x += +nums[j] * i;
      const y = x % 11;
      return y < 2 ? 0 : 11 - y;
    }
    const nums = Array.from({length: 9}, () => Math.floor(Math.random() * 10));
    const d1 = calcDV(nums);
    const d2 = calcDV([...nums, d1]);
    return [...nums, d1, d2].join("");
  };

  const handleInsertTestUser = useCallback(async () => {
    const email = prompt("Digite o email do usuário de teste:");
    if (!email) return;
    
    const password = prompt("Digite a senha do usuário de teste:");
    if (!password) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.auth.register({
        name: "Test User",
        email: email,
        password: password,
        cpf: gerarCpf(),
        address: {
          street: "Test Street",
          number: "123",
          complement: "Apt 1",
          neighborhood: "Test Neighborhood",
          city: "Test City",
          state: "Test State",
          zip: "12345-678"
        }
      });
      
      alert("Usuário de teste inserido com sucesso!:\n" + response.user.email);
      console.log("✅ Usuário de teste inserido com sucesso:", response);
    } catch (error) {
      console.error("❌ Erro ao inserir usuário de teste:", error);
      alert("Usuario não inserido");
      setError("Erro ao inserir usuário de teste");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    const email = prompt("Digite o email do usuário:");
    if (!email) return;
    
    const password = prompt("Digite a senha do usuário:");
    if (!password) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.auth.login({ email, password });
      localStorage.setItem("token", response.token);
      
      alert("Login realizado com sucesso! Token salvo.");
      console.log("✅ Login realizado com sucesso:", response);
    } catch (error) {
      console.error("❌ Erro ao realizar login:", error);
      alert("Erro ao realizar login");
      setError("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      api.auth.logout();
      alert("Logout realizado com sucesso!");
      console.log("✅ Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao realizar logout:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetRoute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.routes.get();
      alert("Rotas obtidas com sucesso! Veja o console para detalhes.");
      console.log("✅ Rotas obtidas com sucesso:", response);
    } catch (error) {
      console.error("❌ Erro ao obter rotas:", error);
      alert("Erro ao obter rotas");
      setError("Erro ao obter rotas");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetStops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.stops.getAll();
      alert("Paradas obtidas com sucesso! Veja o console para detalhes.");
      console.log("✅ Paradas obtidas com sucesso:", response);
    } catch (error) {
      console.error("❌ Erro ao obter paradas:", error);
      alert("Erro ao obter paradas");
      setError("Erro ao obter paradas");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExportData = useCallback(() => {
    alert("Funcionalidade de exportação de dados em desenvolvimento");
    console.log("📊 Exportar dados");
  }, []);

  const handleDeleteAccount = useCallback(() => {
    const confirmed = confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    if (confirmed) {
      alert("Funcionalidade de exclusão de conta em desenvolvimento");
      console.log("🗑️ Excluir conta");
    }
  }, []);

  const handleResetSettings = useCallback(() => {
    const confirmed = confirm("Tem certeza que deseja resetar as configurações?");
    if (confirmed) {
      setNotifications({
        email: true,
        push: true,
        sms: false
      });
      setPrivacy({
        locationSharing: true,
        profileVisibility: 'public',
        dataAnalytics: false
      });
      setAppearance({
        fontSize: 'medium',
        language: 'pt-BR'
      });
      alert("Configurações resetadas com sucesso!");
      console.log("🔄 Configurações resetadas");
    }
  }, []);

  return {
    // State
    notifications,
    privacy,
    appearance,
    loading,
    error,
    
    // Handlers
    handleNotificationChange,
    handlePrivacyChange,
    handleAppearanceChange,
    
    // Actions
    handleExportData,
    handleDeleteAccount,
    handleResetSettings,
    
    // Dev/Test actions
    handleInsertTestUser,
    handleLogin,
    handleLogout,
    handleGetRoute,
    handleGetStops
  };
};
