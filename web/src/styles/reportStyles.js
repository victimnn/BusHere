// Estilos CSS customizados para a página de relatórios
export const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  }
  
  .card-hover {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
  }
  
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
  }
  
  .card-hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }
  
  .card-hover:hover::before {
    left: 100%;
  }
  
  .progress {
    background-color: rgba(0,0,0,0.05) !important;
  }
  
  .chart-container {
    position: relative;
    height: 250px;
    max-height: 250px;
  }
  
  .stats-icon {
    font-size: 2.5rem;
    opacity: 1;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.2);
  }
  
  .stats-icon:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3);
  }
  
  .stats-icon i {
    color: #ffffff !important;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4)) brightness(1.1);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    font-weight: 900;
  }
  
  .animated-counter {
    display: inline-block;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  .stats-card .card-body {
    position: relative;
    z-index: 2;
  }
  
  .metric-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Ajustes para garantir scroll */
  .reports-main {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 4rem;
    scroll-behavior: smooth;
  }
  
  /* Forçar scroll no body da aplicação quando necessário */
  body {
    overflow-y: auto !important;
  }
  
  /* Ajustar container principal da página de relatórios */
  .reports-main.container-fluid {
    max-height: calc(100vh - 120px);
    overflow-y: auto !important;
    padding-top: 0;
  }
  
  /* Customizar scrollbar */
  .reports-main::-webkit-scrollbar {
    width: 8px;
  }
  
  .reports-main::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .reports-main::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
  }
  
  .reports-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }
  
  /* Otimização dos cards principais */
  .stats-card {
    min-height: 140px;
    max-height: 180px;
  }
  
  /* Otimização dos gráficos */
  .chart-card {
    min-height: 350px;
    max-height: 450px;
  }
  
  .chart-card .card-body {
    height: 300px;
    overflow: hidden;
  }
  
  /* Responsividade melhorada */
  @media (max-width: 768px) {
    .stats-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
    }
    
    .stats-icon i {
      color: #ffffff;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
      text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
    }
    
    .card-body h2 {
      font-size: 1.8rem !important;
    }
    
    .chart-card {
      min-height: 300px;
      max-height: 350px;
    }
    
    .chart-card .card-body {
      height: 250px;
    }
    
    .stats-card {
      min-height: 120px;
      max-height: 150px;
    }
  }
  
  @media (max-width: 576px) {
    .stats-icon {
      font-size: 1.8rem;
      width: 45px;
      height: 45px;
    }
    
    .stats-icon i {
      color: #ffffff;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
      text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
    }
    
    .chart-container {
      height: 200px;
      max-height: 200px;
    }
    
    .chart-card .card-body {
      height: 200px;
    }
  }
`;
