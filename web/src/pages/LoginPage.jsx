import React from "react";

function Login(){
    return (
        <div className="login-container">
      <div className="login-box">
        <h2>Olá,</h2>
        <h1>
          <strong>BEM-VINDO</strong> ao <span>BusHere!</span>
        </h1>

        <form>
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            type="text"
            placeholder="Insira o usuário"
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Insira a senha"
          />

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button type="submit">ENTRAR</button>

          <div className="register-link">
            <a href="#">Não Possui Cadastro?</a>
          </div>
        </form>
      </div>
    </div>
    )
}

export default Login