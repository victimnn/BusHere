import React from 'react';
import PropTypes from 'prop-types';

const SuccessModal = ({ 
  show, 
  title = 'Sucesso!',
  message = 'Operação realizada com sucesso.',
  subtitle
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show success-modal-backdrop"></div>
      <div 
        className="modal fade show d-block success-modal" 
        tabIndex="-1" 
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg success-modal-content">
            <div className="modal-body text-center success-modal-body">
              {/* Ícone animado */}
              <div className="mb-5 position-relative d-inline-block mt-5">
                <div className="success-icon-circle rounded-circle d-flex align-items-center justify-content-center mx-auto">
                  <i className="bi bi-check-circle-fill text-white success-icon"></i>
                </div>
                {/* Círculo decorativo */}
                <div className="success-ripple-circle"></div>
              </div>
              
              <h3 className="fw-bold mb-4 success-title">
                {title}
              </h3>
              <p className="text-muted mb-5 success-message">
                {message}
                {subtitle && (
                  <>
                    <br />
                    <small className="text-muted d-block mt-3 success-subtitle">{subtitle}</small>
                  </>
                )}
              </p>
              
              {/* Barra de progresso */}
              <div className="progress mx-auto success-progress">
                <div className="progress-bar success-progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SuccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  subtitle: PropTypes.string
};

export default SuccessModal;
