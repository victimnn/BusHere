import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import PopUpComponent from "./components/PopUpComponent";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PassengersPage from "./pages/PassengersPage";
import BusesPage from "./pages/BusesPage";
import RoutesPage from "./pages/RoutesPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import StopsPage from "./pages/StopsPage";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function App() {
  const [pageName, setPageName] = useState("Giraldi");
  const [showSideBar, setShowSideBar] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  // funcoes de navegação para serem usadas pelas paginas
  const pageFunctions = {
    setPageName: (newName) => setPageName(newName),
    getPageName: () => pageName,

    setShowSideBar: (show) => setShowSideBar(show),
    getShowSideBar: () => showSideBar,
    toggleShowSideBar: () => setShowSideBar(!showSideBar),

    setShowHeader: (show) => setShowHeader(show),
    getShowHeader: () => showHeader,
    toggleShowHeader: () => setShowHeader(!showHeader),

    // Função para definir o nome da página, visibilidade da barra lateral e do cabeçalho
    set: (newPageName, newShowSideBar, newShowHeader) => {
      setPageName(newPageName ?? pageName);
      setShowSideBar(newShowSideBar ?? showSideBar);
      setShowHeader(newShowHeader ?? showHeader);
    }
  }

  return (
    <Router>
      <div className="container-fluid p-0 bg-blue">
        <div className="d-flex w-100" style={{overflow: "hidden", minHeight:"100vh"}}> {/* Usando flex com min-height */}

          {/* Sidebar */}
          {showSideBar && <SideBar/>}


          <main className="flex-grow-1" style={{overflow: "auto", maxHeight: "100vh"}}> {/* A main ocupará o espaço restante */}
            {/* Header */}
            {showHeader && <Header pageName={pageName}/>}

            <div className="py-4" >
              <Routes>
                <Route path="/" index element={<HomePage pageFunctions={pageFunctions} />} />
                <Route path="/passengers" element={<PassengersPage pageFunctions={pageFunctions}/>} />
                <Route path="/buses" element={<BusesPage pageFunctions={pageFunctions}/>} />
                <Route path="/routes" element={<RoutesPage pageFunctions={pageFunctions}/>} />
                <Route path="/stops" element={<StopsPage pageFunctions={pageFunctions}/>} />
                <Route path="/reports" element={<ReportsPage pageFunctions={pageFunctions}/>} />
                <Route path="/settings" element={<SettingsPage pageFunctions={pageFunctions}/>} />
                <Route path="/login" element={<LoginPage pageFunctions={pageFunctions}/>} />

                <Route path="/search/:searchTerm" element={<SearchPage   />} />
              </Routes>
            </div>
          </main>

        </div>
      </div>
    </Router>
  );
}



export default App
