import { useRef } from "react";
import { useAuth } from "@web/context/authContext";
import PopUpComponent from "@web/components/ui/PopUpComponent";
import SearchBar from "@web/components/ui/SearchBar";

function Header({pageName}){
    const { user, logout, isAuthenticated } = useAuth();

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
        `}
      >
        <div 
          className="d-flex justify-content-center justify-content-md-start"
          style={{ 
            minWidth: '200px', 
            maxWidth: '300px', 
            width: '250px',
            flexShrink: 0
          }}
        >
          <h1 
            className="mb-2 mb-md-0 w-100" 
            style={{ 
              fontSize: 'clamp(0.5rem, 2vw, 2rem)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap'
            }}
          >
            {pageName}
          </h1>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center px-md-4">
          <SearchBar />
        </div>

        <span className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <span className="fw-bold">
            {isAuthenticated ? user?.nome || user?.name || 'Usuário' : 'Não logado'}
          </span>
          {/* Icon representing the user's profile */}
          <i className="bi bi-person-circle fs-1" style={{ cursor: 'pointer' }} onClick={logout} />
        </span>
      </header>
    )
  }

export default Header