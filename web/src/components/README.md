# Estrutura da Pasta Components

## Visão Geral
Esta pasta contém todos os componentes React da aplicação, organizados por responsabilidade e reutilização.

## Estrutura Proposta

```
src/components/
├── core/                    # Componentes fundamentais da aplicação
│   ├── layout/             # Componentes de layout (Header, SideBar, etc.)
│   ├── navigation/         # Componentes de navegação
│   └── feedback/           # Componentes de feedback (Loading, Notifications, etc.)
├── common/                  # Componentes reutilizáveis genéricos
│   ├── forms/              # Componentes de formulário
│   ├── data-display/       # Componentes de exibição de dados
│   ├── feedback/           # Alertas, modais, etc.
│   └── buttons/            # Botões e ações
├── domain/                  # Componentes específicos de domínio
│   ├── routes/             # Componentes relacionados a rotas
│   ├── stops/              # Componentes relacionados a paradas
│   ├── buses/              # Componentes relacionados a ônibus
│   ├── drivers/            # Componentes relacionados a motoristas
│   └── passengers/         # Componentes relacionados a passageiros
├── features/                # Componentes de funcionalidades específicas
│   ├── route-planning/     # Planejamento de rotas
│   ├── reports/            # Relatórios e estatísticas
│   └── settings/           # Configurações do sistema
└── index.js                 # Exportações centralizadas
```

## Princípios de Organização

### 1. **core/** - Componentes Fundamentais
- Componentes essenciais para o funcionamento da aplicação
- Não dependem de lógica de negócio específica
- Exemplos: Header, SideBar, Layout, Navigation

### 2. **common/** - Componentes Reutilizáveis
- Componentes genéricos que podem ser usados em qualquer lugar
- Não têm dependências de domínio
- Exemplos: Dialog, LoadingSpinner, GenericForm, StatCard

### 3. **domain/** - Componentes de Domínio
- Componentes específicos de uma área de negócio
- Podem ser reutilizados dentro do mesmo domínio
- Exemplos: RouteCard, StopMarker, BusDetails

### 4. **features/** - Funcionalidades Específicas
- Componentes que implementam funcionalidades completas
- Podem combinar componentes de diferentes domínios
- Exemplos: RoutePlanner, ReportGenerator

## Convenções de Nomenclatura

- **PascalCase** para nomes de componentes
- **camelCase** para nomes de arquivos
- **kebab-case** para nomes de pastas
- Sufixo `.jsx` para componentes React
- Sufixo `.js` para arquivos de configuração e utilitários

## Imports e Exports

- Usar imports absolutos com alias `@web/components`
- Centralizar exports em arquivos `index.js`
- Evitar imports circulares
- Manter dependências mínimas entre componentes

## Exemplo de Uso

```jsx
// ✅ Bom - Import de componente específico
import { RouteCard } from '@web/components/domain/routes';
import { LoadingSpinner } from '@web/components/common';

// ❌ Ruim - Import de pasta inteira
import * as Routes from '@web/components/domain/routes';
```

## Migração

Para migrar a estrutura atual:
1. Criar as novas pastas
2. Mover componentes gradualmente
3. Atualizar imports
4. Remover pastas antigas
5. Atualizar documentação
