import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SideBar from './SideBar';
import FloatingButton from './FloatingButton';

/**
 * Layout global que envolve todas as páginas que precisam de sidebar
 * Gerencia estado global da sidebar e botão hambúrguer flutuante
 * Mantém consistência visual em toda a aplicação
 */
const Layout = ({ children, isDark, setIsDark }) => {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

  /**
   * Abre a sidebar
   */
  const handleSidebarOpen = () => {
    setSideBarIsOpen(true);
  };

  /**
   * Fecha a sidebar
   */
  const handleSidebarClose = () => {
    setSideBarIsOpen(false);
  };

  /**
   * Fecha a sidebar após navegação (otimização para mobile)
   */
  const handleSidebarNavigate = () => {
    handleSidebarClose();
  };

  return (
    <div className="layout-container" style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* FloatingButton para abrir sidebar - posicionado de forma não intrusiva */}
      <FloatingButton 
        onClick={handleSidebarOpen}
        isOpen={sideBarIsOpen}
        isDark={isDark}
      />
      
      {/* Conteúdo das páginas */}
      <div className="layout-content" style={{ 
        height: '100%', 
        width: '100%', 
        overflow: 'auto'
      }}>
        {React.cloneElement(children, { isDark, setIsDark })}
      </div>
      
      {/* Sidebar lateral - disponível globalmente */}
      <SideBar
        isOpen={sideBarIsOpen}
        onClickOutside={handleSidebarClose}
        isDark={isDark}
        setIsDark={setIsDark}
        onNavigate={handleSidebarNavigate}
      />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isDark: PropTypes.bool.isRequired,
  setIsDark: PropTypes.func.isRequired
};

export default Layout;