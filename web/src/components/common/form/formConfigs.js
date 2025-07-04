// Configurações para o componente GenericForm
import api from '../../../api/api';
import { validateCPF, validateEmail, validatePhoneNumber } from '../../../utils/validators';
import { formatCPF, formatPhoneNumber } from '../../../utils/formatters';
import { createFakePassengerData, createFakeBusData, createFakeRouteData, createFakeStopData } from '../../../utils/fakers';

export const passengerFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      labelIcon: 'bi bi-person-fill',
      inputIcon: 'bi bi-person',
      placeholder: 'Nome completo',
      maxLength: 255,
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome é obrigatório' : null;
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      labelIcon: 'bi bi-envelope-fill',
      inputIcon: 'bi bi-envelope',
      placeholder: 'email@exemplo.com',
      maxLength: 255,
      required: true,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return 'E-mail é obrigatório';
        if (!validateEmail(value)) return 'E-mail inválido';
        return null;
      }
    },
    {
      name: 'cpf',
      type: 'text',
      label: 'CPF',
      labelIcon: 'bi bi-card-text',
      inputIcon: 'bi bi-123',
      placeholder: '000.000.000-00',
      maxLength: 14,
      required: true,
      size: 'lg',
      formatter: formatCPF,
      validator: (value) => {
        if (!value.trim()) return 'CPF é obrigatório';
        if (!validateCPF(value)) return 'CPF inválido';
        return null;
      }
    },
    {
      name: 'telefone',
      type: 'text',
      label: 'Telefone',
      labelIcon: 'bi bi-telephone-fill',
      inputIcon: 'bi bi-telephone',
      placeholder: '(00) 00000-0000',
      maxLength: 15,
      size: 'lg',
      formatter: formatPhoneNumber,
      validator: (value) => {
        if (value && !validatePhoneNumber(value)) return 'Formato: (00) 00000-0000';
        return null;
      }
    },
    {
      name: 'tipo_passageiro',
      alternativeKey: 'tipo_passageiro_id',
      type: 'select',
      label: 'Tipo de Passageiro',
      labelIcon: 'bi bi-person-badge-fill',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o tipo de passageiro',
      required: true,
      size: 'lg',
      loadOptions: () => api.passengers.getTypes(),
      defaultOptions: [
        { tipo_passageiro_id: 1, nome: 'Estudante', descricao: 'Passageiro estudante' },
        { tipo_passageiro_id: 2, nome: 'Corporativo', descricao: 'Passageiro corporativo' }
      ],
      optionValue: 'tipo_passageiro_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Tipo de passageiro é obrigatório';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakePassengerData
};

