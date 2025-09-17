import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de celebração para cadastro bem-sucedido
 * Mostra um efeito visual de celebração
 */
const RegistrationSuccessModal = ({ isVisible, onClose, userName = '' }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('show');
      // Auto close após 3 segundos
      const timer = setTimeout(() => {
        setAnimationClass('hide');
        setTimeout(onClose, 300); // Aguarda animação de saída
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`success-modal-overlay ${animationClass}`}>
      <div className="success-modal-content">
        <div className="success-animation">
          <div className="success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="confetti">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`confetti-piece confetti-${i + 1}`}></div>
            ))}
          </div>
        </div>
        
        <div className="success-content">
          <h3 className="success-title">🎉 Parabéns!</h3>
          <p className="success-message">
            {userName ? `${userName}, sua conta foi criada com sucesso!` : 'Sua conta foi criada com sucesso!'}
          </p>
          <p className="success-subtitle">
            Redirecionando para o login...
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .success-modal-overlay.show {
          opacity: 1;
        }
        
        .success-modal-overlay.hide {
          opacity: 0;
        }
        
        .success-modal-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          position: relative;
          max-width: 400px;
          margin: 1rem;
          animation: bounceIn 0.5s ease;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .success-animation {
          position: relative;
          margin-bottom: 1rem;
        }
        
        .success-icon {
          font-size: 4rem;
          color: #28a745;
          animation: pulse 1s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        
        .confetti {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #007bff;
          border-radius: 50%;
          animation: fall 3s linear infinite;
        }
        
        .confetti-1 { background: #007bff; left: 10%; animation-delay: 0s; }
        .confetti-2 { background: #28a745; left: 20%; animation-delay: 0.2s; }
        .confetti-3 { background: #ffc107; left: 30%; animation-delay: 0.4s; }
        .confetti-4 { background: #dc3545; left: 40%; animation-delay: 0.6s; }
        .confetti-5 { background: #17a2b8; left: 50%; animation-delay: 0.8s; }
        .confetti-6 { background: #6f42c1; left: 60%; animation-delay: 1s; }
        .confetti-7 { background: #fd7e14; left: 70%; animation-delay: 1.2s; }
        .confetti-8 { background: #20c997; left: 80%; animation-delay: 1.4s; }
        .confetti-9 { background: #e83e8c; left: 90%; animation-delay: 1.6s; }
        .confetti-10 { background: #6c757d; left: 15%; animation-delay: 0.3s; }
        .confetti-11 { background: #343a40; left: 35%; animation-delay: 0.7s; }
        .confetti-12 { background: #f8f9fa; left: 75%; animation-delay: 1.1s; }
        
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .success-title {
          color: #28a745;
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
        
        .success-message {
          color: #495057;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        .success-subtitle {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .success-modal-content {
            margin: 0.5rem;
            padding: 1.5rem;
          }
          
          .success-icon {
            font-size: 3rem;
          }
          
          .success-title {
            font-size: 1.3rem;
          }
          
          .success-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

RegistrationSuccessModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userName: PropTypes.string
};

export default RegistrationSuccessModal;