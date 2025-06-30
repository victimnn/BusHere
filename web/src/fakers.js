import { faker } from '@faker-js/faker';
import { formatPhoneNumber } from './utils/formatters';

function createFakePassengerData() {
  function generateValidCPF() {
    function calculateDigit(cpfPart) {
        let sum = 0;
        let multiplier = cpfPart.length + 1;
        for (let i = 0; i < cpfPart.length; i++) {
            sum += parseInt(cpfPart[i]) * multiplier;
            multiplier--;
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
    let cpfNumbers = [];
    for (let i = 0; i < 9; i++) {
        cpfNumbers.push(Math.floor(Math.random() * 10));
    }
    let cpfBase = cpfNumbers.join('');
    const firstDigit = calculateDigit(cpfBase);
    cpfBase += firstDigit;
    const secondDigit = calculateDigit(cpfBase);
    cpfBase += secondDigit; 
    return cpfBase.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return {
    nome: faker.person.fullName(),
    cpf: generateValidCPF(),
    telefone: `(${faker.string.numeric(2)}) ${faker.string.numeric(5)}-${faker.string.numeric(4)}`, // Formato (XX) XXXXX-XXXX
    email: faker.internet.email(),
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
  
  // Gera uma placa brasileira válida (formato antigo ou Mercosul)
  const generateBrazilianLicensePlate = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const isNewFormat = faker.datatype.boolean(); // 50% chance para cada formato
    
    if (isNewFormat) {
      // Formato Mercosul: ABC1D23
      return `${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}`;
    } else {
      // Formato antigo: ABC-1234
      return `${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${letters.charAt(faker.number.int({ min: 0, max: 25 }))}${letters.charAt(faker.number.int({ min: 0, max: 25 }))}-${digits.charAt(faker.number.int({ min: 0, max: 9 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}${digits.charAt(faker.number.int({ min: 0, max: 9 }))}`;
    }
  };
  
  return {
    nome: `Ônibus ${faker.string.numeric(3)}`,
    placa: generateBrazilianLicensePlate(),
    modelo: faker.helpers.arrayElement(models),
    marca: faker.helpers.arrayElement(brands),
    ano_fabricacao: faker.number.int({ min: currentYear - 15, max: currentYear }).toString(),
    capacidade: faker.number.int({ min: 25, max: 80 }).toString(),
    status_onibus_id: faker.helpers.arrayElement(['1', '2', '3'])
  };
}
export {
    createFakePassengerData, createFakeRouteData, createFakeBusData
};
















