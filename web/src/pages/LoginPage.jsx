import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import PopUpComponent from "../components/core/feedback/PopUpComponent";
import { useLoginForm } from "../hooks/data/useLoginForm";

function Login({pageFunctions}){
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const popUpRef = useRef(null); 
  const {
    showPassword,
    isSubmitting,
    errors,
    setShowPassword,
    setIsSubmitting,
    handleBlur,
    validateForm,
  } = useLoginForm();

  useEffect(() => {
    pageFunctions.set("login",false,false);
  }, [pageFunctions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const formErrors = validateForm(email, password);
    if (Object.keys(formErrors).length > 0) {
      if (formErrors.general) {
        return popUpRef.current.show({
          content: () => formErrors.general,
          title: "Campos Obrigatórios",
        });
      }
      if (formErrors.email) {
        return popUpRef.current.show({
          content: () => formErrors.email,
          title: "Email Inválido",
        });
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.auth.login(email, password);
      if (response) {
        const token = response.token;
        const user = response.user;
        localStorage.setItem("token", token);
        login(user); 
        
        // Redireciona para a página de onde veio ou para home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      popUpRef.current.show({
        content: () => "Erro ao fazer login. Verifique suas credenciais.",
        title: "Erro de Login",
      });
    } finally {
      setIsSubmitting(false);
    }

  }

    return (
    <div className="login-form d-flex justify-content-center align-items-center min-vh-100 bg-success bg-gradient">
      <div className="bg-medium p-5 shadow" style={{ width: "100%", maxWidth: "450px", borderRadius: '15px'}}>
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span className="text-success">BusHere!</span>
        </h1>

        <p className="text-secondary">
          O login é admin@admin.com / admin
        </p>
        <form className="mt-4" method="POST" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <div className={`input-group ${errors.email ? 'is-invalid' : ''}`}>
              <span className="input-group-text bg-transparent"><i className="bi bi-envelope"></i></span>
              <input type="email" id="email" name="email" className="form-control" placeholder="nome@dominio.com" autoComplete="email" onBlur={handleBlur} required />
            </div>
            {errors.email && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.email}</div>}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label">Senha</label>
            <div className={`input-group ${errors.password ? 'is-invalid' : ''}`}>
              <span className="input-group-text bg-transparent"><i className="bi bi-lock"></i></span>
              <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-control" placeholder="Insira a sua senha" autoComplete="current-password" onBlur={handleBlur} required />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              ><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.password}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" role="switch" id="rememberMe" />
              <label className="form-check-label ms-2" htmlFor="rememberMe">Lembrar de mim</label>
            </div>
            <a href="#" className="text-decoration-underline small">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold mt-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="text-center mt-2">
            <a href="/register" className=" text-decoration-underline small">Não Possui Cadastro?</a>
          </div>
        </form>
      </div>
      <PopUpComponent ref={popUpRef} />
    </div>
    )
}

export default Login