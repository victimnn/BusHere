import { useRef, useEffect } from "react";

function Home({ pageFunctions }) {
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
    useEffect(() => {
    pageFunctions.set("Início", true, true);
  }, []);

    return (
      <main>
        <h1>Início</h1> 
        <p>Bem-vindo ao BusHere!</p>
      </main>
    )
  }

export default Home