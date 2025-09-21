import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstallButton from './InstallButton';

const SideBarContent = ({ isDark, setIsDark, onNavigate }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: 'bi-house', label: 'Início', active: location.pathname === '/' },
        { path: '/conta', icon: 'bi-person', label: 'Conta', active: location.pathname === '/conta' },
        { path: '/avisos', icon: 'bi-bell', label: 'Avisos', active: location.pathname === '/avisos' },
        { path: '/boletos', icon: 'bi-credit-card', label: 'Boletos', active: location.pathname === '/boletos' },
        { path: '/ajustes', icon: 'bi-gear', label: 'Ajustes', active: location.pathname === '/ajustes' },
        { path: '/ajuda', icon: 'bi-question-circle', label: 'Ajuda', active: location.pathname === '/ajuda' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // Fechar sidebar automaticamente após navegação em dispositivos móveis
        if (onNavigate) {
            onNavigate();
        }
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <div className="sidebar-content">
            {/* Header com nome do usuário e botão de tema */}
            <div className="sidebar-header">
                <div className="sidebar-user-info">
                    <div className="sidebar-avatar">
                        <i className="bi bi-person"></i>
                    </div>
                    <div className="sidebar-user-details">
                        <h6 className="sidebar-username">{user?.nome_completo || 'Usuário'}</h6>
                        <small className="sidebar-welcome">Bem-vindo!</small>
                    </div>
                    
                    {/* Botão de troca de tema */}
                    <button
                        className="sidebar-theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                    >
                        <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
                    </button>
                </div>
            </div>

            {/* Menu de navegação */}
            <div className="sidebar-nav-container">
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <div className="sidebar-nav-content">
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Footer da sidebar */}
            <div className="sidebar-footer">
                {/* Botão de instalação PWA */}
                <div className="sidebar-install">
                    <InstallButton variant="outline-primary" size="sm" className="w-100 mb-2" />
                </div>
                
                <div className="sidebar-brand">
                    <small>
                        <i className="bi bi-bus-front-fill"></i>
                        BusHere!
                    </small>
                </div>
            </div>
        </div>
    );
};

const SideBar = ({ isOpen, onClickOutside, isDark, setIsDark, onNavigate }) => {
    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <SideBarContent isDark={isDark} setIsDark={setIsDark} onNavigate={onNavigate} />
            </div>

            <div 
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={onClickOutside}
            >
            </div>
        </>
    );
};

export default SideBar;
