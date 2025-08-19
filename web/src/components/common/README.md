# Componentes Comuns - Biblioteca de Componentes Reutilizáveis

Esta pasta contém componentes React genéricos e reutilizáveis que podem ser utilizados em toda a aplicação para manter consistência visual e de comportamento.

## 📋 Índice de Componentes

- [ActionButton](#actionbutton---botão-de-ação-genérico)
- [DetailCard](#detailcard---componente-genérico-de-detalhes)
- [ErrorAlert](#erroralert---componente-de-alerta-de-erro)
- [GenericForm](#genericform---componente-de-formulários)
- [LoadingSpinner](#loadingspinner---componente-de-carregamento)
- [Notification](#notification---componente-de-notificação)
- [StatCard](#statcard---componente-de-estatísticas)

---

# ActionButton - Botão de Ação Genérico

## Descrição
O `ActionButton` é um componente de botão reutilizável com suporte a ícones, estados de carregamento e diferentes variantes de estilo.

## Uso

### Importação
```jsx
import ActionButton from '../common/ActionButton';
```

### Exemplo de Uso
```jsx
// Botão básico
<ActionButton
  text="Salvar"
  icon="bi bi-check"
  onClick={handleSave}
/>

// Botão com carregamento
<ActionButton
  text="Enviando"
  icon="bi bi-send"
  loading={isLoading}
  onClick={handleSubmit}
  variant="success"
/>

// Botão de perigo
<ActionButton
  text="Excluir"
  icon="bi bi-trash"
  onClick={handleDelete}
  variant="danger"
  size="sm"
/>
```

## Props

- `onClick` (function, obrigatório): Função chamada ao clicar no botão
- `text` (string, obrigatório): Texto do botão
- `icon` (string): Classe CSS do ícone
- `variant` (string): Variante do botão ('primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary')
- `size` (string): Tamanho do botão ('sm', 'lg')
- `disabled` (boolean): Se o botão está desabilitado
- `loading` (boolean): Se o botão está em estado de carregamento
- `className` (string): Classes CSS adicionais

## Funcionalidades

- ✅ **Estados de Carregamento**: Spinner automático quando `loading=true`
- ✅ **Ícones**: Suporte nativo a ícones Bootstrap
- ✅ **Variantes**: Múltiplas opções de estilo
- ✅ **Acessibilidade**: Estrutura semântica adequada
- ✅ **Performance**: Componente memoizado

---

# ErrorAlert - Componente de Alerta de Erro

## Descrição
O `ErrorAlert` é um componente para exibir mensagens de erro com opções de retry e dismiss.

## Uso

### Importação
```jsx
import ErrorAlert from '../common/ErrorAlert';
```

### Exemplo de Uso
```jsx
// Alerta básico
<ErrorAlert error="Erro ao carregar dados" />

// Alerta com retry
<ErrorAlert 
  error={errorMessage}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>

// Alerta customizado
<ErrorAlert
  error={error}
  variant="warning"
  icon="bi-exclamation-circle-fill"
  onRetry={refetchData}
/>
```

## Props

- `error` (string/object): Mensagem de erro ou objeto de erro
- `onRetry` (function): Callback para tentar novamente
- `onDismiss` (function): Callback para fechar o alerta
- `variant` (string): Tipo do alerta ('danger', 'warning', 'info')
- `icon` (string): Classe do ícone Bootstrap
- `className` (string): Classes CSS adicionais

## Funcionalidades

- ✅ **Flexibilidade**: Aceita string ou objeto de erro
- ✅ **Ações**: Botões de retry e dismiss opcionais
- ✅ **Customização**: Ícones e variantes configuráveis
- ✅ **Layout Responsivo**: Design adaptável

---

# LoadingSpinner - Componente de Carregamento

## Descrição
O `LoadingSpinner` é um componente para exibir indicadores de carregamento com diferentes tamanhos e estilos.

## Uso

### Importação
```jsx
import LoadingSpinner from '../common/LoadingSpinner';
```

### Exemplo de Uso
```jsx
// Spinner padrão
<LoadingSpinner />

// Spinner pequeno
<LoadingSpinner 
  size="small"
  message="Salvando..."
  centered={false}
/>

// Spinner customizado
<LoadingSpinner
  size="large"
  message="Carregando dados..."
  variant="success"
  className="my-3"
/>
```

## Props

- `size` (string): Tamanho do spinner ('small', 'medium', 'large')
- `message` (string): Mensagem de carregamento
- `centered` (boolean): Se deve ser centralizado
- `className` (string): Classes CSS adicionais
- `variant` (string): Cor do spinner (cores Bootstrap)

## Funcionalidades

- ✅ **Tamanhos**: Três opções de tamanho
- ✅ **Centralização**: Opção de centralizar ou alinhar inline
- ✅ **Mensagens**: Texto customizável
- ✅ **Cores**: Suporte a todas as variantes Bootstrap

---

# Notification - Componente de Notificação

## Descrição
O `Notification` é um componente para exibir notificações toast posicionadas no canto da tela.

## Uso

### Importação
```jsx
import Notification from '../common/Notification';
```

### Exemplo de Uso
```jsx
// Notificação de sucesso
<Notification 
  notification={{
    message: "Dados salvos com sucesso!",
    type: "success"
  }}
  onClose={handleClose}
/>

// Notificação de erro
<Notification 
  notification={{
    message: "Erro ao processar solicitação",
    type: "error"
  }}
  onClose={closeNotification}
/>
```

## Props

- `notification` (object): Objeto com `message` e `type`
  - `message` (string): Texto da notificação
  - `type` (string): Tipo ('success', 'error', 'warning', 'info')
- `onClose` (function): Callback para fechar a notificação

## Funcionalidades

- ✅ **Posicionamento**: Fixed no canto superior direito
- ✅ **Tipos**: Success, error, warning, info com ícones apropriados
- ✅ **Auto-dismiss**: Botão de fechar integrado
- ✅ **Responsivo**: Largura adaptável

---

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



# Otimização de Código - StatCard Component

### 🎯 **Principais Otimizações Realizadas:**

1. **Criação de Componente Reutilizável**: 
   - Criado `StatCard.jsx` em `/components/common/` para eliminar duplicação de código

2. **Performance Melhorada**:
   - Uso de `useMemo` para evitar recálculos desnecessários
   - Memoização de dados filtrados e configurações de stats
   - Otimização dos componentes `ListPopup` com hooks de performance

3. **Organização do Código**:
   - Constantes movidas para fora dos componentes
   - Configurações centralizadas em objetos configuráveis
   - Separação clara de responsabilidades

### 📁 **Arquivos Modificados:**

#### ✅ **Novos Arquivos:**
- `src/components/common/StatCard.jsx` - Componente reutilizável

### 🚀 **Benefícios Alcançados:**

1. **Redução de Código Duplicado**: Eliminação de linhas de código duplicado
2. **Melhoria de Performance**: Menos re-renderizações e cálculos desnecessários
3. **Facilidade de Manutenção**: Mudanças no design afetam apenas um arquivo
4. **Consistência Visual**: Garantia de que todos os cards tenham o mesmo comportamento
5. **Flexibilidade**: Componente aceita diferentes layouts (3 ou 4 colunas)

### 🔧 **Como Usar o Novo StatCard:**

```jsx
import StatCard from '../common/StatCard';

// Para relatórios (4 colunas)
<StatCard
  title="Total de Passageiros"
  value={1250}
  iconClass="fas fa-users"
  gradient="linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)"
  className="col-lg-3 col-md-6 mb-4"
/>

// Para motoristas (3 colunas) com clique
<StatCard
  title="Motoristas Ativos" 
  value={85}
  iconClass="bi bi-person-check-fill"
  gradient="linear-gradient(135deg, #12BEA0 0%, #12BE18 100%)"
  onClick={() => showPopup()}
  className="col-lg-4 col-md-6 mb-4"
/>
```

### 📊 **Impacto na Performance:**

- **Antes**: Múltiplos cálculos a cada render
- **Depois**: Cálculos memoizados, re-executados apenas quando necessário
- **Resultado**: Redução significativa de processamento desnecessário

### 🎨 **Compatibilidade:**

- ✅ Mantém toda funcionalidade existente
- ✅ Interface visual idêntica
- ✅ Todos os eventos e interações preservados
- ✅ Responsividade mantida

---

# StatCard - Componente de Estatísticas

## Descrição
O `StatCard` é um componente reutilizável para exibir cartões de estatísticas com animação de contador, ícones e gradientes personalizáveis.

## Uso

### Importação
```jsx
import StatCard from '../common/StatCard';
```

### Exemplo de Uso
```jsx
// Para relatórios (4 colunas)
<StatCard
  title="Total de Passageiros"
  value={1250}
  iconClass="fas fa-users"
  gradient="linear-gradient(135deg, #12BE4D 0%, #0E8F3A 100%)"
  className="col-lg-3 col-md-6 mb-4"
/>

// Para motoristas (3 colunas) com clique
<StatCard
  title="Motoristas Ativos" 
  value={85}
  iconClass="bi bi-person-check-fill"
  gradient="linear-gradient(135deg, #12BEA0 0%, #12BE18 100%)"
  onClick={() => showPopup()}
  className="col-lg-4 col-md-6 mb-4"
/>

// Card clicável para detalhes
<StatCard
  title="Rotas Ativas"
  value={42}
  iconClass="bi bi-geo-alt-fill"
  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)"
  onClick={handleRouteDetails}
/>
```

## Props

- `title` (string, obrigatório): Título do cartão estatístico
- `value` (number, obrigatório): Valor numérico a ser exibido com animação
- `iconClass` (string, obrigatório): Classe CSS do ícone (Bootstrap Icons ou Font Awesome)
- `gradient` (string, obrigatório): Gradiente CSS para o fundo do cartão
- `onClick` (function): Callback para tornar o cartão clicável
- `className` (string): Classes CSS para layout responsivo (padrão: "col-lg-4 col-md-6 mb-4")

## Funcionalidades

- ✅ **Animação de Contador**: Usa `AnimatedCounter` para animar valores
- ✅ **Gradientes Personalizáveis**: Suporte completo a gradientes CSS
- ✅ **Interatividade**: Efeito hover e clique opcional
- ✅ **Layout Flexível**: Configurável para 3 ou 4 colunas
- ✅ **Ícones**: Suporte a Bootstrap Icons e Font Awesome
- ✅ **Performance**: Componente otimizado para re-renderizações

## Vantagens

1. **Reutilização**: Um único componente para todos os cartões de estatística
2. **Consistência**: Layout e comportamento padronizados
3. **Performance**: Memoização e otimizações integradas
4. **Flexibilidade**: Altamente configurável
5. **Animação**: Contadores animados automáticos
6. **Responsividade**: Design adaptável a diferentes telas

## Impacto na Performance

- **Antes**: Múltiplos cálculos a cada render
- **Depois**: Cálculos memoizados, re-executados apenas quando necessário
- **Resultado**: Redução significativa de processamento desnecessário

## Dialog (Componente Unificado)

O componente `Dialog` unifica as funcionalidades dos antigos `AlertDialog` e `ConfirmDialog` em um único componente mais flexível e eficiente.

### Características

- **Modo Alert**: Exibe uma mensagem com um botão (similar ao `window.alert`)
- **Modo Confirm**: Exibe uma mensagem com dois botões (similar ao `window.confirm`)
- **Tipos**: Suporta `info`, `warning`, `danger`, `success`
- **API via Ref**: Acesso programático através de `useRef`
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte a ARIA labels e navegação por teclado

### Uso

#### 1. Importar o componente

```jsx
import { Dialog } from '../components/common';
```

#### 2. Criar uma ref e renderizar o componente

```jsx
const MyComponent = () => {
  const dialogRef = useRef();

  return (
    <div>
      <button onClick={() => dialogRef.current.showAlert({...})}>
        Mostrar Alert
      </button>
      <button onClick={() => dialogRef.current.showConfirm({...})}>
        Mostrar Confirm
      </button>
      
      <Dialog ref={dialogRef} />
    </div>
  );
};
```

### API

#### showAlert(params)

Exibe o dialog no modo alert (um botão).

```jsx
dialogRef.current.showAlert({
  title: 'Sucesso!',
  message: 'Operação realizada com sucesso.',
  type: 'success',
  buttonText: 'Entendi',
  onClose: () => console.log('Dialog fechado')
});
```

**Parâmetros:**
- `title` (string): Título do dialog
- `message` (string): Mensagem do dialog
- `type` (string): Tipo do dialog (`info`, `warning`, `danger`, `success`)
- `buttonText` (string): Texto do botão (padrão: "OK")
- `onClose` (function): Callback executado ao fechar

#### showConfirm(params)

Exibe o dialog no modo confirm (dois botões).

```jsx
dialogRef.current.showConfirm({
  title: 'Confirmar Exclusão',
  message: 'Tem certeza que deseja excluir este item?',
  type: 'danger',
  confirmText: 'Excluir',
  cancelText: 'Cancelar',
  onConfirm: () => deleteItem(),
  onCancel: () => console.log('Operação cancelada')
});
```

**Parâmetros:**
- `title` (string): Título do dialog
- `message` (string): Mensagem do dialog
- `type` (string): Tipo do dialog (`info`, `warning`, `danger`, `success`)
- `confirmText` (string): Texto do botão de confirmação (padrão: "Confirmar")
- `cancelText` (string): Texto do botão de cancelamento (padrão: "Cancelar")
- `onConfirm` (function): Callback executado ao confirmar
- `onCancel` (function): Callback executado ao cancelar

#### hide()

Oculta o dialog programaticamente.

```jsx
dialogRef.current.hide();
```

### Exemplos de Uso

#### Alert de Sucesso

```jsx
dialogRef.current.showAlert({
  title: 'Sucesso!',
  message: 'Dados salvos com sucesso.',
  type: 'success',
  onClose: () => navigate('/dashboard')
});
```

#### Confirmação de Exclusão

```jsx
dialogRef.current.showConfirm({
  title: 'Confirmar Exclusão',
  message: 'Esta ação não pode ser desfeita. Continuar?',
  type: 'danger',
  confirmText: 'Excluir',
  cancelText: 'Cancelar',
  onConfirm: () => {
    deleteItem(id);
    showNotification('Item excluído com sucesso', 'success');
  }
});
```

#### Alert de Aviso

```jsx
dialogRef.current.showAlert({
  title: 'Atenção',
  message: 'Você tem alterações não salvas. Deseja sair mesmo assim?',
  type: 'warning',
  buttonText: 'Entendi'
});
```

### Migração dos Componentes Antigos

#### De AlertDialog para Dialog

**Antes:**
```jsx
const alertRef = useRef();
<AlertDialog ref={alertRef} />
alertRef.current.show({...});
```

**Depois:**
```jsx
const dialogRef = useRef();
<Dialog ref={dialogRef} />
dialogRef.current.showAlert({...});
```

#### De ConfirmDialog para Dialog

**Antes:**
```jsx
const confirmRef = useRef();
<ConfirmDialog ref={confirmRef} />
confirmRef.current.show({...});
```

**Depois:**
```jsx
const dialogRef = useRef();
<Dialog ref={dialogRef} />
dialogRef.current.showConfirm({...});
```

### Vantagens da Unificação

1. **Menos código duplicado**: Um componente em vez de dois
2. **Manutenção simplificada**: Mudanças em um lugar só
3. **Consistência visual**: Mesmo estilo e comportamento
4. **Flexibilidade**: Pode alternar entre modos conforme necessário
5. **Performance**: Menos componentes para o React gerenciar

### Estilos CSS

O componente usa as classes CSS existentes:
- `.alert-dialog` e `.confirm-dialog` para o container
- `.alert-success`, `.alert-warning`, `.alert-danger`, `.alert-info` para tipos
- `.confirm-success`, `.confirm-warning`, `.confirm-danger`, `.confirm-info` para tipos

### Notas de Implementação

- O componente usa `forwardRef` para expor a API via ref
- Implementa `memo` para otimização de performance
- Gerencia automaticamente as classes CSS do body (`modal-open`)
- Suporta navegação por teclado (ESC para fechar)
- Responsivo e acessível por padrão
