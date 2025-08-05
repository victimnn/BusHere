// Configurações para o componente DetailCard
import { formatCPF, formatPhoneNumber, formatPlate, formatDateFromDatabase } from '@shared/formatters';

// Constantes para tipos de passageiro
const PASSENGER_TYPES = {
  1: "Estudante",
  2: "Corporativo"
};

// Formatadores reutilizáveis
export const formatters = {
  cpf: (value) => value ? formatCPF(value) : "Não informado",
  phone: (value) => value ? formatPhoneNumber(value) : "Não informado",
  date: (value) => value ? formatDateFromDatabase(value) : "Não informado",
  dateLocal: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : "Não informado",
  passengerType: (value) => PASSENGER_TYPES[value] || "Não informado",
  coordinates: (value) => value ? Number(value).toFixed(6) : "Não informado",
  kilometers: (value) => value ? `${Number(value).toLocaleString('pt-BR')} km` : "Não informado",
  defaultValue: (value) => value || "Não informado",
  plate: (value) => value ? formatPlate(value) : "Não informado"
};

export const passengerConfig = {
  title: "Detalhes do Passageiro",
  headerIcon: "bi bi-person-fill",
  emptyIcon: "bi bi-person-slash",
  emptyMessage: "Nenhum passageiro selecionado",
  idField: "passageiro_id",
  fields: [
    {
      key: "nome",
      label: "Nome Completo",
      icon: "bi bi-person",
      formatter: formatters.defaultValue
    },
    {
      key: "cpf",
      label: "CPF",
      icon: "bi bi-card-text",
      formatter: formatters.cpf
    },
    {
      key: "email",
      label: "E-mail",
      icon: "bi bi-envelope",
      formatter: formatters.defaultValue
    },
    {
      key: "telefone",
      label: "Telefone",
      icon: "bi bi-telephone",
      formatter: formatters.phone
    },
    {
      key: "data_nascimento",
      label: "Data de Nascimento",
      icon: "bi bi-calendar-event",
      formatter: formatters.date
    },
    {
      key: "data_criacao",
      label: "Data de Cadastro",
      icon: "bi bi-calendar-plus",
      formatter: formatters.date
    },
    {
      key: "tipo_passageiro",
      label: "Tipo de Passageiro",
      icon: "bi bi-person-badge",
      formatter: formatters.defaultValue
    }
  ]
};

export const busConfig = {
  title: "Detalhes do Ônibus",
  headerIcon: "bi bi-bus-front-fill",
  emptyIcon: "bi bi-bus-front",
  emptyMessage: "Nenhum ônibus selecionado",
  idField: "onibus_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-info-circle",
      formatter: formatters.defaultValue
    },
    {
      key: "placa",
      label: "Placa",
      icon: "bi bi-card-text",
      formatter: formatters.plate
    },
    {
      key: "modelo",
      label: "Modelo",
      icon: "bi bi-truck",
      formatter: formatters.defaultValue
    },
    {
      key: "marca",
      label: "Marca",
      icon: "bi bi-building",
      formatter: formatters.defaultValue
    },
    {
      key: "ano_fabricacao",
      label: "Ano de Fabricação",
      icon: "bi bi-calendar-event",
      formatter: formatters.defaultValue
    },
    {
      key: "capacidade",
      label: "Capacidade",
      icon: "bi bi-people",
      formatter: (value) => value ? `${value} passageiros` : "Não informado"
    },
    {
      key: "quilometragem",
      label: "Quilometragem",
      icon: "bi bi-speedometer",
      formatter: formatters.kilometers
    },
    {
      key: "data_ultima_manutencao",
      label: "Última Manutenção",
      icon: "bi bi-wrench",
      formatter: formatters.date
    },
    {
      key: "data_proxima_manutencao",
      label: "Próxima Manutenção",
      icon: "bi bi-calendar-plus",
      formatter: formatters.date
    },
    {
      key: "status",
      label: "Status",
      icon: "bi bi-flag",
      formatter: formatters.defaultValue
    }
  ]
};

