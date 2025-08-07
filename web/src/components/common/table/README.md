# Componente Table - Estrutura Componentizada

Esa pasta contém uma versão componentizada do componente `Table`, dividido em múltiplos componentes menores e mais reutilizáveis.

## Estrutura dos Componentes

### 📁 Componentes Principais

- **`Table.jsx`** - Componente principal que junta todos os outros componentes
- **`SearchBar.jsx`** - Barra de pesquisa da tabela
- **`TableHeader.jsx`** - Cabeçalho da tabela com funcionalidade de ordenação
- **`TableBody.jsx`** - Corpo da tabela que renderiza as linhas
- **`TableRow.jsx`** - Componente individual de linha
- **`TableCell.jsx`** - Componente individual de célula
- **`Pagination.jsx`** - Componente de paginação

### 🎣 Hook Personalizado

- **`useTable.js`** - Hook que contém toda a lógica de estado da tabela (ordenação, paginação, pesquisa)

### 📤 Exportações

- **`index.js`** - Arquivo que exporta todos os componentes para facilitar importações

## Benefícios da Componentização

### ✅ Vantagens

1. **Reutilização**: Cada componente pode ser usado independentemente
2. **Manutenibilidade**: Código mais fácil de manter e debugar
3. **Testabilidade**: Cada componente pode ser testado isoladamente
4. **Legibilidade**: Código mais limpo e organizado
5. **Responsabilidade Única**: Cada componente tem uma responsabilidade específica
6. **Flexibilidade**: Fácil customização e extensão

### 🔧 Separação de Responsabilidades

- **Table**: Orquestração geral
- **SearchBar**: Funcionalidade de pesquisa
- **TableHeader**: Ordenação de colunas
- **TableBody**: Renderização de dados
- **TableRow**: Manipulação de eventos de linha
- **TableCell**: Renderização de células especiais (arrays)
- **Pagination**: Navegação entre páginas
- **useTable**: Lógica de estado e processamento de dados

## Como Usar

### Importação Simples
```jsx
import { Table } from './components/table';

// Uso igual ao componente original
<Table 
  headers={headers}
  data={data}
  itemsPerPage={10}
  searchable={true}
  onRowClick={handleRowClick}
/>
```

### Importação de Componentes Individuais
```jsx
import { SearchBar, TableHeader, Pagination } from './components/table';

// Use componentes individuais se necessário
```

### Hook Personalizado
```jsx
import { useTable } from './components/table';

function CustomTable({ data, headers }) {
  const {
    sortConfig,
    currentPage,
    searchTerm,
    totalPages,
    paginatedData,
    requestSort,
    setCurrentPage,
    setSearchTerm,
  } = useTable(data, 10, true);

  // Implemente sua própria renderização
}
```

## Exemplo de Uso Personalizado

```jsx
import React from 'react';
import { 
  SearchBar, 
  TableHeader, 
  TableBody, 
  Pagination, 
  useTable 
} from './components/table';

function CustomTable({ data, headers }) {
  const tableLogic = useTable(data, 5, true);

  return (
    <div className="custom-table-container">
      <SearchBar 
        searchTerm={tableLogic.searchTerm}
        onSearchChange={tableLogic.setSearchTerm}
      />
      
      <table className="table">
        <TableHeader 
          headers={headers}
          sortConfig={tableLogic.sortConfig}
          onSort={tableLogic.requestSort}
        />
        <TableBody 
          data={tableLogic.paginatedData}
          headers={headers}
        />
      </table>
      
      <Pagination 
        currentPage={tableLogic.currentPage}
        totalPages={tableLogic.totalPages}
        onPageChange={tableLogic.setCurrentPage}
      />
    </div>
  );
}
```

## Migração

O componente principal (`Table.jsx`) mantém a mesma API do componente original, então **não é necessário alterar o código existente**. A refatoração é totalmente compatível com versões anteriores.