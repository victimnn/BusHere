import React from 'react';
import PropTypes from 'prop-types';

/**
 * Botão flutuante para abrir/fechar a sidebar
 * Posicionado no canto superior esquerdo
 * Otimizado para dispositivos móveis
 */
const FloatingButton = ({ className = '', style = {}, onClick, isOpen, isDark }) => {
  return (
    <button 
      className={`btn ${isDark ? 'btn-dark' : 'btn-light'} rounded-circle d-flex align-items-center justify-content-center shadow ${className}`}
      style={{ 
        position: "fixed", 
        top: "15px", 
        left: "15px", 
        zIndex: 1050, 
        width: '48px',
        height: '48px',
        border: 'none',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isDark ? '#343a40' : '#f8f9fa',
        borderColor: isDark ? '#495057' : '#dee2e6',
        ...style
      }}
      onClick={onClick}
      aria-label={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
      title={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
    >
      <i 
        className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`} 
        style={{ 
          fontSize: '22px',
          color: isDark ? '#ffffff' : '#212529'
        }} 
      />
    </button>
  );
};

FloatingButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  isDark: PropTypes.bool
};

export default FloatingButton;
