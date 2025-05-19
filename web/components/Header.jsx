import { useRef } from "react";
import PopUpComponent from "../components/PopUpComponent";
import SearchBar from "../components/SearchBar";

function Header({pageName}){
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
        <div className="d-flex justify-content-center justify-content-md-start">
          <h1 className="mb-2 mb-md-0">{pageName}</h1>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center px-md-4">
          <SearchBar />
        </div>

        <span className="d-flex align-items-center gap-2 mt-2 mt-md-0">
          <span className="fw-bold">Nome do Usuário</span>
          {/* Icon representing the user's profile */}
          <i className="bi bi-person-circle fs-1" />
        </span>
      </header>
    )
  }

export default Header