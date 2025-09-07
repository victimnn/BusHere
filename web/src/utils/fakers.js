import { faker } from '@faker-js/faker';
import { generateBirthDate, generateAdmissionDate, generateCNHValidityDate, generateLastMaintenanceDate, generateNextMaintenanceDate, generateKilometers, generateBrazilianLicensePlate, generateValidCPF, generateCNH } from '@shared/fakeDataGenerators';
import { formatPhoneNumber } from '@shared/formatters';

function createFakePassengerData() {
  return {
    nome: faker.person.fullName(),
    cpf: generateValidCPF(),
    telefone: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`, // Formato (XX) XXXXX-XXXX
    email: faker.internet.email(),
    data_nascimento: generateBirthDate(),
    tipo_passageiro: faker.helpers.arrayElement(['1', '2'])
  }
}

function createFakeRouteData() {
  // Cidades e suas respectivas instituições de ensino
  const cidadesInstituicoes = {
    'Amparo': ['ETEC João Belarmino', 'UNIFIA', 'SENAI'],
    'Jaguariúna': ['UNIFAJ', 'ETEC Jaguariúna', 'SENAI'],
    'Campinas': ['PUC', 'UNICAMP', 'Faculdade Anhanguera']
  };
  
  // Pontos de origem nas cidades
  const pontosPorCidade = {
    'Amparo': ['Centro', 'Rodoviária', 'Três Pontes', 'Igreja Matriz', 'São Dimas'],
    'Jaguariúna': ['Centro', 'Rodoviária', 'UPA', 'Roseira de Cima', 'Roseira de Baixo', 'Igreja Matriz', 'Parque dos Lagos'],
    'Pedreira': ['Centro', 'Rodoviária', 'UPA'],
    'Serra Negra': ['Centro', 'Rodoviária']
  };
  
  // Seleciona uma cidade de origem
  const cidadesDisponiveis = Object.keys(cidadesInstituicoes);
  const cidadeOrigem = faker.helpers.arrayElement(cidadesDisponiveis);
  
  // Seleciona uma cidade de destino diferente da origem
  const cidadesDestino = cidadesDisponiveis.filter(cidade => cidade !== cidadeOrigem);
  const cidadeDestino = faker.helpers.arrayElement(cidadesDestino);
  
  // Seleciona um ponto de origem na cidade de origem
  const pontoOrigem = faker.helpers.arrayElement(pontosPorCidade[cidadeOrigem]);
  
  // Seleciona uma instituição de ensino na cidade de destino
  const instituicaoDestino = faker.helpers.arrayElement(cidadesInstituicoes[cidadeDestino]);
  
  // Gera código de rota brasileiro típico
  const generateRouteCode = () => {
    const formats = [
      () => `L${faker.string.numeric(3)}`, // L001, L234
      () => `R${faker.string.numeric(3)}`, // R001, R456  
      () => `${faker.string.numeric(3)}${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}`, // 001A, 123B
      () => `LINHA-${faker.string.numeric(2)}`, // LINHA-01, LINHA-15
      () => `${faker.helpers.arrayElement(['CENTRO', 'TERMINAL', 'EXPRESSO'])}-${faker.string.numeric(2)}` // CENTRO-01, TERMINAL-05
    ];
    
    return faker.helpers.arrayElement(formats)();
  };
  
  // Calcula tempo estimado baseado na distância (aproximadamente 30-40 km/h média urbana)
  const distancia = faker.number.float({ min: 5, max: 50, fractionDigits: 1 });
  const velocidadeMedia = faker.number.int({ min: 25, max: 40 }); // km/h
  const tempoEstimado = Math.round((distancia / velocidadeMedia) * 60); // em minutos
  
  return {
    nome: `${cidadeOrigem} - ${cidadeDestino}`,
    codigo_rota: generateRouteCode(),
    origem_descricao: `${pontoOrigem}, ${cidadeOrigem}`,
    destino_descricao: `${instituicaoDestino}, ${cidadeDestino}`,
    distancia_km: distancia.toString(),
    tempo_viagem_estimado_minutos: tempoEstimado.toString(),
    status_rota_id: faker.helpers.arrayElement(['1', '2', '3'])
  };
}

function createFakeBusData() {
  const currentYear = new Date().getFullYear();
  const brands = ['Mercedes-Benz', 'Volvo', 'Scania', 'Volkswagen', 'Iveco'];
  const models = ['O500', 'B270F', 'K310', 'Volksbus', 'CityClass'];
  
  return {
    nome: `Ônibus ${faker.string.numeric(3)}`,
    placa: generateBrazilianLicensePlate(),
    modelo: faker.helpers.arrayElement(models),
    marca: faker.helpers.arrayElement(brands),
    ano_fabricacao: faker.number.int({ min: currentYear - 15, max: currentYear }).toString(),
    capacidade: faker.number.int({ min: 25, max: 80 }).toString(),
    quilometragem: generateKilometers(50000, 800000),
    data_ultima_manutencao: generateLastMaintenanceDate(),
    data_proxima_manutencao: generateNextMaintenanceDate(),
    status_onibus_id: faker.helpers.arrayElement(['1', '2', '3'])
  };
}

function createFakeStopData() {
  // Cidades da região de Campinas
  const cidades = ['Campinas', 'Amparo', 'Jaguariúna', 'Pedreira', 'Serra Negra', 'Itapira', 'Mogi Mirim'];
  
  // Tipos de paradas comuns
  const tiposParada = [
    'Terminal', 'Rodoviária', 'Centro', 'Igreja', 'Escola', 'Faculdade', 
    'Hospital', 'UPA', 'Parque', 'Shopping', 'Estação', 'Posto'
  ];
  
  // Logradouros típicos brasileiros
  const tiposLogradouro = ['Rua', 'Avenida', 'Praça', 'Alameda', 'Travessa'];
  const nomesLogradouro = [
    'das Flores', 'São João', 'Central', 'da Independência', 'XV de Novembro',
    'Getúlio Vargas', 'Dom Pedro II', 'da República', 'Santos Dumont', 'José Bonifácio',
    'Tiradentes', 'Major Souto', 'Cel. Silva', 'Dr. Campos', 'Irmã Dulce'
  ];
  
  // Bairros típicos
  const bairros = [
    'Centro', 'Vila Nova', 'Jardim América', 'Parque das Nações', 'Vila São João',
    'Jardim Europa', 'Vila Industrial', 'Centro Histórico', 'Jardim das Flores',
    'Vila Santa Maria', 'Parque São José', 'Jardim Paulista'
  ];
  
  // Gera CEP válido para região de Campinas (13000-000 a 13999-999)
  const generateCEP = () => {
    const firstPart = faker.number.int({ min: 13000, max: 13999 });
    const secondPart = faker.string.numeric(3);
    return `${firstPart}-${secondPart}`;
  };
  
  // Gera coordenadas próximas à região de Campinas
  const generateCoordinates = () => {
    // Região de Campinas: lat aproximadamente -22.9 a -22.5, lng aproximadamente -47.2 a -46.8
    const latitude = faker.number.float({ min: -22.95, max: -22.45, fractionDigits: 8 });
    const longitude = faker.number.float({ min: -47.25, max: -46.75, fractionDigits: 8 });
    return { latitude, longitude };
  };
  
  const cidade = faker.helpers.arrayElement(cidades);
  const tipoParada = faker.helpers.arrayElement(tiposParada);
  const tipoLog = faker.helpers.arrayElement(tiposLogradouro);
  const nomeLog = faker.helpers.arrayElement(nomesLogradouro);
  const coordinates = generateCoordinates();
  
  return {
    latitude: coordinates.latitude.toString(),
    longitude: coordinates.longitude.toString(),
    nome: `${tipoParada} ${cidade === 'Campinas' ? faker.helpers.arrayElement(['Norte', 'Sul', 'Central', 'Leste', 'Oeste']) : cidade}`,
    logradouro: `${tipoLog} ${nomeLog}`,
    numero_endereco: faker.number.int({ min: 1, max: 9999 }).toString(),
    bairro: faker.helpers.arrayElement(bairros),
    cidade: cidade,
    uf: 'SP',
    cep: generateCEP(),
    referencia: faker.helpers.arrayElement([
      'Próximo ao banco',
      'Em frente à farmácia',
      'Ao lado da padaria',
      'Esquina com a praça',
      'Próximo ao posto de gasolina',
      'Em frente ao supermercado',
      'Ao lado da igreja',
      '',
      '',
      ''
    ])
  };
}

function createFakeDriverData() {
  return {
    nome: faker.person.fullName(),
    cpf: generateValidCPF(),
    cnh_numero: generateCNH(),
    cnh_categoria: faker.helpers.arrayElement(['D', 'AD', 'AE']), // Categorias apropriadas para ônibus
    cnh_validade: generateCNHValidityDate(),
    telefone: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`,
    email: faker.internet.email(),
    data_admissao: generateAdmissionDate(),
    status_motorista_id: faker.helpers.arrayElement(['1', '2', '3', '4']) // Ativo, Férias, Afastado, Inativo
  };
}

