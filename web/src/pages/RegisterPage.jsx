import React from "react";

function Register() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-success bg-gradient">
      <div
        className="bg-dark text-white p-5 shadow"
        style={{ width: "100%", maxWidth: "500px", borderRadius: "12px" }}
      >
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao{" "}
          <span className="text-success">BusHere!</span>
        </h1>
        <p className="mb-4">Crie sua conta abaixo:</p>

        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Seu nome"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Seu e-mail"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Crie um nome de usuário"
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
              placeholder="Crie uma senha"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            CADASTRAR
          </button>

          <div className="text-center mt-3">
            <a href="/login" className="text-white text-decoration-underline small">
              Já possui uma conta? Entrar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register