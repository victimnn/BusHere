import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PopUpComponent from "../components/core/feedback/PopUpComponent";
import { validateEmail, validateCEP, validateCPF, validadeRawCPF } from "@shared/validators";
import { useRegisterForm } from "../hooks/useRegisterForm";

function Register({ pageFunctions }) {
  const navigate = useNavigate();
  const popUpRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    errors,
    addressStreet,
    addressCity,
    isCepLoading,
    setFieldError,
    setAddressStreet,
    setAddressCity,
    handleBlur,
    handleCpfInput,
    handleCepInput,
    handleCepBlur,
    handleOnlyNumberInput,
  } = useRegisterForm();

  useEffect(() => {
    pageFunctions.set("register", false, false);
  }, [pageFunctions]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const full_name = event.target.full_name?.value?.trim();
    const cpf = event.target.cpf?.value?.trim();
    const email = event.target.email?.value?.trim();
    const password = event.target.password?.value;
    const confirm_password = event.target.confirm_password?.value;
    const address_street = event.target.address_street?.value?.trim();
    const address_number = event.target.address_number?.value?.trim();
    const address_city = event.target.address_city?.value?.trim();
    const cep = event.target.cep?.value?.trim();

    if (!full_name || !cpf || !email || !password || !confirm_password || !address_street || !address_number || !address_city || !cep) {
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

    // Validação de CPF (aceita formatado e apenas números)
    const cpfOnly = (cpf || '').replace(/\D/g, '');
    if (!(validateCPF(cpf) || validadeRawCPF(cpfOnly))) {
      return popUpRef.current.show({
        content: () => "CPF inválido. Use o formato XXX.XXX.XXX-XX ou apenas números.",
        title: "CPF Inválido",
      });
    }

    // Validação de CEP (aceita com ou sem hífen)
    if (!validateCEP(cep)) {
      return popUpRef.current.show({
        content: () => "CEP inválido. Use o formato XXXXX-XXX ou apenas números.",
        title: "CEP Inválido",
      });
    }

    try {
      setIsSubmitting(true);
      await api.auth.register({
        full_name,
        cpf: cpfOnly,
        email,
        password,
        address_street,
        address_number,
        address_city,
        cep: cep.replace(/\D/g, ''),
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
      <div className="bg-medium p-5 shadow" style={{ width: "100%", maxWidth: "760px", borderRadius: "15px" }}>
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span className="text-success">BusHere!</span>
        </h1>

        <p className="text-secondary">Preencha seus dados para criar sua conta.</p>

        <form className="mt-4" method="POST" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="full_name" className="form-label">Nome Completo</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.full_name ? 'is-invalid' : ''}`}><i className="bi bi-person"></i></span>
                <input type="text" id="full_name" name="full_name" className={`form-control border-start-0 ${errors.full_name ? 'is-invalid' : ''}`} placeholder="Seu nome" autoComplete="name" onBlur={handleBlur} required />
              </div>
              {errors.full_name && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.full_name}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.cpf ? 'is-invalid' : ''}`}><i className="bi bi-credit-card-2-front"></i></span>
                <input type="text" id="cpf" name="cpf" className={`form-control border-start-0 ${errors.cpf ? 'is-invalid' : ''}`} placeholder="000.000.000-00" inputMode="numeric" autoComplete="off" onInput={handleCpfInput} onBlur={handleBlur} maxLength={14} required />
              </div>
              {errors.cpf && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.cpf}</div>}
            </div>

            <div className="col-12 col-md-6 mb-3">
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

            <div className="col-12 col-md-8 mb-3">
              <label htmlFor="address_street" className="form-label">Rua</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.address_street ? 'is-invalid' : ''}`}><i className="bi bi-geo-alt"></i></span>
                <input type="text" id="address_street" name="address_street" className={`form-control border-start-0 ${errors.address_street ? 'is-invalid' : ''}`} placeholder="Nome da rua" autoComplete="street-address" onBlur={handleBlur} value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} required />
              </div>
              {errors.address_street && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.address_street}</div>}
            </div>

            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="address_number" className="form-label">Número</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.address_number ? 'is-invalid' : ''}`}><i className="bi bi-123"></i></span>
                <input type="text" id="address_number" name="address_number" className={`form-control border-start-0 ${errors.address_number ? 'is-invalid' : ''}`} placeholder="Número" inputMode="numeric" autoComplete="address-line2" onInput={handleOnlyNumberInput} onBlur={handleBlur} required />
              </div>
              {errors.address_number && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.address_number}</div>}
            </div>

            <div className="col-12 col-md-8 mb-3">
              <label htmlFor="address_city" className="form-label">Cidade</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.address_city ? 'is-invalid' : ''}`}><i className="bi bi-building"></i></span>
                <input type="text" id="address_city" name="address_city" className={`form-control border-start-0 ${errors.address_city ? 'is-invalid' : ''}`} placeholder="Cidade" autoComplete="address-level2" onBlur={handleBlur} value={addressCity} onChange={(e) => setAddressCity(e.target.value)} required />
              </div>
              {errors.address_city && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.address_city}</div>}
            </div>

            <div className="col-12 col-md-4 mb-3">
              <label htmlFor="cep" className="form-label">CEP</label>
              <div className="input-group">
                <span className={`input-group-text bg-transparent border-end-0 ${errors.cep ? 'is-invalid' : ''}`}><i className="bi bi-geo"></i></span>
                <input type="text" id="cep" name="cep" className={`form-control border-start-0 ${errors.cep ? 'is-invalid' : ''}`} placeholder="00000-000" inputMode="numeric" autoComplete="postal-code" onInput={handleCepInput} onBlur={(e) => { handleBlur(e); handleCepBlur(e); }} maxLength={9} required />
                {isCepLoading && (
                  <span className="input-group-text bg-transparent border-0">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </span>
                )}
              </div>
              {errors.cep && <div className="invalid-feedback d-block" style={{display: 'block !important', opacity: '1 !important', transform: 'none !important'}}>{errors.cep}</div>}
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

export default Register