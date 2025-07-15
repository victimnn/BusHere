import React from "react";

function Login(){
    return (
       <div className="d-flex justify-content-center align-items-center min-vh-100 bg-success bg-gradient">
      <div className="bg-dark text-white p-5 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span className="text-success">BusHere!</span>
        </h1>

        <form className="mt-4" method="GET" >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Insira o usuário"
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
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Lembrar de mim
              </label>
            </div>
            <a href="#" className="text-white text-decoration-underline small">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            ENTRAR
          </button>

          <div className="text-center mt-3">
            <a href="/register" className="text-white text-decoration-underline small">
              Não Possui Cadastro?
            </a>
          </div>
        </form>
      </div>
    </div>
    )
}

export default Login