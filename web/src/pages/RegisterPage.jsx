import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PopUpComponent from "../components/core/feedback/PopUpComponent";
import useRegisterForm from "../hooks/data/useRegisterForm";

function Register({ pageFunctions }) {
  const navigate = useNavigate();
  const popUpRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    errors,
    isSubmitting,
    handleBlur,
    handlePhoneInput,
    handlePhoneKeyPress,
    handlePhoneBlur,
    handleSubmit,
    resetForm
  } = useRegisterForm();

  useEffect(() => {
    pageFunctions.set("register", false, false);
    return () => resetForm();
  }, [pageFunctions]); // Removido resetForm das dependências

  const onSubmit = async (formData) => {
    try {
      await api.auth.register({
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone || null,
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
      throw error; // Re-throw para o hook tratar
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nome: event.target.nome?.value?.trim(),
      email: event.target.email?.value?.trim(),
      password: event.target.password?.value,
      confirm_password: event.target.confirm_password?.value,
      telefone: event.target.telefone?.value?.trim(),
    };

    const success = await handleSubmit(formData, onSubmit);
    if (!success) {
      // Se a validação falhou, os erros já foram definidos pelo hook
      return;
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

        <form className="mt-4" method="POST" onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="nome" className="form-label">Nome Completo</label>
              <div className={`input-group ${errors.nome ? 'is-invalid' : ''}`}>
                <span className="input-group-text bg-transparent"><i className="bi bi-person"></i></span>
                <input type="text" id="nome" name="nome" className="form-control" placeholder="Seu nome completo" autoComplete="name" onBlur={handleBlur} required />
              </div>
              {errors.nome && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.nome}</div>}
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className={`input-group ${errors.email ? 'is-invalid' : ''}`}>
                <span className="input-group-text bg-transparent"><i className="bi bi-envelope"></i></span>
                <input type="email" id="email" name="email" className="form-control" placeholder="nome@dominio.com" autoComplete="email" onBlur={handleBlur} required />
              </div>
              {errors.email && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.email}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className={`input-group ${errors.password ? 'is-invalid' : ''}`}>
                <span className="input-group-text bg-transparent"><i className="bi bi-lock"></i></span>
                <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-control" placeholder="Crie uma senha" autoComplete="new-password" onBlur={handleBlur} minLength={6} required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.password}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="confirm_password" className="form-label">Confirmar Senha</label>
              <div className={`input-group ${errors.confirm_password ? 'is-invalid' : ''}`}>
                <span className="input-group-text bg-transparent"><i className="bi bi-lock"></i></span>
                <input type={showConfirmPassword ? "text" : "password"} id="confirm_password" name="confirm_password" className="form-control" placeholder="Repita a senha" autoComplete="new-password" onBlur={handleBlur} required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}>
                  <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.confirm_password && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.confirm_password}</div>}
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="telefone" className="form-label">Telefone (Opcional)</label>
              <div className={`input-group ${errors.telefone ? 'is-invalid' : ''}`}>
                <span className="input-group-text bg-transparent"><i className="bi bi-telephone"></i></span>
                <input type="tel" id="telefone" name="telefone" className="form-control" placeholder="(00) 00000-0000" autoComplete="tel" onInput={handlePhoneInput} onKeyDown={handlePhoneKeyPress} onBlur={handlePhoneBlur} maxLength={15} inputMode="tel" />
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