// Configurações para o componente DetailCard

export const passengerConfig = {
  title: "Detalhes do Passageiro",
  headerIcon: "bi bi-person-fill",
  emptyIcon: "bi bi-person-slash",
  emptyMessage: "Nenhum passageiro selecionado",
  idField: "passageiro_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-person"
    },
    {
      key: "cpf",
      label: "CPF",
      icon: "bi bi-card-text"
    },
    {
      key: "email",
      label: "E-Mail",
      icon: "bi bi-envelope"
    },
    {
      key: "telefone",
      label: "Telefone",
      icon: "bi bi-telephone"
    },
    {
      key: "tipo_passageiro",
      label: "Tipo",
      icon: "bi bi-person-badge"
    }
  ]
};

export const busConfig = {
  title: "Detalhes do Ônibus",
  headerIcon: "bi bi-bus-front-fill",
  emptyIcon: "bi bi-bus-front-fill",
  emptyMessage: "Nenhum ônibus selecionado",
  idField: "onibus_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-info-circle"
    },
    {
      key: "placa",
      label: "Placa",
      icon: "bi bi-card-text"
    },
    {
      key: "modelo",
      label: "Modelo",
      icon: "bi bi-truck"
    },
    {
      key: "marca",
      label: "Marca",
      icon: "bi bi-building"
    },
    {
      key: "ano_fabricacao",
      label: "Ano de Fabricação",
      icon: "bi bi-calendar-event"
    },
    {
      key: "capacidade",
      label: "Capacidade",
      icon: "bi bi-people"
    }
  ]
};

export const routeConfig = {
  title: "Detalhes da Rota",
  headerIcon: "bi bi-signpost-split-fill",
  emptyIcon: "bi bi-signpost-split-fill",
  emptyMessage: "Nenhuma rota selecionada",
  idField: "rota_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-info-circle"
    },
    {
      key: "codigo_rota",
      label: "Código da Rota",
      icon: "bi bi-upc"
    },
    {
      key: "origem_descricao",
      label: "Origem",
      icon: "bi bi-geo-alt"
    },
    {
      key: "destino_descricao",
      label: "Destino",
      icon: "bi bi-geo-alt-fill"
    },
    {
      key: "distancia_km",
      label: "Distância (km)",
      icon: "bi bi-rulers"
    },
    {
      key: "tempo_viagem_estimado_minutos",
      label: "Tempo de Viagem (min)",
      icon: "bi bi-clock"
    }
  ]
};
