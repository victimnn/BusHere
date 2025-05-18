import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import PopUpComponent from "../components/PopUpComponent";
import Home from "./Home";
import Passangers from "./Passangers";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

import "./index.css";
import "../styles/SideBar.css";


function App() {
  return (
    <Router>
      <div className="container-fluid p-0 bg-blue">
        <div className="d-flex w-100"> {/* Usando flex */}

          <SideBar />

          <main className="flex-grow-1"> {/* A main ocupará o espaço restante */}
            <Header 
              pageName={"Giraldi"}/>

            <div className="py-4">
              <Routes>
                <Route path="/" index element={<Home />} />
                <Route path="/passengers" element={<Passangers />} />
              </Routes>
            </div>
          </main>

        </div>
      </div>
    </Router>
  );
}



export default App
