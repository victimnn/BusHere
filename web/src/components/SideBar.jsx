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
            transition: "all 0.3s ease-in-out",
            backgroundColor: isActive ? "rgba(61, 253, 13, 0.1)" : (isButtonHovered ? "rgba(18, 190, 77, 0.05)" : "transparent"),
            borderLeft: isActive ? "3px solid #12BE4D" : "3px solid transparent",
            padding: isOpen ? "12px" : "8px",
            minHeight: "44px", // Garante altura mínima
            ...style
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
    >
        <div className={`d-flex align-items-center w-100`}
             style={{
                 paddingLeft: isOpen ? "0" : "calc(50% - 12px)",
                 transition: "padding-left 0.3s ease-in-out"
             }}>
          <i className={`bi bi-${icon}`} 
             style={{ 
                 fontSize: "1.2rem", 
                 minWidth: "24px",
                 color: isActive ? "#12BE4D" : (isButtonHovered ? "#12BE4D" : "#6c757d"),
                 transition: "color 0.3s ease-in-out"
             }} />
          <span 
              className="fw-medium"
              style={{
                  marginLeft: isOpen ? "12px" : "0",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(-10px)",
                  transition: "all 0.3s ease-in-out",
                  whiteSpace: "nowrap",
                  width: isOpen ? "auto" : "0",
                  overflow: "hidden",
                  color: isActive ? "#12BE4D" : (isButtonHovered ? "#12BE4D" : "#212529")
              }}
          > 
            {name}
          </span>
        </div>
        
        {/* Indicador de ativo */}
        {isActive && (
            <div className="position-absolute end-0 top-50 translate-middle-y"
                 style={{
                     marginRight: isOpen ? "8px" : "calc(50% - 3px)",
                     opacity: isOpen ? 1 : 0,
                     transition: "all 0.3s ease-in-out"
                 }}>
                <div className="bg-primary rounded-circle" 
                     style={{ 
                         width: "6px", 
                         height: "6px",
                         transition: "all 0.3s ease-in-out"
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
          transition: "all 0.3s ease-in-out",
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          minWidth: isHovered ? "240px" : "70px",
        }}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header da Sidebar */}
        <div className={`border-bottom ${isHovered ? 'p-3' : 'p-2'}`} style={{ borderColor: "rgba(0,0,0,0.05)", transition: "all 0.3s ease-in-out" }}>
          <div className="d-flex align-items-center"
               style={{
                   paddingLeft: isHovered ? "0" : "calc(50% - 16px)",
                   transition: "padding-left 0.3s ease-in-out"
               }}>
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                 style={{ width: "32px", height: "32px", minWidth: "32px" }}>
              <i className="bi bi-building text-white" style={{ fontSize: "0.9rem" }}></i>
            </div>
            <div className="overflow-hidden">
              <h6 className="mb-0 fw-bold text-dark"
                  style={{
                      marginLeft: isHovered ? "12px" : "0",
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "translateX(0)" : "translateX(-20px)",
                      transition: "all 0.3s ease-in-out",
                      whiteSpace: "nowrap",
                      width: isHovered ? "auto" : "0",
                      overflow: "hidden"
                  }}>
                  BusHere!
              </h6>
            </div>
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