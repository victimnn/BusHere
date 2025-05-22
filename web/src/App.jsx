import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import PopUpComponent from "./components/PopUpComponent";
import Home from "./pages/Home";
import Passangers from "./pages/Passangers";
import Buses from "./pages/Buses";
import RoutesPage from "./pages/RoutesPage";
import Points from "./pages/Points";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <div className="container-fluid p-0 bg-blue">
        <div className="d-flex w-100"> {/* Usando flex */}

          <SideBar />

          <main className="flex-grow-1"> {/* A main ocupará o espaço restante */}
            <Header 
              pageName={"Giraldi"}/>

            <div className="py-4" >
              <Routes>
                <Route path="/" index element={<Home />} />
                <Route path="/passengers" element={<Passangers />} />
                <Route path="/buses" element={<Buses />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/points" element={<Points />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />

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
