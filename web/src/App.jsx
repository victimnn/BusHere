import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import { AuthProvider } from "./context/authContext";
import PopUpComponent from "./components/ui/PopUpComponent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PassengersPage from "./pages/PassengersPage";
import DriversPage from "./pages/DriversPage";
import BusesPage from "./pages/BusesPage";
import RoutesPage from "./pages/RoutesPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import StopsPage from "./pages/StopsPage";

import BusDetail from "./pages/details/BusDetail";
import PassengerDetail from "./pages/details/PassengerDetail";
import DriverDetail from "./pages/details/DriverDetail";
import RouteDetail from "./pages/details/RouteDetail";
import StopDetail from "./pages/details/StopDetail";
import RouteStopsPage from "./pages/RouteStopsPage";

import SideBar from "./components/ui/SideBar";
import Header from "./components/ui/Header";

function App({ isDark, setIsDark }) {
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
      <AuthProvider>
        <div>
          <div className="d-flex w-100" style={{overflow: "hidden", height:"100vh"}}> {/* Usando flex com height fixo */}

            {/* Sidebar */}
            {showSideBar && <SideBar/>}


            <main className="flex-grow-1 d-flex flex-column" style={{overflow: "auto", height: "100vh"}}> {/* A main ocupará o espaço restante */}
              {/* Header */}
              {showHeader && <Header pageName={pageName}/>}

              <div className="py-0 w-100 flex-grow-1" style={{minHeight: "0"}}>
                <Routes>
                  <Route path="/" index element={<HomePage pageFunctions={pageFunctions} />} />
                  <Route path="/passengers" element={<PassengersPage pageFunctions={pageFunctions}/>} />
                  <Route path="/drivers" element={<DriversPage pageFunctions={pageFunctions}/>} />
                  <Route path="/buses" element={<BusesPage pageFunctions={pageFunctions}/>} />
                  <Route path="/routes" element={<RoutesPage pageFunctions={pageFunctions}/>} />
                  <Route path="/stops" element={<StopsPage pageFunctions={pageFunctions}/>} />
                  <Route path="/reports" element={<ReportsPage pageFunctions={pageFunctions}/>} />
                  <Route path="/settings" element={<SettingsPage pageFunctions={pageFunctions} isDark={isDark} setIsDark={setIsDark}/>} />
                  <Route path="/login" element={<LoginPage pageFunctions={pageFunctions}/>} />
                  <Route path="/register" element={<RegisterPage pageFunctions={pageFunctions}/>} />

                  <Route path="/buses/:busId" element={<BusDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/passengers/:passengerId" element={<PassengerDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/drivers/:driverId" element={<DriverDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/routes/:routeId" element={<RouteDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/stops/:stopId" element={<StopDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/routes/new" element={<RouteStopsPage pageFunctions={pageFunctions}/>} />
                  <Route path="/routes/:routeId/edit" element={<RouteStopsPage pageFunctions={pageFunctions}/>} />

                  <Route path="/search/:searchTerm" element={<SearchPage pageFunctions={pageFunctions}  />} />
                </Routes>
              </div>
            </main>

          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}



export default App
