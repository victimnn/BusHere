import { useRef, useEffect, useState } from "react";
import PopUpComponent from "../components/PopUpComponent";
import { useAuth } from "../context/authContext";
import api from "../api/api";

function Settings({ pageFunctions }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const popUpRef = useRef(null);

  useEffect(() => {
    pageFunctions.set("Configurações", true, true);
  }, [pageFunctions]);

  const handleButtonClickForTests = async () => {
    const response = await api.auth.login("admin@admin", "admin");

    if (response) {
      const { token, message, user } = response;
      localStorage.setItem("token", token);
      login(user);
      popUpRef.current.show({
        content: () => message || "Login realizado com sucesso!",
        title: "Login feito com sucesso",
      });
    }
  };

  // Configurações com valores alternáveis
  const [settings, setSettings] = useState([
    { id: 1, name: "Notificações", value: "Ativado" },
    { id: 2, name: "Modo escuro", value: "Desativado" },
    { id: 3, name: "Atualizações", value: "Automático" },
  ]);

  const options = {
    "Notificações": ["Desativado", "Ativado"],
    "Modo escuro": ["Desativado", "Ativado"],
    "Atualizações": ["Manual", "Automático"],
  };

  const changeValue = (id, direction) => {
    const updated = settings.map(setting => {
      if (setting.id === id) {
        const list = options[setting.name];
        let index = list.indexOf(setting.value);
        index = direction === "left" ? (index - 1 + list.length) % list.length : (index + 1) % list.length;
        return { ...setting, value: list[index] };
      }
      return setting;
    });
    setSettings(updated);
  };

  return (
    <main className="ps-3 pe-3 pt-3">

      <div className="card p-3 mb-4">
        {settings.map(setting => (
          <div key={setting.id} className="d-flex align-items-center justify-content-between border-bottom py-2">
            <strong>{setting.name}</strong>
            <div className="d-flex align-items-center gap-2">
              <button onClick={() => changeValue(setting.id, "left")} className="btn btn-sm btn-outline-secondary">
                ◀
              </button>
              <span style={{ width: "100px", textAlign: "center" }}>{setting.value}</span>
              <button onClick={() => changeValue(setting.id, "right")} className="btn btn-sm btn-outline-secondary">
                ▶
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Settings;




  /* page antiga
    <main>
      <h1>Configuracoes</h1> 

      <button
        onClick={handleButtonClickForTests}
        className="btn btn-primary"
      >
        Fazer login
      </button>
        
      {/* texto com a cor secundaria }
      <p className="text-secondary">Texto com a cor secundaria</p> 

      {/* por enquanto printa o .env inteiro }
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>

      {/* por enquanto printa o .env inteiro }
      <pre>{JSON.stringify(user, null, 2)}</pre>


      {/* Componente PopUpComponent }

      
      />
    </main>
    */