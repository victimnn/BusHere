/**
 * Arquivo centralizado de keyframes e animações CSS reutilizáveis
 * Evita duplicação de código de animações em diferentes componentes
 */

export const globalKeyframes = `
  @keyframes slideDown {
    0% { 
      opacity: 0; 
      transform: translateY(-30px); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes spin {
    from { 
      transform: rotate(0deg); 
    }
    to { 
      transform: rotate(360deg); 
    }
  }
  
  @keyframes fadeIn {
    from { 
      opacity: 0; 
    }
    to { 
      opacity: 1; 
    }
  }
  
  @keyframes fadeOut {
    from { 
      opacity: 1; 
    }
    to { 
      opacity: 0; 
    }
  }
  
  @keyframes zoomIn {
    0% { 
      opacity: 0; 
      transform: scale(0.5); 
    }
    50% { 
      transform: scale(1.05); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  @keyframes checkBounce {
    0% { 
      transform: scale(0); 
      opacity: 0; 
    }
    50% { 
      transform: scale(1.3); 
    }
    75% { 
      transform: scale(0.9); 
    }
    100% { 
      transform: scale(1); 
      opacity: 1; 
    }
  }
  
  @keyframes ripple {
    0% { 
      transform: translate(-50%, -50%) scale(0.8); 
      opacity: 0.8; 
    }
    50% { 
      opacity: 0.4; 
    }
    100% { 
      transform: translate(-50%, -50%) scale(1.4); 
      opacity: 0; 
    }
  }
  
  @keyframes progressBar {
    0% { 
      width: 0%; 
      opacity: 0.5; 
    }
    50% { 
      opacity: 1; 
    }
    100% { 
      width: 100%; 
      opacity: 0.8; 
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(18, 190, 77, 0.7); 
    }
    50% { 
      box-shadow: 0 0 0 15px rgba(18, 190, 77, 0); 
    }
  }
  
  .modal-backdrop.show {
    animation: fadeIn 0.3s ease;
  }
`;

/**
 * Timing functions reutilizáveis
 */
export const timingFunctions = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
};

/**
 * Durations padrões
 */
export const animationDurations = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
  verySlow: '1s'
};
