import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import PopUpComponent from "../components/ui/PopUpComponent";
import {validateEmail} from "@shared/validators";

function Login({pageFunctions}){
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const popUpRef = useRef(null); 

  useEffect(() => {
    pageFunctions.set("login",false,false);
  }, [pageFunctions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      return popUpRef.current.show({
        content: () => "Por favor, preencha todos os campos.",
        title: "Campos Obrigatórios",
      });
    }
    if (!validateEmail(email)) {
      return popUpRef.current.show({
        content: () => "Email inválido. Por favor, insira um email válido.",
        title: "Email Inválido",
      });
    }

    try {
      const response = await api.auth.login(email, password);
      if (response) {
        const token = response.token;
        const user = response.user;
        localStorage.setItem("token", token);
        login(user); 
        navigate("/"); 
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      popUpRef.current.show({
        content: () => "Erro ao fazer login. Verifique suas credenciais.",
        title: "Erro de Login",
      });
    }

  }

    return (
    <div className="login-form d-flex justify-content-center align-items-center min-vh-100 bg-success bg-gradient">
      <div className="bg-dark text-white p-5 shadow" style={{ width: "100%", maxWidth: "400px", borderRadius: '15px'}}>
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span className="text-success">BusHere!</span>
        </h1>

        <p className="text-secondary">
          O login é admin@admin.com / admin
        </p>
        <form className="mt-4" method="GET" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Insira o Email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Insira a senha"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" role="switch" id="rememberMe"/>
              <label className="form-check-label" htmlFor="rememberMe">
                Lembrar de mim
              </label>
            </div>
            <a href="#" className="text-white text-decoration-underline small">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            Entrar
          </button>

          <div className="text-center mt-3">
            <a href="/register" className="text-white text-decoration-underline small">
              Não Possui Cadastro?
            </a>
          </div>
        </form>
      </div>
      <PopUpComponent ref={popUpRef} />
    </div>
    )
}

export default Login