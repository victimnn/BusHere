import React from 'react';
import PropTypes from 'prop-types';

/**
 * Botão flutuante para abrir/fechar a sidebar
 * Posicionado no canto superior esquerdo da tela
 * Otimizado para dispositivos móveis
 */
const FloatingButton = ({ className = '', style = {}, onClick, isOpen }) => {
  return (
    <button 
      className={`btn btn-light rounded-circle m-0 d-flex align-items-center justify-content-center shadow ${className}`}
      style={{ 
        position: "fixed", 
        top: "15px", 
        left: "15px", 
        zIndex: 1050, 
        aspectRatio: '1 / 1',
        width: '48px',
        height: '48px',
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        ...style
      }}
      onClick={onClick}
      aria-label={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
      title={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
    >
      <i 
        className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`} 
        style={{ fontSize: '22px' }} 
      />
    </button>
  );
};

FloatingButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

export default FloatingButton;