function createFakeVehicleData() {
  const currentYear = new Date().getFullYear();
  const brands = ['Mercedes-Benz', 'Volvo', 'Scania', 'Volkswagen', 'Iveco', 'Ford', 'Chevrolet'];
  const models = ['O500', 'B270F', 'K310', 'Volksbus', 'CityClass', 'Sprinter', 'Master'];
  const vehicleTypes = [
    { tipo_veiculo_id: 1, nome: 'Ônibus' },
    { tipo_veiculo_id: 2, nome: 'Micro-ônibus' },
    { tipo_veiculo_id: 3, nome: 'Van' }
  ];

  const vehicleType = faker.helpers.arrayElement(vehicleTypes);
  
  // Ajusta capacidade baseada no tipo de veículo
  let capacidade;
  switch (vehicleType.tipo_veiculo_id) {
    case 1: // Ônibus
      capacidade = faker.number.int({ min: 40, max: 80 });
      break;
    case 2: // Micro-ônibus
      capacidade = faker.number.int({ min: 15, max: 30 });
      break;
    case 3: // Van
      capacidade = faker.number.int({ min: 8, max: 15 });
      break;
    default:
      capacidade = faker.number.int({ min: 8, max: 80 });
  }
  
  return {
    nome: `${vehicleType.nome} ${faker.string.numeric(3)}`,
    placa: generateBrazilianLicensePlate(),
    tipo_veiculo_id: vehicleType.tipo_veiculo_id.toString(),
    modelo: faker.helpers.arrayElement(models),
    marca: faker.helpers.arrayElement(brands),
    ano_fabricacao: faker.number.int({ min: currentYear - 15, max: currentYear }).toString(),
    capacidade: capacidade.toString(),
    quilometragem: generateKilometers(10000, 500000),
    data_ultima_manutencao: generateLastMaintenanceDate(),
    data_proxima_manutencao: generateNextMaintenanceDate(),
    status_veiculo_id: faker.helpers.arrayElement(['1', '2', '3'])
  };
}

export {
    createFakePassengerData, createFakeRouteData, createFakeBusData, createFakeStopData, createFakeDriverData, createFakeVehicleData
};
















