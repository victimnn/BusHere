import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLocation } from "react-router-dom";


function SideButton({name, icon, href = "#", isOpen = false, style = {}}){
    const location = useLocation();
    const isActive = location.pathname === (href.startsWith('/') ? href : `/${href}`);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    
    return (
    <Link
        to={href} 
        className={`d-flex align-items-center rounded-3 text-decoration-none w-100 mb-1 position-relative overflow-hidden`}
        style={{
            transition: "all 0.3s ease",
            backgroundColor: isActive ? "rgba(61, 253, 13, 0.1)" : (isButtonHovered ? "rgba(18, 190, 77, 0.05)" : "transparent"),
            borderLeft: isActive ? "3px solid #12BE4D" : "3px solid transparent",
            padding: "12px",
            minHeight: "44px", // Garante altura mínima
            ...style
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
    >
        <div className="d-flex align-items-center w-100">
          <i className={`bi bi-${icon}`} 
             style={{ 
                 fontSize: "1.2rem", 
                 minWidth: "24px",
                 color: isActive ? "#12BE4D" : (isButtonHovered ? "#12BE4D" : "#6c757d"),
                 transition: "color 0.3s ease"
             }} />
          <span 
              className="fw-medium ms-3"
              style={{
                  opacity: isOpen ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  color: isActive ? "#12BE4D" : (isButtonHovered ? "#12BE4D" : "#212529")
              }}
          > 
            {name}
          </span>
        </div>
        
        {/* Indicador de ativo */}
        {isActive && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-3"
                 style={{
                     opacity: isOpen ? 1 : 0,
                     transition: "opacity 0.3s ease"
                 }}>
                <div className="bg-primary rounded-circle" 
                     style={{ 
                         width: "6px", 
                         height: "6px"
                     }}></div>
            </div>
        )}
    </Link>
    );
}


function SideBar() {
    const [isHovered, setIsHovered] = useState(false);
    const sidebarWidth = isHovered ? "240px" : "70px"; // Largura do sidebar

    return (
      <aside
        id="sidebar"
        className="d-flex flex-column shadow-sm"
        style={{
          height: "100vh",
          width: sidebarWidth,
          transition: "width 0.3s ease",
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          flexShrink: 0,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header da Sidebar */}
        <div className="border-bottom p-3" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-center">
              <img src="/logo.svg" alt="Logo" className="logo-primary" style={{ width: "40px", height: "40px" }} />
            </div>
            <h5 className="mb-0 fw-bold text-dark ms-3"
                style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    whiteSpace: "nowrap"
                }}>
                BusHere!
            </h5>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1 p-2">
          <SideButton
            name="Dashboard"
            icon="house-fill"
            href="/"
            isOpen={isHovered}
          />
          <SideButton
            name="Passageiros"
            icon="people-fill"
            href="passengers"
            isOpen={isHovered}
          />
          <SideButton
            name="Motoristas"
            icon="person-fill-gear"
            href="drivers"
            isOpen={isHovered}
          />
          <SideButton
            name="Ônibus"
            icon="bus-front-fill"
            href="buses"
            isOpen={isHovered}
          />
          <SideButton
            name="Rotas"
            icon="signpost-split-fill"
            href="routes"
            isOpen={isHovered}
          />
          <SideButton
            name="Pontos"
            icon="geo-alt-fill"
            href="stops"
            isOpen={isHovered}
          />
          <SideButton
            name="Relatórios"
            icon="graph-up"
            href="reports"
            isOpen={isHovered}
          />
        </nav>

        {/* Footer */}
        <div className="p-2 border-top" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          <SideButton
            name="Configurações"
            icon="gear-fill"
            href="settings"
            isOpen={isHovered}
          />
        </div>
      </aside>
    );
}


export default SideBar