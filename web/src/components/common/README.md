# DetailCard - Componente Genérico de Detalhes

## Descrição
O `DetailCard` é um componente React genérico e reutilizável para exibir detalhes de diferentes entidades (passageiros, ônibus, rotas, etc.) com um layout consistente.

## Uso

### Importação
```jsx
import DetailCard from '../common/DetailCard';
import { passengerConfig, busConfig, routeConfig } from '../common/detailConfigs';
```

### Exemplo de Uso
```jsx
function PassengerDetails({ passenger, onEdit, onDelete }) {
  return (
    <DetailCard 
      item={passenger}
      onEdit={onEdit}
      onDelete={onDelete}
      config={passengerConfig}
    />
  );
}
```

## Props

### DetailCard
- `item` (object): O objeto com os dados a serem exibidos
- `onEdit` (function): Callback para editar o item
- `onDelete` (function): Callback para excluir o item  
- `config` (object): Configuração que define como exibir os dados

### Objeto Config
- `title` (string): Título do card
- `headerIcon` (string): Classe CSS do ícone no cabeçalho
- `emptyIcon` (string): Classe CSS do ícone quando não há item
- `emptyMessage` (string): Mensagem quando não há item selecionado
- `idField` (string): Campo que contém o ID do item
- `fields` (array): Array de objetos com configuração dos campos

### Objeto Field
- `key` (string): Chave do campo no objeto item
- `label` (string): Rótulo a ser exibido
- `icon` (string): Classe CSS do ícone do campo
- `formatter` (function, opcional): Função para formatar o valor

## Configurações Disponíveis

### passengerConfig
Para exibir detalhes de passageiros.

### busConfig  
Para exibir detalhes de ônibus.

### routeConfig
Para exibir detalhes de rotas.

## Criando Nova Configuração

Para criar uma configuração para uma nova entidade:

```jsx
export const minhaConfig = {
  title: "Detalhes da Minha Entidade",
  headerIcon: "bi bi-icon-name",
  emptyIcon: "bi bi-icon-empty",
  emptyMessage: "Nenhuma entidade selecionada",
  idField: "minha_entidade_id",
  fields: [
    {
      key: "nome",
      label: "Nome",
      icon: "bi bi-info-circle"
    },
    {
      key: "data",
      label: "Data",
      icon: "bi bi-calendar",
      formatter: (value) => new Date(value).toLocaleDateString()
    }
  ]
};
```

## Vantagens

1. **Reutilização**: Um único componente para todos os tipos de detalhes
2. **Consistência**: Layout e comportamento padronizados
3. **Manutenibilidade**: Mudanças no layout refletem em todos os usos
4. **Flexibilidade**: Facilmente configurável para novas entidades
5. **Formatação**: Suporte a formatadores customizados para campos específicos

# GenericForm - Componente de Formulários

## Descrição
O `GenericForm` é um componente genérico e reutilizável para criar formulários de diferentes entidades (passageiros, ônibus, rotas, etc.) com validação, formatação e layout consistentes.

## Uso

### Importação
```jsx
import GenericForm from '../common/GenericForm';
import { passengerFormConfig, busFormConfig, routeFormConfig } from '../common/formConfigs';
```

### Exemplo de Uso
```jsx
function PassengerForm({ initialData, onSubmit, onCancel }) {
  return (
    <GenericForm
      config={passengerFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
```

## Props

### GenericForm
- `config` (object): Configuração que define os campos e comportamentos do formulário
- `initialData` (object, opcional): Dados iniciais para edição
- `onSubmit` (function): Callback chamado ao enviar o formulário com os dados
- `onCancel` (function): Callback chamado ao cancelar o formulário

### Objeto Config
- `fields` (array): Array de objetos com configuração dos campos
- `fakeDataGenerator` (function, opcional): Função para gerar dados fictícios

### Objeto Field
#### Propriedades Obrigatórias
- `name` (string): Nome do campo no objeto de dados
- `type` (string): Tipo do campo ('text', 'email', 'number', 'select', 'textarea')
- `label` (string): Rótulo a ser exibido
- `labelIcon` (string): Classe do ícone na label
- `inputIcon` (string): Classe do ícone no input

#### Propriedades Opcionais
- `placeholder` (string): Texto placeholder
- `required` (boolean): Se o campo é obrigatório
- `validator` (function): Função de validação personalizada
- `formatter` (function): Função para formatar o valor
- `maxLength` (number): Comprimento máximo do texto
- `size` (string): Tamanho do campo ('sm', 'lg')
- `alternativeKey` (string): Chave alternativa para buscar valor em initialData

#### Para Campos Select
- `loadOptions` (function): Função async para carregar opções
- `defaultOptions` (array): Opções padrão caso loadOptions falhe
- `optionValue` (string): Campo do objeto que contém o valor da opção
- `optionLabel` (string): Campo do objeto que contém o texto da opção

#### Para Textarea
- `rows` (number): Número de linhas

#### Propriedades Adicionais
- `additionalProps` (object): Props HTML adicionais para o input

## Configurações Disponíveis

### passengerFormConfig
Formulário para passageiros com campos: nome, email, CPF, telefone, tipo de passageiro.

### busFormConfig  
Formulário para ônibus com campos: nome, placa, modelo, marca, ano de fabricação, capacidade, status.

### routeFormConfig
Formulário para rotas com campos: nome, código, origem, destino, distância, tempo de viagem, status.

## Criando Nova Configuração

```jsx
export const minhaEntidadeFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      labelIcon: 'bi bi-info-circle',
      inputIcon: 'bi bi-pencil',
      placeholder: 'Digite o nome',
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome é obrigatório' : null;
      }
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Categoria',
      labelIcon: 'bi bi-tag-fill',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione a categoria',
      required: true,
      loadOptions: () => api.minhaEntidade.getCategorias(),
      defaultOptions: [
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' }
      ],
      optionValue: 'id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Categoria é obrigatória';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeMinhaEntidadeData
};
```

## Funcionalidades

### ✅ **Validação em Tempo Real**
- Validação conforme o usuário digita
- Mensagens de erro customizáveis
- Validação completa no envio

### ✅ **Formatação Automática**
- Formatação de CPF, telefone, etc.
- Aplicada automaticamente durante a digitação

### ✅ **Carregamento de Opções**
- Campos select carregam opções via API
- Fallback para opções padrão em caso de erro

### ✅ **Dados Fictícios**
- Botão "Faker" para preencher com dados de teste
- Útil para desenvolvimento e demonstrações

### ✅ **Layout Responsivo**
- Design consistente com Bootstrap
- Ícones e estilização padronizados

## Vantagens

1. **Reutilização**: Um componente para todos os formulários
2. **Consistência**: Layout e comportamento padronizados  
3. **Manutenibilidade**: Mudanças centralizadas
4. **Flexibilidade**: Altamente configurável
5. **Validação**: Sistema robusto de validação
6. **Formatação**: Suporte nativo a formatadores
7. **Acessibilidade**: Labels e estrutura semântica
