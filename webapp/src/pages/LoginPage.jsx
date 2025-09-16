import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ActionButton, FormField, PasswordField } from "../components/common";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validação em tempo real
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Por favor, insira um e-mail válido");
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError("Por favor, corrija os erros antes de continuar.");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      const response = await api.auth.login({ email, password });
      
      // Integração com AuthContext
      if (response && response.token) {
        // Gerenciar persistência do login
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        
        // Buscar dados do usuário autenticado
        const userData = await api.auth.me();
        login(userData);
        
        // Redirecionamento baseado no papel do usuário ou para profile
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      console.error("Erro no login:", err);
      
      // Tratamento específico de erros
      if (err.status === 401) {
        setError("E-mail ou senha incorretos. Verifique suas credenciais.");
      } else if (err.status === 429) {
        setError("Muitas tentativas de login. Tente novamente em alguns minutos.");
      } else if (err.status >= 500) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } else {
        const message = err?.data?.message || err?.message || "Falha ao fazer login. Tente novamente.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container min-vh-100">
      <div className="login-card w-100">
        <div className="px-3 py-4 px-md-4 py-md-5">
          {/* Header Mobile-First */}
          <div className="mb-4">
            {/* Top bar com botão fechar */}
            <div className="d-flex justify-content-start mb-4">
              <button
                className="btn btn-link text-dark p-2 fs-2"
                onClick={() => navigate(-1)}
                aria-label="Fechar"
                type="button"
                disabled={loading}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            
            {/* Título e descrição mobile-first */}
            <div className="text-center">
              <h1 className="fw-bold mb-3 h1">
                Bem-vindo de volta ao
                <span className="text-success"> BusHere!</span>
              </h1>
              <p className="text-muted mb-0 fs-6">
                Faça login para acessar sua conta
              </p>
            </div>
          </div>

          {/* Alert de erro mobile-friendly */}
          {error && (
            <div className="alert alert-danger d-flex align-items-start mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 mt-1 flex-shrink-0"></i>
              <span className="small">{error}</span>
            </div>
          )}

          {/* Formulário Mobile-First */}
          <form onSubmit={handleSubmit} noValidate className="needs-validation mb-3">
            <FormField
              id="login-email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              autoComplete="email"
              disabled={loading}
              inputClassName="form-control-lg"
              style={{ height: '60px', fontSize: '18px' }}
              error={emailError}
            />

            <PasswordField
              id="login-password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
              disabled={loading}
              inputClassName="form-control-lg"
              style={{ height: '60px', fontSize: '18px' }}
              buttonVariant="outline-secondary"
              error={passwordError}
            />

            {/* Opções adicionais mobile-friendly */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label className="form-check-label small" htmlFor="rememberMe">
                  Lembrar de mim
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-decoration-none text-success small"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão de submit mobile-friendly */}
            <ActionButton
              type="submit"
              variant="success"
              size="lg"
              fullWidth
              className="mb-4 fw-semibold"
              disabled={!isFormValid}
              loading={loading}
              icon={!loading ? "bi bi-box-arrow-in-right" : undefined}
              ariaLabel={loading ? "Fazendo login..." : "Entrar na conta"}
            >
              {loading ? "Entrando..." : "Entrar"}
            </ActionButton>
          </form>

          {/* Divisor mobile-friendly */}
          <div className="position-relative text-center mb-4">
            <hr className="my-3 opacity-25" />
            <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small rounded-pill">
              ou
            </span>
          </div>

          {/* Ações secundárias mobile-first */}
          <div className="mb-4">
            <ActionButton
              variant="outline-primary"
              size="lg"
              fullWidth
              className="fw-medium"
              onClick={() => navigate('/register')}
              disabled={loading}
              icon="bi bi-person-plus"
            >
              Criar nova conta
            </ActionButton>
          </div>

          {/* Footer mobile-friendly */}
          <div className="text-center">
            <small className="text-muted d-block lh-sm" style={{ maxWidth: "280px", margin: "0 auto" }}>
              Ao entrar, você concorda com nossos{" "}
              <Link to="/terms" className="text-decoration-none text-muted">
                <u>Termos de Uso</u>
              </Link>{" "}
              e{" "}
              <Link to="/privacy" className="text-decoration-none text-muted">
                <u>Política de Privacidade</u>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;