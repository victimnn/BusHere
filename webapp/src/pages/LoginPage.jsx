import React from 'react';
import { 
  AuthHeader, 
  LoginForm, 
  AuthErrorAlert, 
  AuthFooter 
} from '../components/common';
import { useLogin } from '../hooks';

function LoginPage() {
  const {
    formData,
    validation,
    loading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    handleLogin,
    goBack,
    goToRegister,
    clearError
  } = useLogin();

  return (
    <div className="login-container min-vh-100">
      <div className="login-card w-100">
        <div className="px-3 py-4 px-md-4 py-md-5">
          {/* Header Mobile-First */}
          <AuthHeader
            title={
              <>
                Bem-vindo de volta ao
                <span className="text-success"> BusHere!</span>
              </>
            }
            subtitle="Faça login para acessar sua conta"
            onClose={goBack}
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
            onGoToRegister={goToRegister}
          />

          {/* Footer mobile-friendly */}
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;