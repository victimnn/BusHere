import React from "react";
import { useState } from "react";


function RegisterPage() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showSenha, setShowSenha] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registrar com:", { user, email, senha });
    };
    return (
        <div className="d-flex justify-content-center align-items-center h-100"> 
            <div 
                className="p-4 bg-theme"
                style={{ width: "100%", height: "100%", maxWidth: "400px"}}
            >
            <div className="d-flex justify-content-start">
              <button className="btn text-dark mt-1 p-0 m-0 fs-2 fw-bolder btn-end">✕</button>
            </div>

            <h5 className="text-center fw-bold mt-5 mb-4 font-family-principal fs-2 ">
                Crie sua conta para <br/>começar a usar o <span style={{color: "#0F9C42"}}>BusHere</span>
            </h5>

            <form onClick={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label font-family-segundaria">Usuario</label>
                    <input 
                        type="text"
                        className="form-control"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                        placeholder="Insira seu usuário" 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label font-family-segundaria">E-mail</label>
                    <input 
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Insira seu melhor e-mail" 
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
                        placeholder="Insira sua senha" 
                    />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowSenha((prev) => !prev)}
                            tabIndex={-1}
                            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                            style={{color: "#757575", borderColor: "#757575"}}
                    >   <i className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`}></i></button>
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 mt-4 text-white btn-primary-green fw-semibold"
                        style={{border: "none", letterSpacing: "1px", fontFamily: "Roboto, sans-serif"}}
                        >
                        Continuar
                    </button>
                </div>
            </form>
            <p className=" text-center fw-semibold">
                <a href="/login" style={{ color: "#2e7d32"}}>
                    Ja possui uma conta?
                </a>
            </p>
        </div> 
    </div>
    );
}

export default RegisterPage;