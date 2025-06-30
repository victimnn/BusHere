import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import PopUpComponent from "./components/PopUpComponent";
import Home from "./pages/Home";
import Passengers from "./pages/Passengers";
import Buses from "./pages/Buses";
import RoutesPage from "./pages/RoutesPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import Stops from "./pages/Stops";
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
        <div className="d-flex w-100" style={{overflow: "hidden", height:"100vh"}}> {/* Usando flex */}

          {/* Sidebar */}
          {showSideBar && <SideBar/>}


          <main className="flex-grow-1"> {/* A main ocupará o espaço restante */}
            {/* Header */}
            {showHeader && <Header pageName={pageName}/>}

            <div className="py-4" >
              <Routes>
                <Route path="/" index element={<Home pageFunctions={pageFunctions} />} />
                <Route path="/passengers" element={<Passengers pageFunctions={pageFunctions}/>} />
                <Route path="/buses" element={<Buses pageFunctions={pageFunctions}/>} />
                <Route path="/routes" element={<RoutesPage pageFunctions={pageFunctions}/>} />
                <Route path="/stops" element={<Stops pageFunctions={pageFunctions}/>} />
                <Route path="/reports" element={<Reports pageFunctions={pageFunctions}/>} />
                <Route path="/settings" element={<Settings pageFunctions={pageFunctions}/>} />

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
