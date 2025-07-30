# Componentes Reutilizáveis para Páginas de Detalhes

Este conjunto de componentes foi criado para fornecer uma base consistente e reutilizável para páginas de detalhes de diferentes objetos no sistema.

## Componentes Disponíveis

### 1. DetailPage
Componente principal que envolve toda a página e gerencia estados de loading e erro.

```jsx
import { DetailPage } from '@web/components/details';

<DetailPage loading={loading} error={error} onRetry={refetch}>
  {/* Conteúdo da página */}
</DetailPage>
```

**Props:**
- `loading` (boolean): Estado de carregamento
- `error` (string): Mensagem de erro, se houver
- `onRetry` (function): Função para tentar novamente em caso de erro
- `className` (string): Classes CSS adicionais

### 2. DetailHeader
Cabeçalho da página com título, ícone e badges.

```jsx
import { DetailHeader } from '@web/components/details';

<DetailHeader
  title="Nome do Item"
  icon="bi-person-fill"
  badges={[
    { icon: "bi-card-text", text: "CPF: 123.456.789-00" },
    { icon: "bi-person-badge", text: "Estudante" }
  ]}
/>
```

**Props:**
- `title` (string): Título principal
- `subtitle` (string): Subtítulo opcional
- `icon` (string): Classe do ícone Bootstrap
- `badges` (array): Array de badges com `icon` e `text`
- `bgColor` (string): Cor de fundo (default: "bg-primary")
- `textColor` (string): Cor do texto (default: "text-white")

### 3. DetailContainer
Container para organizar seções em colunas.

```jsx
import { DetailContainer } from '@web/components/details';

<DetailContainer columns={2}>
  <DetailSection>...</DetailSection>
  <DetailSection>...</DetailSection>
</DetailContainer>
```

**Props:**
- `columns` (number): Número de colunas (1-4, default: 2)
- `className` (string): Classes CSS adicionais

### 4. DetailSection
Seção individual com título e conteúdo.

```jsx
import { DetailSection } from '@web/components/details';

<DetailSection title="Informações Pessoais" icon="bi-person-vcard">
  <DetailItem label="Nome" value="João Silva" />
  <DetailItem label="CPF" value="123.456.789-00" />
</DetailSection>
```

**Props:**
- `title` (string): Título da seção
- `icon` (string): Classe do ícone Bootstrap
- `children` (ReactNode): Conteúdo da seção
- `className` (string): Classes CSS adicionais
- `headerBg` (string): Cor de fundo do cabeçalho (default: "bg-light")

### 5. DetailItem
Item individual de informação.

```jsx
import { DetailItem } from '@web/components/details';

<DetailItem 
  icon="bi-envelope" 
  label="E-mail" 
  value="joao@email.com" 
/>

<DetailItem 
  icon="bi-telephone" 
  label="Telefone" 
  value="11999999999" 
  formatter={formatPhoneNumber} 
/>
```

**Props:**
- `icon` (string): Classe do ícone Bootstrap
- `label` (string): Rótulo do campo
- `value` (any): Valor a ser exibido
- `formatter` (function): Função para formatar o valor
- `size` (string): Tamanho da coluna (default: "col-12")
- `bg` (string): Cor de fundo (default: "bg-light")

### 6. DetailActions
Seção de ações com botões.

```jsx
import { DetailActions } from '@web/components/details';

const actions = [
  {
    text: "Excluir",
    icon: "bi-trash",
    variant: "btn-outline-danger",
    onClick: handleDelete
  },
  {
    text: "Editar",
    icon: "bi-pencil-square",
    variant: "btn-primary",
    onClick: handleEdit
  }
];

<DetailActions
  title="Ações do Item"
  description="Opções disponíveis"
  actions={actions}
/>
```

**Props:**
- `title` (string): Título da seção (default: "Ações")
- `description` (string): Descrição das ações
- `actions` (array): Array de objetos com `text`, `icon`, `variant`, `onClick`, `disabled`, `tooltip`
- `className` (string): Classes CSS adicionais

### 7. DetailDebug
Componente para exibir dados de debug em desenvolvimento.

```jsx
import { DetailDebug } from '@web/components/details';

<DetailDebug data={objectData} />
```

**Props:**
- `data` (object): Dados a serem exibidos
- `title` (string): Título personalizado
- `className` (string): Classes CSS adicionais

## Hook useDetailPage

Hook para gerenciar estado de páginas de detalhes.

```jsx
import { useDetailPage } from '@web/hooks/useDetailPage';

const { data, loading, error, refetch } = useDetailPage(fetchFunction, id);
```

**Parâmetros:**
- `fetchFunction` (function): Função para buscar dados
- `id` (string|number): ID do item
- `dependencies` (array): Dependências adicionais para o useEffect

**Retorna:**
- `data`: Dados carregados
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `refetch`: Função para recarregar dados
- `setData`: Função para atualizar dados manualmente

## Exemplo Completo

```jsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDetailPage } from '@web/hooks/useDetailPage';
import {
  DetailPage,
  DetailHeader,
  DetailSection,
  DetailItem,
  DetailActions,
  DetailContainer,
  DetailDebug
} from '@web/components/details';

function ItemDetailPage({ pageFunctions }) {
  useEffect(() => { pageFunctions.set("Item", true, true); }, [pageFunctions]);
  const navigate = useNavigate();
  const { itemId } = useParams();
  
  const { getItemById, updateItem, deleteItem } = useItems();
  const { data: item, loading, error, refetch } = useDetailPage(getItemById, itemId);

  const actions = [
    {
      text: "Excluir",
      icon: "bi-trash",
      variant: "btn-outline-danger",
      onClick: () => handleDelete()
    },
    {
      text: "Editar",
      icon: "bi-pencil-square",
      variant: "btn-primary",
      onClick: () => handleEdit()
    }
  ];

  return (
    <DetailPage loading={loading} error={error} onRetry={refetch}>
      {item && (
        <>
          <DetailHeader
            title={item.name}
            icon="bi-box"
            badges={[
              { icon: "bi-tag", text: item.category }
            ]}
          />

          <DetailContainer columns={2}>
            <DetailSection title="Informações Básicas" icon="bi-info-circle">
              <DetailItem icon="bi-tag" label="Nome" value={item.name} />
              <DetailItem icon="bi-list" label="Categoria" value={item.category} />
            </DetailSection>

            <DetailSection title="Detalhes" icon="bi-gear">
              <DetailItem icon="bi-calendar" label="Criado em" value={item.created_at} formatter={formatDate} />
              <DetailItem icon="bi-person" label="Criado por" value={item.created_by} />
            </DetailSection>
          </DetailContainer>

          <DetailActions
            title="Ações do Item"
            description="Opções disponíveis para este item"
            actions={actions}
          />

          <DetailDebug data={item} />
        </>
      )}
    </DetailPage>
  );
}
```

## Vantagens

1. **Consistência**: Interface uniforme em todas as páginas de detalhes
2. **Reutilização**: Componentes podem ser usados para qualquer tipo de objeto
3. **Manutenibilidade**: Mudanças centralizadas afetam todas as páginas
4. **Flexibilidade**: Configuração através de props permite customização
5. **Performance**: Hook otimizado com gerenciamento de estado eficiente
6. **Responsividade**: Layout automático baseado no número de colunas
7. **Acessibilidade**: Componentes seguem boas práticas de UX
