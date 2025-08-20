import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PopUpComponent from "../components/core/feedback/PopUpComponent";
import { validateEmail } from "@shared/validators";

function Register({ pageFunctions }) {
  const navigate = useNavigate();
  const popUpRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    pageFunctions.set("register", false, false);
  }, [pageFunctions]);

  const validateField = (name, value, otherValues = {}) => {
    const val = value?.trim?.() ?? value;
    switch (name) {
      case 'nome':
        return val ? '' : 'Informe seu nome completo';
      case 'email':
        return validateEmail(val) ? '' : 'Email inválido';
      case 'password':
        return val && val.length >= 6 ? '' : 'Mínimo de 6 caracteres';
      case 'confirm_password':
        return val === otherValues.password ? '' : 'As senhas não conferem';
      case 'telefone':
        return val ? '' : 'Informe um telefone válido';
      default:
        return '';
    }
  };

  const handleBlur = (event) => {
    const { name, value, form } = event.target;
    const fieldError = validateField(name, value, { password: form?.password?.value });
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nome = event.target.nome?.value?.trim();
    const login_usuario = event.target.login_usuario?.value?.trim();
    const email = event.target.email?.value?.trim();
    const password = event.target.password?.value;
    const confirm_password = event.target.confirm_password?.value;
    const telefone = event.target.telefone?.value?.trim();

    if (!nome || !email || !password || !confirm_password) {
      return popUpRef.current.show({
        content: () => "Por favor, preencha todos os campos obrigatórios.",
        title: "Campos Obrigatórios",
      });
    }

    if (!validateEmail(email)) {
      return popUpRef.current.show({
        content: () => "Email inválido. Por favor, insira um email válido.",
        title: "Email Inválido",
      });
    }

    // Validação de senha
    if (password.length < 6) {
      return popUpRef.current.show({
        content: () => "A senha deve ter pelo menos 6 caracteres.",
        title: "Senha inválida",
      });
    }
    if (password !== confirm_password) {
      return popUpRef.current.show({
        content: () => "As senhas não conferem.",
        title: "Confirmação de senha",
      });
    }

    try {
      setIsSubmitting(true);
      await api.auth.register({
        nome,
        email,
        password,
        telefone: telefone || null,
      });

      popUpRef.current.show({
        content: () => "Cadastro realizado com sucesso! Faça login para continuar.",
        title: "Sucesso",
      });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      popUpRef.current.show({
        content: () => (error?.data?.message || error?.message || "Erro ao realizar cadastro."),
        title: "Erro no Cadastro",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form d-flex justify-content-center align-items-center min-vh-100 bg-success bg-gradient">
      <div className="bg-medium p-5 shadow" style={{ width: "100%", maxWidth: "600px", borderRadius: "15px" }}>
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span className="text-success">BusHere!</span>
        </h1>

        <p className="text-secondary">Preencha seus dados para criar sua conta de usuário da empresa.</p>

        <form className="mt-4" method="POST" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="nome" className="form-label">Nome Completo</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.nome ? 'is-invalid' : ''}`}><i className="bi bi-person"></i></span>
                <input type="text" id="nome" name="nome" className={`form-control border-start-0 ${errors.nome ? 'is-invalid' : ''}`} placeholder="Seu nome completo" autoComplete="name" onBlur={handleBlur} required />
              </div>
              {errors.nome && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.nome}</div>}
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.email ? 'is-invalid' : ''}`}><i className="bi bi-envelope"></i></span>
                <input type="email" id="email" name="email" className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`} placeholder="nome@dominio.com" autoComplete="email" onBlur={handleBlur} required />
              </div>
              {errors.email && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.email}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.password ? 'is-invalid' : ''}`}><i className="bi bi-lock"></i></span>
                <input type={showPassword ? "text" : "password"} id="password" name="password" className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`} placeholder="Crie uma senha" autoComplete="new-password" onBlur={handleBlur} minLength={6} required />
                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.password}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="confirm_password" className="form-label">Confirmar Senha</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.confirm_password ? 'is-invalid' : ''}`}><i className="bi bi-lock"></i></span>
                <input type={showConfirmPassword ? "text" : "password"} id="confirm_password" name="confirm_password" className={`form-control border-start-0 ${errors.confirm_password ? 'is-invalid' : ''}`} placeholder="Repita a senha" autoComplete="new-password" onBlur={handleBlur} required />
                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}>
                  <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.confirm_password && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.confirm_password}</div>}
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="telefone" className="form-label">Telefone (Opcional)</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.telefone ? 'is-invalid' : ''}`}><i className="bi bi-telephone"></i></span>
                <input type="tel" id="telefone" name="telefone" className={`form-control border-start-0 ${errors.telefone ? 'is-invalid' : ''}`} placeholder="(00) 00000-0000" autoComplete="tel" onBlur={handleBlur} />
              </div>
              {errors.telefone && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.telefone}</div>}
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-success w-100 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </button>

              <div className="text-center mt-2">
                <a href="/login" className=" text-decoration-underline small">Já possui uma conta?</a>
              </div>
            </div>
          </div>
        </form>
      </div>
      <PopUpComponent ref={popUpRef} />
    </div>
  );
}

export default Register;