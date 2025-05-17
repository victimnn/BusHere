import { useRef } from "react";
import PopUpComponent from "../components/PopUpComponent";

//coisas do chartJS
// graficos de pizza
import { Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar os elementos
ChartJS.register(ArcElement, Tooltip, Legend);

function GraficoPizza() {
  const data = {
    labels: ["A", "B", "C", "D"], // Nomes dos dados
    datasets: [{
        label: "Grafico legal",
        data: [Math.random(),Math.random(),Math.random(),Math.random(),], // Valores dos dados
        backgroundColor: [
          "rgb(203, 99, 255)",
          "rgb(255, 207, 86)",
          "rgb(198, 18, 18)",
          "rgb(42, 76, 247)",
        ],
    }],
  }

  const options = {
    resposive: true, // faz o grafico ser responsivo, adaptando ao tamanho da tela
    plugins: {
      legend: { // Legenda
        position: "top", // Posição da legenda
      },
      title: { // Titulo
        display: true, // Exibir o titulo
        text: "Grafico de Pizza", // Texto do titulo
      },
    }
  }

  return (
    <div className="w-50">
      <Pie data={data} options={options} />
    </div>
  )
}

function PopUpContent() {
  return (
    <div className="p-3 bg-blue">
      <h2>Conteúdo do PopUp</h2>
      <p>Este é o conteúdo do PopUp.</p>
    </div>
  );
}

function Home(){
    const popUpRef = useRef(null); // Referência para o componente PopUpComponent
  
    return (
      <main>
        <h1>Home</h1> 
  
        <button
          onClick={() => {
            popUpRef.current.show(GraficoPizza, {}, "Grafico de Pizza"); // Chama a função show do PopUpComponent
          }}
          className="btn btn-primary"
        >
          Abrir PopUp
        </button>
          
        {/* texto com a cor primaria */}
        <p className="text-primary">Texto com a cor primária</p> 


  
        <PopUpComponent 
          ref={popUpRef}
        />
      </main>
    )
  }

export default Home