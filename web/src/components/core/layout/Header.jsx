import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@web/context/authContext";
import PopUpComponent from "@web/components/core/feedback/PopUpComponent";
import SearchBar from "@web/components/core/navigation/SearchBar";

function Header({pageName}){
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const handleUserClick = () => {
        if (isAuthenticated) {
            setShowUserMenu(!showUserMenu);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    const handleClickOutside = (event) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
            setShowUserMenu(false);
        }
    };

    // Adicionar event listener para fechar o menu ao clicar fora
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
      <header
        className={`
          border-bottom 
          d-flex 
          flex-column 
          flex-md-row 
          justify-content-between 
          align-items-center
          px-3 
          py-2
          position-relative
          header-container
        `}
        style={{
          backgroundColor: 'var(--bs-body-bg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        {/* Logo/Nome da página - Responsivo */}
        <div 
          className="d-flex justify-content-center justify-content-md-start align-items-center"
          style={{ 
            minWidth: '180px', 
            maxWidth: '280px', 
            width: 'clamp(180px, 25vw, 280px)',
            flexShrink: 0
          }}
        >
          <h1 
            className="mb-2 mb-md-0 w-100 text-center text-md-start page-title" 
            style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              color: 'var(--bs-primary)'
            }}
          >
            {pageName}
          </h1>
        </div>

        {/* Barra de pesquisa - Centralizada e responsiva */}
        <div className="flex-grow-1 d-flex justify-content-center px-2 px-md-4 order-3 order-md-2 search-container">
          <div className="w-100">
            <SearchBar />
          </div>
        </div>

        {/* Área do usuário - Modernizada e responsiva */}
        <div 
          className="d-flex align-items-center gap-2 mt-2 mt-md-0 order-2 order-md-3 position-relative user-info-container"
          ref={userMenuRef}
          style={{ minWidth: 'fit-content' }}
        >
          {isAuthenticated ? (
            <>
              {/* Informações do usuário */}
              <div 
                className="d-flex align-items-center gap-2 p-2 rounded-3 user-profile-card"
                style={{
                  backgroundColor: 'var(--bs-light)',
                  border: '1px solid var(--bs-border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: 'fit-content'
                }}
                onClick={handleUserClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bs-gray-200)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bs-light)'}
              >
                {/* Avatar do usuário */}
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle user-avatar"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--bs-primary)',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {(user?.nome || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                
                {/* Nome do usuário - Responsivo */}
                <div className="d-none d-sm-block">
                  <div 
                    className="fw-semibold user-name"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                      lineHeight: '1.2'
                    }}
                  >
                    {user?.nome || user?.name || 'Usuário'}
                  </div>
                  <div 
                    className="text-muted small user-email"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {user?.email || 'Usuário'}
                  </div>
                </div>

                {/* Ícone de dropdown */}
                <i 
                  className={`bi bi-chevron-down ms-1 transition-transform ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                  style={{
                    fontSize: '0.875rem',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>

              {/* Menu dropdown do usuário */}
              {showUserMenu && (
                <div 
                  className="position-absolute top-100 end-0 mt-2 rounded-3 shadow-lg border user-dropdown"
                  style={{
                    minWidth: '200px',
                    zIndex: 1001,
                    animation: 'slideDown 0.2s ease'
                  }}
                >
                  <div className="p-3 border-bottom">
                    <div className="fw-semibold">{user?.nome || user?.name || 'Usuário'}</div>
                    <div className="text-muted small">{user?.email || 'email@exemplo.com'}</div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      className="btn btn-outline-danger w-100 d-flex align-items-center gap-2 justify-content-center logout-button"
                      onClick={handleLogout}
                      style={{ fontSize: '0.875rem' }}
                    >
                      <i className="bi bi-box-arrow-right" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Estado não autenticado */
            <div 
              className="d-flex align-items-center gap-2 p-2 rounded-3 user-not-logged"
              style={{
                border: '1px solid var(--bs-border-color)'
              }}
            >
              <i className="bi bi-person-circle fs-4" />
              <span className="d-none d-sm-block fw-medium">Não logado</span>
            </div>
          )}
        </div>
      </header>
    )
  }

export default Header