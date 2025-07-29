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
      icon: "bi bi-card-text",
      formatter: (value) => value ? value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "Não informado"
    },
    {
      key: "email",
      label: "E-Mail",
      icon: "bi bi-envelope"
    },
    {
      key: "telefone",
      label: "Telefone",
      icon: "bi bi-telephone",
      formatter: (value) => value ? value.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3") : "Não informado"
    },
    {
      key: "tipo_passageiro",
      label: "Tipo",
      icon: "bi bi-person-badge",
      formatter: (value) => {
        const types = {
          1: "Estudante",
          2: "Corporativo", 
        };
        return types[value] || "Não informado";
      }
    },
    {
      key: "data_nascimento",
      label: "Data de Nascimento",
      icon: "bi bi-calendar-event",
      formatter: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : "Não informado"
    },
    {
      key: "endereco",
      label: "Endereço",
      icon: "bi bi-geo-alt"
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
    },
    {
      key: "data_proxima_manutencao",
      label: "Próxima Manutenção",
      icon: "bi bi-calendar-plus",
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