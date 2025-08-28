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
        style={{ width: "100%", height: "100%", backgroundColor: "#000", maxWidth: "400px" }}
      >
        {/* Botão fechar */}
        <div className="d-flex justify-content-start">
          <button className="btn text-dark p-0 m-0 fs-2 fw-bolder ">✕</button>
        </div>

        {/* Título */} 
        <h5 className="text-center fw-bold mt-5 mb-4 font-family-principal fs-2 " style={{color: "#0F9C42"}}>
          Inicie a sessão com seu <br /> nome de usuário ou email.
        </h5>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label font-family-segundaria">Usuario ou E-mail</label>
            <input
              type="text"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label font-family-segundaria">Senha</label>
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
            className="btn w-100 mb-3 text-white btn-primary-green fw-semibold"
            style={{border: "none", letterSpacing: "1px", fontFamily: "Roboto, sans-serif"}}
            >
            Iniciar sessão
          </button>
        </form>

        {/* Botões secundários */}
        <div className="d-flex justify-content-between mb-3">
          <button className="btn w-50 me-2" style={{backgroundColor: "#d3d3d3ff", height: "90%"}}>Criar uma Conta</button>
          <button className="btn w-50 me-2" style={{backgroundColor: "#c7c7c7ff", height: "90%"}}>Criar com Link</button>
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