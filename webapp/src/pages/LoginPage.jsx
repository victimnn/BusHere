import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  AuthHeader, 
  LoginForm, 
  AuthErrorAlert, 
  AuthFooter 
} from '../components';
import { useLogin } from '../hooks';
import { useLocation } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const {
    formData,
    validation,
    loading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    handleLogin: originalHandleLogin,
    goBack,
    goToRegister: originalGoToRegister,
    clearError
  } = useLogin();

  // handleLogin modificado para usar redirect
  const handleLogin = async () => {
    const result = await originalHandleLogin();
    if (result && redirect) {
      navigate(redirect, { replace: true });
    }
    // Se não houver redirect, navegação padrão já ocorre no hook
  };

  // goBack modificado para manter redirect
  const handleGoBack = () => {
    if (redirect) {
      navigate(`/register?redirect=${encodeURIComponent(redirect)}`, { replace: true });
    } else {
      goBack();
    }
  };

  // goToRegister modificado para manter redirect
  const goToRegister = () => {
    if (redirect) {
      navigate(`/register?redirect=${encodeURIComponent(redirect)}`, { replace: true });
    } else {
      originalGoToRegister();
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex align-items-start justify-content-center">
      <div className="login-card h-100 w-100 d-flex">
        <div className="px-3 pt-3 pb-2 px-md-4 pt-md-4 pb-md-3 w-100">
          {/* Header Mobile-First */}
          <AuthHeader
            title={
              <>
                Bem-vindo de volta ao
                <span className="text-success"> BusHere!</span>
              </>
            }
            subtitle="Faça login para acessar sua conta"
            onClose={handleGoBack}
            loading={loading}
          />

          {/* Alert de erro mobile-friendly */}
          <AuthErrorAlert 
            error={error} 
            onClose={clearError}
          />

          {/* Formulário Mobile-First */}
          <LoginForm
            formData={formData}
            validation={validation}
            loading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onRememberMeChange={(e) => setRememberMe(e.target.checked)}
            onSubmit={handleLogin}
            onGoToRegister={() => goToRegister(redirect)}
          />

          {/* Footer mobile-friendly */}
          <AuthFooter />
              
        </div>
      </div>
    </div>
  );
}

export default LoginPage;