export const busFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome do Ônibus',
      labelIcon: 'bi bi-bus-front-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome identificador do ônibus',
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome do ônibus é obrigatório' : null;
      }
    },
    {
      name: 'placa',
      type: 'text',
      label: 'Placa',
      labelIcon: 'bi bi-card-text',
      inputIcon: 'bi bi-signpost',
      placeholder: 'ABC-1234 ou ABC1D23',
      maxLength: 8,
      required: true,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return 'Placa é obrigatória';
        const placaRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
        if (!placaRegex.test(value.toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
          return 'Formato de placa inválido (ex: ABC-1234 ou ABC1D23)';
        }
        return null;
      }
    },
    {
      name: 'modelo',
      type: 'text',
      label: 'Modelo',
      labelIcon: 'bi bi-truck',
      inputIcon: 'bi bi-gear',
      placeholder: 'Modelo do ônibus',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Modelo deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'marca',
      type: 'text',
      label: 'Marca',
      labelIcon: 'bi bi-building',
      inputIcon: 'bi bi-award',
      placeholder: 'Marca do ônibus',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Marca deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'ano_fabricacao',
      type: 'number',
      label: 'Ano de Fabricação',
      labelIcon: 'bi bi-calendar-event',
      inputIcon: 'bi bi-calendar',
      placeholder: 'Ano de fabricação',
      additionalProps: { max: new Date().getFullYear() + 1, min: 1950 },
      size: 'lg',
      validator: (value) => {
        if (value === '') return null;
        const currentYear = new Date().getFullYear();
        const ano = parseInt(value);
        if (isNaN(ano)) return 'Ano deve ser um número';
        if (ano < 1950) return 'Ano deve ser maior que 1950';
        if (ano > currentYear + 1) return `Ano não pode ser maior que ${currentYear + 1}`;
        if (value.length > 4) return 'Ano deve ter no máximo 4 dígitos';
        return null;
      }
    },
    {
      name: 'capacidade',
      type: 'number',
      label: 'Capacidade',
      labelIcon: 'bi bi-people',
      inputIcon: 'bi bi-person-plus',
      placeholder: 'Número de passageiros',
      additionalProps: { max: 200, min: 1 },
      required: true,
      size: 'lg',
      validator: (value) => {
        if (value === '') return 'Capacidade é obrigatória';
        const capacidade = parseInt(value);
        if (isNaN(capacidade)) return 'Capacidade deve ser um número';
        if (capacidade < 1) return 'Capacidade deve ser maior que zero';
        if (capacidade > 200) return 'Capacidade deve ser menor que 200';
        if (value.length > 3) return 'Capacidade deve ter no máximo 3 dígitos';
        return null;
      }
    },
    {
      name: 'status_onibus_id',
      type: 'select',
      label: 'Status',
      labelIcon: 'bi bi-check2-circle',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o status',
      required: true,
      size: 'lg',
      loadOptions: () => api.buses.getStatus(),
      defaultOptions: [
        { status_onibus_id: 1, nome: 'Em Operação', descricao: 'Ônibus ativo e em circulação' },
        { status_onibus_id: 2, nome: 'Em Manutenção', descricao: 'Ônibus em manutenção preventiva ou corretiva' },
        { status_onibus_id: 3, nome: 'Inativo', descricao: 'Ônibus temporariamente fora de operação' }
      ],
      optionValue: 'status_onibus_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Status é obrigatório';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeBusData
};

export const routeFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome da Rota',
      labelIcon: 'bi bi-signpost-split-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome identificador da rota',
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome da rota é obrigatório' : null;
      }
    },
    {
      name: 'codigo_rota',
      type: 'text',
      label: 'Código da Rota',
      labelIcon: 'bi bi-upc',
      inputIcon: 'bi bi-hash',
      placeholder: 'Código único da rota',
      required: true,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return 'Código da rota é obrigatório';
        if (value.length < 3) return 'Código deve ter pelo menos 3 caracteres';
        return null;
      }
    },
    {
      name: 'origem_descricao',
      type: 'text',
      label: 'Origem',
      labelIcon: 'bi bi-geo-alt',
      inputIcon: 'bi bi-pin-map',
      placeholder: 'Descrição do ponto de origem',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 5 ? 'Descrição da origem deve ter pelo menos 5 caracteres' : null;
      }
    },
    {
      name: 'destino_descricao',
      type: 'text',
      label: 'Destino',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-pin-map-fill',
      placeholder: 'Descrição do ponto de destino',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 5 ? 'Descrição do destino deve ter pelo menos 5 caracteres' : null;
      }
    },
    {
      name: 'distancia_km',
      type: 'number',
      label: 'Distância (km)',
      labelIcon: 'bi bi-rulers',
      inputIcon: 'bi bi-speedometer',
      placeholder: 'Distância em quilômetros',
      additionalProps: { step: '0.1', min: '0', max: '999.9' },
      size: 'lg',
      validator: (value) => {
        if (value === '') return null;
        const distancia = parseFloat(value);
        if (isNaN(distancia)) return 'Distância deve ser um número';
        if (distancia <= 0) return 'Distância deve ser maior que zero';
        if (distancia > 1000) return 'Distância deve ser menor que 1000 km';
        return null;
      }
    },
    {
      name: 'tempo_viagem_estimado_minutos',
      type: 'number',
      label: 'Tempo de Viagem (min)',
      labelIcon: 'bi bi-clock',
      inputIcon: 'bi bi-stopwatch',
      placeholder: 'Tempo estimado em minutos',
      additionalProps: { min: '0', max: '1440' },
      size: 'lg',
      validator: (value) => {
        if (value === '') return null;
        const tempo = parseInt(value);
        if (isNaN(tempo)) return 'Tempo deve ser um número inteiro';
        if (tempo <= 0) return 'Tempo deve ser maior que zero';
        if (tempo > 1440) return 'Tempo deve ser menor que 24 horas (1440 min)';
        return null;
      }
    },
    {
      name: 'status_rota_id',
      type: 'select',
      label: 'Status da Rota',
      labelIcon: 'bi bi-check2-circle',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o status',
      required: true,
      size: 'lg',
      loadOptions: () => api.routes.getStatus(),
      defaultOptions: [
        { status_rota_id: 1, nome: 'Ativa', descricao: 'Rota ativa e em funcionamento' },
        { status_rota_id: 2, nome: 'Inativa', descricao: 'Rota temporariamente inativa' },
        { status_rota_id: 3, nome: 'Em Planejamento', descricao: 'Rota em fase de planejamento' }
      ],
      optionValue: 'status_rota_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Status da rota é obrigatório';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeRouteData
};

