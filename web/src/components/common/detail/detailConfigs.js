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
    },
    {
      key: "quilometragem",
      label: "Quilometragem (km)",
      icon: "bi bi-speedometer",
      formatter: (value) => value ? `${Number(value).toLocaleString('pt-BR')} km` : "Não informado"
    },
    {
      key: "data_ultima_manutencao",
      label: "Última Manutenção",
      icon: "bi bi-wrench",
      formatter: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : "Não informado"
    },
    {
      key: "data_proxima_manutencao",
      label: "Próxima Manutenção",
      icon: "bi bi-calendar-plus",
      formatter: (value) => {
        if (!value) return "Não informado";
        const date = new Date(value);
        const today = new Date();
        const isOverdue = date < today;
        const formattedDate = date.toLocaleDateString('pt-BR');
        return isOverdue ? `${formattedDate} (ATRASADA)` : formattedDate;
      }
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

export const stopConfig = {
  title: "Detalhes do Ponto",
  headerIcon: "bi bi-geo-alt-fill",
  emptyIcon: "bi bi-geo-alt",
  emptyMessage: "Nenhum ponto selecionado",
  idField: "ponto_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-info-circle"
    },
    {
      key: "logradouro",
      label: "Logradouro",
      icon: "'bi bi-geo-alt-fill'"
    },
    {
      key: "numero_endereco",
      label: "Número",
      icon: "bi bi-house-door"
    },
    {
      key: "bairro",
      label: "Bairro",
      icon: "bi bi-building"
    },
    {
      key: "cidade",
      label: "Cidade",
      icon: "bi bi-building-fill"
    },
    {
      key: "uf",
      label: "UF",
      icon: "bi bi-map"
    },
    {
      key: "cep",
      label: "CEP",
      icon: "bi bi-mailbox"
    },
    {
      key: "latitude",
      label: "Latitude",
      icon: "bi bi-geo-alt",
      formatter: (value) => value ? Number(value).toFixed(6) : "Não informado"
    },
    {
      key: "longitude",
      label: "Longitude", 
      icon: "bi bi-geo-alt",
      formatter: (value) => value ? Number(value).toFixed(6) : "Não informado"
    },
    {
      key: "referencia",
      label: "Referência",
      icon: "bi bi-signpost"
    }
  ]
};

export const driverConfig = {
  title: "Detalhes do Motorista",
  headerIcon: "bi bi-person-fill-gear",
  emptyIcon: "bi bi-person-slash",
  emptyMessage: "Nenhum motorista selecionado",
  idField: "motorista_id",
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
      key: "cnh_numero",
      label: "Número da CNH",
      icon: "bi bi-credit-card"
    },
    {
      key: "cnh_categoria",
      label: "Categoria da CNH",
      icon: "bi bi-award"
    },
    {
      key: "cnh_validade",
      label: "Validade da CNH",
      icon: "bi bi-calendar-event",
      formatter: (value) => {
        if (!value) return "Não informado";
        const date = new Date(value);
        const today = new Date();
        const isExpired = date <= today;
        const formattedDate = date.toLocaleDateString('pt-BR');
        return isExpired ? `${formattedDate} (VENCIDA)` : formattedDate;
      }
    },
    {
      key: "telefone",
      label: "Telefone",
      icon: "bi bi-telephone"
    },
    {
      key: "email",
      label: "E-mail",
      icon: "bi bi-envelope"
    },
    {
      key: "data_admissao",
      label: "Data de Admissão",
      icon: "bi bi-calendar-plus",
      formatter: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : "Não informado"
    },
    {
      key: "status_nome",
      label: "Status",
      icon: "bi bi-flag",
      formatter: (value) => value || "Não informado"
    }
  ]
};