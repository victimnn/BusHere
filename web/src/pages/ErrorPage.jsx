import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Componentes
import ActionButton from "@web/components/common/buttons/ActionButton";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoHome = useCallback(() => {
    setIsLoading(true);
    navigate('/');
  }, [navigate]);

  const handleContact = useCallback(() => {
    setIsLoading(true);
    navigate('/');
  }, [navigate]);

  return (
    <div className="error-page-container error-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card error-card">
              <div className="card-body text-center px-4 px-md-5 py-5 mt-3">
                {/* Main 404 number */}
                <div className="mb-4">
                  <span className="error-number">
                    4<span className="error-zero">0</span>4
                  </span>
                </div>

                {/* Error message */}
                <h2 className="error-title">
                  Oops! Página não encontrada
                </h2>
                <p className="error-description">
                  A página que você está procurando pode ter sido removida,
                  teve seu nome alterado ou está temporariamente indisponível.
                </p>

                {/* Action buttons */}
                <div className="error-actions d-flex justify-content-center gap-3">
                  <ActionButton
                    onClick={handleGoHome}
                    icon="bi bi-house-fill"
                    text="Ir para Home"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </div>
                {/* Additional help section */}
                <div className="error-help">
                  <h5 className="help-title">Precisa de ajuda?</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <ActionButton
                      onClick={handleContact}
                      icon="bi bi-envelope-fill"
                      text="Contato"
                      variant="outline-primary"
                      size="sm"
                      loading={isLoading}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;