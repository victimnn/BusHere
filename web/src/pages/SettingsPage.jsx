import { useRef, useEffect } from "react";
import PopUpComponent from "../components/PopUpComponent";
import { useAuth } from "../context/authContext";
import api from "../api/api";

function Settings({ pageFunctions }) {
  const { user, login, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    pageFunctions.set("Configurações", true, true);
  }, [pageFunctions]);
  const popUpRef = useRef(null); // Referência para o componente PopUpComponent

  const handleButtonClickForTests = async () => {
    //const userData = await api.auth.me();
    //console.log("userData", userData);

    const response = await api.auth.login("admin@admin", "admin");


    if (response) {
      const {token, message, user} = response;
      console.log("Login response:", response);
      localStorage.setItem("token", token); // Armazena o token no localStorage
      login(user); // Chama a função de login do contexto
      popUpRef.current.show({
        content: () => message || "Login realizado com sucesso!",
        title: "Login feito com sucesso",
      });
    }

  }

  return (
    <main>
      <h1>Configuracoes</h1> 

      <button
        onClick={handleButtonClickForTests}
        className="btn btn-primary"
      >
        Fazer login
      </button>
        
      {/* texto com a cor secundaria */}
      <p className="text-secondary">Texto com a cor secundaria</p> 

      {/* por enquanto printa o .env inteiro */}
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>

      {/* por enquanto printa o .env inteiro */}
      <pre>{JSON.stringify(user, null, 2)}</pre>


      {/* Componente PopUpComponent */}

      <PopUpComponent 
        ref={popUpRef}
      />
    </main>
  )
}

export default Settings