export const stopFormConfig = {
  fields: [
    {
      name: 'latitude',
      type: 'hidden'
    },
    {
      name: 'longitude',
      type: 'hidden'
    },
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome da parada',
      maxLength: 255,
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome é obrigatório' : null;
      }
    },
    {
      name: 'logradouro',
      type: 'text',
      label: 'Logradouro',
      labelIcon: 'bi bi-house-fill',
      inputIcon: 'bi bi-geo',
      placeholder: 'Nome da rua/avenida',
      maxLength: 255,
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Logradouro deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'numero_endereco',
      type: 'text',
      label: 'Número do Endereço',
      labelIcon: 'bi bi-123',
      inputIcon: 'bi bi-hash',
      placeholder: 'Número do endereço',
      maxLength: 10,
      size: 'lg'
    },
    {
      name: 'bairro',
      type: 'text',
      label: 'Bairro',
      labelIcon: 'bi bi-building',
      inputIcon: 'bi bi-buildings',
      placeholder: 'Nome do bairro',
      maxLength: 100,
      size: 'lg'
    },
    {
      name: 'cidade',
      type: 'text',
      label: 'Cidade',
      labelIcon: 'bi bi-geo-alt',
      inputIcon: 'bi bi-building',
      placeholder: 'Nome da cidade',
      maxLength: 100,
      size: 'lg'
    },
    {
      name: 'uf',
      type: 'text',
      label: 'UF',
      labelIcon: 'bi bi-flag',
      inputIcon: 'bi bi-flag',
      placeholder: 'Estado (ex: SP)',
      maxLength: 2,
      size: 'lg',
      validator: (value) => {
        if (value.trim() && value.length !== 2) return 'UF deve ter exatamente 2 caracteres';
        return null;
      }
    },
    {
      name: 'cep',
      type: 'text',
      label: 'CEP',
      labelIcon: 'bi bi-mailbox',
      inputIcon: 'bi bi-envelope',
      placeholder: '00000-000',
      maxLength: 9,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return null;
        const cepRegex = /^\d{5}-?\d{3}$/;
        if (!cepRegex.test(value)) return 'CEP deve ter o formato 00000-000';
        return null;
      }
    },
    {
      name: 'referencia',
      type: 'text',
      label: 'Referência',
      labelIcon: 'bi bi-bookmark',
      inputIcon: 'bi bi-bookmark',
      placeholder: 'Ponto de referência',
      maxLength: 255,      size: 'lg'
    }
  ],
  fakeDataGenerator: createFakeStopData
};