export const routeConfig = {
  title: "Detalhes da Rota",
  headerIcon: "bi bi-signpost-split-fill",
  emptyIcon: "bi bi-signpost-split",
  emptyMessage: "Nenhuma rota selecionada",
  idField: "rota_id",
  fields: [
    {
      key: "nome",
      label: "Nome da Rota",
      icon: "bi bi-info-circle",
      formatter: formatters.defaultValue
    },
    {
      key: "codigo_rota",
      label: "Código da Rota",
      icon: "bi bi-upc",
      formatter: formatters.defaultValue
    },
    {
      key: "origem_descricao",
      label: "Origem",
      icon: "bi bi-geo-alt",
      formatter: formatters.defaultValue
    },
    {
      key: "destino_descricao",
      label: "Destino",
      icon: "bi bi-geo-alt-fill",
      formatter: formatters.defaultValue
    },
    {
      key: "distancia_km",
      label: "Distância",
      icon: "bi bi-rulers",
      formatter: (value) => value ? `${value} km` : "Não informado"
    },
    {
      key: "tempo_viagem_estimado_minutos",
      label: "Tempo de Viagem",
      icon: "bi bi-clock",
      formatter: (value) => value ? `${value} minutos` : "Não informado"
    },
    {
      key: "status_nome",
      label: "Status",
      icon: "bi bi-flag",
      formatter: formatters.defaultValue
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
      label: "Nome do Ponto",
      icon: "bi bi-info-circle",
      formatter: formatters.defaultValue
    },
    {
      key: "logradouro",
      label: "Logradouro",
      icon: "bi bi-geo-alt-fill",
      formatter: formatters.defaultValue
    },
    {
      key: "numero_endereco",
      label: "Número",
      icon: "bi bi-house-door",
      formatter: formatters.defaultValue
    },
    {
      key: "bairro",
      label: "Bairro",
      icon: "bi bi-building",
      formatter: formatters.defaultValue
    },
    {
      key: "cidade",
      label: "Cidade",
      icon: "bi bi-building-fill",
      formatter: formatters.defaultValue
    },
    {
      key: "uf",
      label: "UF",
      icon: "bi bi-map",
      formatter: formatters.defaultValue
    },
    {
      key: "cep",
      label: "CEP",
      icon: "bi bi-mailbox",
      formatter: (value) => value ? value.replace(/(\d{5})(\d{3})/, "$1-$2") : "Não informado"
    },
    {
      key: "latitude",
      label: "Latitude",
      icon: "bi bi-geo-alt",
      formatter: formatters.coordinates
    },
    {
      key: "longitude",
      label: "Longitude", 
      icon: "bi bi-geo-alt",
      formatter: formatters.coordinates
    },
    {
      key: "referencia",
      label: "Ponto de Referência",
      icon: "bi bi-signpost",
      formatter: formatters.defaultValue
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
      label: "Nome Completo",
      icon: "bi bi-person",
      formatter: formatters.defaultValue
    },
    {
      key: "cpf",
      label: "CPF",
      icon: "bi bi-card-text",
      formatter: formatters.cpf
    },
    {
      key: "cnh_numero",
      label: "Número da CNH",
      icon: "bi bi-credit-card",
      formatter: formatters.defaultValue
    },
    {
      key: "cnh_categoria",
      label: "Categoria da CNH",
      icon: "bi bi-award",
      formatter: formatters.defaultValue
    },
    {
      key: "cnh_validade",
      label: "Validade da CNH",
      icon: "bi bi-calendar-event",
      formatter: formatters.date
    },
    {
      key: "telefone",
      label: "Telefone",
      icon: "bi bi-telephone",
      formatter: formatters.phone
    },
    {
      key: "email",
      label: "E-mail",
      icon: "bi bi-envelope",
      formatter: formatters.defaultValue
    },
    {
      key: "data_admissao",
      label: "Data de Admissão",
      icon: "bi bi-calendar-plus",
      formatter: formatters.date
    },
    {
      key: "status_nome",
      label: "Status",
      icon: "bi bi-flag",
      formatter: formatters.defaultValue
    }
  ]
};