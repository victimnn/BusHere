# Refatoração do `PopUpComponent` e Componentes Dependentes

Este documento descreve a refatoração realizada no componente `PopUpComponent` e a subsequente atualização das páginas e componentes que o utilizam dentro do diretório `web`. O objetivo foi modernizar o componente, simplificar sua API e melhorar a performance e a manutenibilidade do código.

## Motivação

A versão anterior do `PopUpComponent` utilizava múltiplos `useState` para controlar sua visibilidade, conteúdo, propriedades e título. Essa abordagem tornava o gerenciamento do estado complexo e propenso a erros. Além disso, a função `show` para exibir o pop-up recebia vários argumentos posicionais, o que dificultava sua utilização e extensibilidade.

## O que mudou?

### 1. `PopUpComponent.jsx`

O componente foi significativamente refatorado para adotar práticas mais modernas de React.

- **Estado Consolidado:** Os estados `isVisible`, `content`, `contentProps` e `title` foram unificados em um único objeto de estado (`modalState`). Isso simplifica as atualizações de estado, tornando-as mais atômicas e previsíveis.
- **API Simplificada:** A função `show`, exposta via `useImperativeHandle`, agora aceita um único objeto de configuração com as chaves `title`, `content` e `props`. Isso torna a chamada mais legível, flexível e fácil de usar.
- **Performance Otimizada:** O componente agora é envolto em `React.memo`, o que previne re-renderizações desnecessárias quando suas props não mudam.
- **Melhor Tratamento de Callbacks:** A função `hide` é passada para o conteúdo do pop-up através das `props`, simplificando o fechamento do modal a partir do componente filho.

#### **Antes:**

```jsx
// Chamada antiga para exibir o pop-up
popUpRef.current.show(
  ({ close }) => <MeuComponente onCancel={close} />, // Argumento 1: Componente
  {}, // Argumento 2: Props
  "Título do Pop-up" // Argumento 3: Título
);
```

#### **Depois:**

```jsx
// Nova chamada para exibir o pop-up
popUpRef.current.show({
  title: "Título do Pop-up",
  content: MeuComponente, // O componente em si
  props: { // As props para o componente
    onCancel: popUpRef.current.hide
  }
});
```

### 2. Atualização das Páginas e Componentes

Todas as páginas e componentes que utilizavam a versão antiga do `PopUpComponent` foram atualizados para se adequar à nova API. As seguintes áreas foram modificadas:

- **Páginas (`src/pages`):**
  - `BusesPage.jsx`
  - `DriversPage.jsx`
  - `HomePage.jsx`
  - `PassengersPage.jsx`
  - `RoutesPage.jsx`
  - `StopsPage.jsx`

- **Componentes de Estatísticas (`src/components`):
  - `buses/BusStatsCards.jsx`
  - `drivers/DriversStatsCards.jsx`
  - `passengers/PassengerStatsCards.jsx`

As chamadas à função `popUpRef.current.show()` em todos esses arquivos foram refatoradas para usar o novo formato de objeto, resultando em um código mais limpo, legível e consistente em toda a aplicação web.
