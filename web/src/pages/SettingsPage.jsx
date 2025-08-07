import { useRef, useEffect, useState } from "react";
import PopUpComponent from "../components/PopUpComponent";
import { useAuth } from "../context/authContext";
import api from "../api/api";
import Table from "@web/components/Table";


const testTableHeaders = [
  { id: "foo", label: "Foo", sortable: true },
  { id: "bar", label: "Bar", sortable: true },
  { id: "baz", label: "Baz", sortable: false },
]

const testTableData = [
  { 
    foo: ["a","b","c","d"], 
    bar: {
      nome: (<b>teste</b>), 
      idade: 30,
      foo: "bar",
      bar: "baz"
    }, 
    baz: "Valor Normal" 
  }
];


function Settings({ pageFunctions }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const popUpRef = useRef(null);

  useEffect(() => {
    pageFunctions.set("Configurações", true, true);
  }, [pageFunctions]);

  const handleButtonClickForTests = async () => {
    const response = await api.auth.login("admin@admin", "admin");

    if (response) {
      const { token, message, user } = response;
      localStorage.setItem("token", token);
      login(user);
      popUpRef.current.show({
        content: () => message || "Login realizado com sucesso!",
        title: "Login feito com sucesso",
      });
    }
  };

  // Configurações com valores alternáveis
  const [settings, setSettings] = useState([
    { id: 1, name: "Notificações", value: "Ativado" },
    { id: 2, name: "Modo escuro", value: "Desativado" },
    { id: 3, name: "Atualizações", value: "Automático" },
  ]);

  const options = {
    "Notificações": ["Desativado", "Ativado"],
    "Modo escuro": ["Desativado", "Ativado"],
    "Atualizações": ["Manual", "Automático"],
  };

  const changeValue = (id, direction) => {
    const updated = settings.map(setting => {
      if (setting.id === id) {
        const list = options[setting.name];
        let index = list.indexOf(setting.value);
        index = direction === "left" ? (index - 1 + list.length) % list.length : (index + 1) % list.length;
        return { ...setting, value: list[index] };
      }
      return setting;
    });
    setSettings(updated);
  };

  return (
    <main className="ps-3 pe-3 pt-3">

      <div className="card p-3 mb-4">
        {settings.map(setting => (
          <div key={setting.id} className="d-flex align-items-center justify-content-between border-bottom py-2">
            <strong>{setting.name}</strong>
            <div className="d-flex align-items-center gap-2">
              <button onClick={() => changeValue(setting.id, "left")} className="btn btn-sm btn-outline-secondary">
                ◀
              </button>
              <span style={{ width: "100px", textAlign: "center" }}>{setting.value}</span>
              <button onClick={() => changeValue(setting.id, "right")} className="btn btn-sm btn-outline-secondary">
                ▶
              </button>
            </div>
          </div>
        ))}
      </div>  
      
      <Table
        headers={testTableHeaders}
        data={testTableData}
        itemsPerPage={5}
        searchable={true}
        popUpRef={popUpRef}
        className="mb-4"
      />

      <button
        onClick={async ()=>{
          const response = await api.post("/routes/new",{
            nome: "Rota Teste - Centro/Barão Geraldo",
            codigo_rota: "RT001" + Math.random(),
            descricao: "Rota de teste conectando o centro ao distrito de Barão Geraldo",
            status_rota_id: 1, // 1 = Ativa
            ativo: true,
            pontos: [1, 2, 3] // IDs dos pontos: Terminal Central, Ponto Barão Geraldo, Ponto Taquaral
          })
          popUpRef.current.show({
            content: () => <pre>{JSON.stringify(response, null, 2)}</pre>,
            title: "Resposta da API",
          });
        }}
      >
        teste de pontos
      </button>

      <button
        onClick={async ()=>{
          const pontos = await api.routes.getStops(3);
          popUpRef.current.show({
            content: () => <pre>{JSON.stringify(pontos, null, 2)}</pre>,
            title: "Pontos da Rota 3",
          });
        }}
      >
        ver pontos da rota 3
      </button>
      <PopUpComponent ref={popUpRef} />
    </main>


  );
}

export default Settings;