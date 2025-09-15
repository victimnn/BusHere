import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function LoginPage() {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login com:", { user, senha });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 h-100">
      <div  
        className="p-4"
        style={{ width: "100%", height: "100%", maxWidth: "400px"}}
      > 
        {/* Botão fechar */}
        <div className="d-flex justify-content-start" onClick={() => window.history.back()}>
          <button className="btn text-dark mt-1 p-0 m-0 fs-2 fw-bolder btn-end">✕</button>
        </div>
        
        <h5 className="text-center fw-bold mt-5 mb-4 font-family-principal fs-2 ">
          Inicie a sessão para <br/> começar a usar o <span style={{color: "#0F9C42"}}>BusHere</span>
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
              placeholder="Insira o usuário ou email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label font-family-segundaria">Senha</label>
          <div className="input-group">
            <input
              type={showSenha ? "text" : "password"}
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Insira a sua senha"
              style={{maxWidth: "100%"}}
            />
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSenha((prev) => !prev)}
                tabIndex={-1}
                aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                
              >
                <i className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
          </div>
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
        <div className="d-flex justify-content-between mb-3 mr-0">
          <button className="btn btn-secondary w-50 me-2" style={{ borderColor: "#757575", height: "100%"}}>Criar uma Conta</button>
          <button className="btn btn-secondary w-50" style={{ borderColor: "#757575", height: "100%"}}>Criar com Link</button>
        </div>

        {/* Link */}
        <p className="text-center fw-semibold ">
          <a href="/">
            Esqueceu a senha?
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;