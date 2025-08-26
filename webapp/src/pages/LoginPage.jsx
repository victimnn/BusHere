import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login com:", { user, senha });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Botão fechar */}
        <div className="d-flex justify-content-start">
          <button className="btn text-dark p-0 m-0 fs-2 fw-bolder ">✕</button>
        </div>

        {/* Título */} 
        <h5 className="text-center fw-bold mt-4 mb-4 font-family-principal fs-2 text-green">
          Inicie a sessão com seu <br /> nome de usuário ou email.
        </h5>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario ou E-mail</label>
            <input
              type="text"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3 btn-primary"
            style={{ backgroundColor: "#2e7d32", border: "none" }}
            >
            Iniciar Sessão
          </button>
        </form>

        {/* Botões secundários */}
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-dark w-50 me-2">Criar uma Conta BusHere</button>
          <button className="btn btn-dark w-50">Criar com Link</button>
        </div>

        {/* Link */}
        <p className="text-center">
          <a href="#" style={{ color: "#2e7d32", textDecoration: "none" }}>
            Esqueceu a Conta BusHere ou a senha?
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage