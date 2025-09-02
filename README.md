# 🚌 BusHere! - Sistema Completo de Gestão de Transporte Público

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://www.mysql.com/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-purple.svg)](https://expo.dev/)
[![Vite](https://img.shields.io/badge/Vite-6%2B-646CFF.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3.svg)](https://getbootstrap.com/)

O **BusHere!** é um ecossistema completo de gestão de transporte público desenvolvido como Trabalho de Conclusão de Curso (TCC) da ETEC João Belarmino do Centro Paula Souza. O sistema oferece múltiplas interfaces: aplicação web administrativa para empresas, Progressive Web App (PWA) mobile-first para passageiros, aplicativo móvel nativo e uma API REST robusta para integração completa de dados.

## 📋 Sumário

- [Características](#-características)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Configuração Manual](#-configuração-manual)
- [Execução](#-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [API Endpoints](#-api-endpoints)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Características

### 🖥️ Aplicação Web Administrativa (`web/`)
- **Gestão Completa de Entidades**: Cadastro, edição e visualização de passageiros, motoristas, ônibus, rotas e pontos
- **Sistema de Busca Avançado**: Pesquisa full-text com autocomplete e sugestões inteligentes
- **Dashboard Executivo**: Relatórios interativos, gráficos estatísticos e KPIs em tempo real
- **Mapeamento Interativo**: Visualização e criação de pontos no mapa com funcionalidades de geolocalização
- **Sistema de Autenticação**: Login seguro para usuários empresariais com gestão de tokens
- **Associações Inteligentes**: Gerenciamento de relações entre ônibus, motoristas e rotas
- **Interface Responsiva**: Design profissional com Bootstrap 5 e componentes reutilizáveis
- **Validação Robusta**: Validação em tempo real de CPF, telefone, e-mail e outros dados críticos

### 📱 Progressive Web App (`webapp/`)
- **Mobile-First Design**: Interface otimizada para dispositivos móveis com PWA
- **Mapeamento Interativo**: Sistema de mapas com Leaflet para visualização de rotas e pontos
- **Bottom Sheet**: Interface nativa mobile com componentes deslizantes
- **Sidebar Responsiva**: Navegação adaptável para diferentes tamanhos de tela
- **Temas Dark/Light**: Sistema de temas com persistência de preferências
- **Offline-Ready**: Funcionalidades básicas disponíveis sem conexão
- **Instalável**: Pode ser instalado como app nativo nos dispositivos

### � Aplicativo Móvel Nativo (`mobile/`)
- **React Native + Expo**: Desenvolvimento cross-platform para iOS e Android
- **Navegação Nativa**: Expo Router com navegação baseada em arquivos
- **Componentes Nativos**: BusLineCard, SearchBar e componentes de interface otimizados
- **API Integration**: Cliente REST configurado para diferentes ambientes (desenvolvimento/produção)
- **Performance Otimizada**: Animações fluidas com React Native Reanimated

### 🔧 API Backend
- **RESTful API**: Endpoints organizados e documentados para todas as entidades
- **Sistema de Busca**: Índices de busca full-text para autocomplete
- **Validação**: Validação robusta de dados de entrada
- **Banco de Dados**: MySQL com migrations organizadas e triggers
- **Middleware**: CORS, autenticação e tratamento de erros
- **Cache**: Sistema de cache para otimização de performance

## 🚀 Funcionalidades Principais

### 📊 Dashboard e Relatórios
- **Estatísticas em Tempo Real**: Contadores dinâmicos de passageiros, motoristas, ônibus e rotas
- **Gráficos Interativos**: Visualizações com Chart.js para análise de dados
- **Indicadores de Performance**: Métricas de utilização e eficiência do sistema
- **Filtros Avançados**: Relatórios segmentados por diferentes critérios

### 🗺️ Sistema de Mapeamento
- **Mapas Interativos**: Integração com OpenStreetMap via Leaflet
- **Marcadores Dinâmicos**: Visualização de pontos com cores baseadas em dados
- **Criação de Pontos**: Interface para adicionar novos pontos diretamente no mapa
- **Geocodificação**: Conversão automática de coordenadas para endereços
- **Cache de Localização**: Otimização para consultas repetidas

### 🔍 Sistema de Busca
- **Autocomplete Inteligente**: Sugestões em tempo real durante a digitação
- **Busca Full-text**: Pesquisa otimizada em todos os campos relevantes
- **Filtros por Categoria**: Busca específica por tipo de entidade
- **Índices Otimizados**: Performance aprimorada para grandes volumes de dados

### 📝 Formulários Inteligentes
- **Validação em Tempo Real**: Verificação de CPF, e-mail e outros dados
- **Preenchimento Automático**: Integração com APIs para completar endereços
- **Componentes Reutilizáveis**: Formulários padronizados para todas as entidades
- **Máscaras de Entrada**: Formatação automática de campos como telefone e CPF

### 🔧 Componentes Genéricos
- **DetailCard**: Componente reutilizável para exibição de detalhes
- **GenericForm**: Sistema de formulários configurável
- **StatCard**: Cartões de estatísticas otimizados
- **MapComponent**: Componente de mapa com funcionalidades avançadas

### 📱 Interface Responsiva
- **Design Mobile-First**: Adaptação para todos os tamanhos de tela
- **Componentes Bootstrap**: Interface consistente e profissional
- **Animações Suaves**: Transições e efeitos visuais aprimorados
- **Acessibilidade**: Suporte a tecnologias assistivas

## 🎯 Características Técnicas

### 🏗️ Arquitetura de Código
- **Componentização**: Separação clara de responsabilidades
- **Reutilização**: Componentes genéricos para máxima eficiência
- **Modularidade**: Estrutura organizada em módulos independentes
- **Manutenibilidade**: Código limpo e bem documentado

### ⚡ Performance
- **Cache Inteligente**: Sistema de cache para APIs e dados
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Otimização de Consultas**: Índices e queries otimizadas
- **Compressão**: Minificação e otimização de assets

### 🔒 Segurança
- **Validação de Entrada**: Sanitização de todos os dados
- **Proteção CORS**: Configuração segura de cross-origin
- **Hash de Senhas**: Criptografia bcrypt para senhas
- **Sanitização SQL**: Proteção contra SQL injection

### 🛠️ Desenvolvimento
- **ESLint**: Padronização de código JavaScript
- **Hot Reload**: Desenvolvimento com atualizações em tempo real
- **Source Maps**: Debugging facilitado
- **Migrations**: Versionamento do banco de dados

## 🏗️ Arquitetura

```
BusHere! - Sistema Completo
├── 🌐 Web App Administrativa (React + Vite)
│   ├── Dashboard Executivo & Relatórios Avançados
│   ├── Gestão Completa de Entidades (CRUD)
│   ├── Sistema de Busca com Autocomplete Full-text
│   ├── Mapeamento Interativo com Leaflet
│   ├── Autenticação & Autorização de Usuários
│   └── Interface Responsiva com Bootstrap 5
├── 📱 PWA Mobile-First (React + Vite + PWA)
│   ├── Interface Otimizada para Dispositivos Móveis
│   ├── Bottom Sheet & Sidebar Responsiva
│   ├── Mapeamento com Leaflet React
│   ├── Temas Dark/Light Persistentes
│   └── Funcionalidades Offline
├── 📲 App Móvel Nativo (React Native + Expo)
│   ├── Navegação com Expo Router
│   ├── Componentes Nativos (BusLineCard, SearchBar)
│   ├── API Client Configurável
│   └── Animações React Native Reanimated
├── ⚙️ API REST Backend (Node.js + Express 5)
│   ├── Endpoints RESTful Completos
│   ├── Sistema de Autocomplete Full-text
│   ├── Autenticação JWT & Middleware CORS
│   ├── Validação Robusta de Dados
│   ├── Geolocalização & Integração de APIs
│   └── Sistema de Auditoria (Log de Mudanças)
├── 🗄️ Banco de Dados (MySQL 8.0+)
│   ├── 38+ Migrations Estruturadas
│   ├── Índices Full-text para Busca
│   ├── Triggers para Auditoria Automática
│   ├── Relacionamentos Complexos
│   └── Dados de Exemplo Integrados
└── 🔗 Código Compartilhado (`shared/`)
    ├── Validadores & Formatadores Brasileiros
    ├── Tipos TypeScript Comuns
    └── Utilitários Cross-Platform
```

## 🔧 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js**: Versão 18 ou superior
- **npm**: Gerenciador de pacotes (incluído com Node.js)
- **MySQL**: Versão 8.0+ ou XAMPP para desenvolvimento local
- **Git**: Para controle de versão

### 🛠️ Ferramentas Recomendadas
- **VS Code**: Editor de código recomendado
- **MySQL Workbench**: Para gerenciamento visual do banco
- **Postman**: Para testes da API

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/TCC-JB-02-2025/tcc.git
cd tcc
```

### 2. Setup Automático Inteligente
Execute o script de configuração que detecta seu ambiente e instala todas as dependências:

```bash
npm run setup
```

Este comando irá:
- ✅ Instalar dependências na raiz do projeto
- ✅ Configurar aplicação web administrativa (`web/`)
- ✅ Configurar Progressive Web App (`webapp/`)
- ✅ Configurar backend API (`server/`)
- ✅ Tentar copiar arquivos `.env.example` para `.env` (quando disponíveis)
- ✅ Executar configuração inteligente do banco de dados
- ✅ Criar estrutura de tabelas com migrations
- ✅ Popular dados de exemplo

### 3. Configurar Banco de Dados
Crie o arquivo `server/.env` com suas credenciais do MySQL:

```env
# Configuração do Servidor
PORT=3000

# Configuração MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=tcc

# Chaves de API (opcional)
VIACEP_API_URL=https://viacep.com.br/ws/
NOMINATIM_API_URL=https://nominatim.openstreetmap.org/
```

### 4. Configurar Frontend (Opcional)
Configure variáveis de ambiente específicas:

**Para Web App (`web/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Para PWA (`webapp/.env`):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_MAP_TILES_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 5. Executar o Sistema Completo
```bash
npm start
```

O comando acima iniciará automaticamente:
- 🌐 **Web App Administrativa**: http://localhost:5173
- 📱 **Progressive Web App**: http://localhost:5174
- ⚙️ **API Backend**: http://localhost:3000
- 📊 **Documentação da API**: http://localhost:3000/api-docs

### 6. Executar App Mobile (Opcional)
```bash
cd mobile
npm install
npx expo start
```
- 📲 **App Móvel**: Use o Expo CLI com QR Code ou emulador
```bash
npm start
```

## ⚙️ Configuração Manual

Se preferir configurar manualmente ou encontrar problemas:

### 🌐 Web App Administrativa
```bash
cd web
npm install
# Configure .env se necessário (ver seção Variáveis de Ambiente)
npm run dev                    # Desenvolvimento
# ou
npm run start                  # Produção local
```

### 📱 Progressive Web App  
```bash
cd webapp
npm install
# Configure .env se necessário
npm run dev                    # Desenvolvimento com PWA
# ou
npm run build && npm run preview   # Build PWA completa
```

### ⚙️ Backend API
```bash
cd server
npm install
# OBRIGATÓRIO: Crie e preencha o arquivo .env (ver seção Variáveis)
npm run setup                  # Configuração do banco de dados
npm start                      # Iniciar servidor
```

### 📲 Mobile App
```bash
cd mobile
npm install
npm run setup-variables        # Configurar ANDROID_HOME (Windows)
npx expo start                 # Iniciar Expo
```

## 🚦 Execução

### 🚀 Desenvolvimento (Recomendado)
```bash
# Execução completa do sistema (raiz do projeto)
npm start
```
Este comando inicia simultaneamente:
- Web App Administrativa (localhost:5173)
- Progressive Web App (localhost:4173) 
- API Backend (localhost:3000)

### 🔧 Execução Individual
```bash
# Apenas Web App Administrativa
npm run start --prefix web

# Apenas Progressive Web App
npm run start --prefix webapp

# Apenas API Backend  
npm run start --prefix server

# Apenas Mobile App
cd mobile && npx expo start
```

### 🏭 Ambiente de Produção
```bash
# Build de produção do frontend
cd web && npm run build
cd webapp && npm run build

# Servidor em modo produção
cd server && NODE_ENV=production npm start

# Build mobile para stores
cd mobile
npm run android    # Android APK
npm run ios        # iOS build
```

### 🧪 Ambiente de Teste
```bash
# Executar testes (quando implementados)
npm test

# Verificar integridade do código
npm run lint --prefix web
npm run lint --prefix webapp  
npm run lint --prefix mobile
```

## 📁 Estrutura do Projeto

```
tcc/
├── 📁 web/                                  # 🌐 Aplicação Web Administrativa (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                      # 📦 Biblioteca de componentes reutilizáveis
│   │   │   │   ├── buttons/                 # Botões especializados
│   │   │   │   ├── data-display/            # StatCard, Table, Charts
│   │   │   │   ├── detail/                  # DetailCard + configurações
│   │   │   │   ├── feedback/                # Dialog, ErrorAlert, LoadingSpinner, Notifications
│   │   │   │   ├── form/                    # Configurações de formulários
│   │   │   │   ├── forms/                   # GenericForm componentizado
│   │   │   │   └── table/                   # Sistema de tabelas (Header/Body/Cell/Actions)
│   │   │   ├── core/
│   │   │   │   ├── layout/                  # Header, SideBar, MapComponent
│   │   │   │   └── feedback/                # Sistema de notificações
│   │   │   ├── domain/                      # 🏢 Componentes de domínio de negócio
│   │   │   │   ├── buses/                   # Gestão de ônibus
│   │   │   │   ├── drivers/                 # Gestão de motoristas
│   │   │   │   ├── passengers/              # Gestão de passageiros
│   │   │   │   ├── routes/                  # Gestão de rotas
│   │   │   │   └── stops/                   # Gestão de pontos
│   │   │   └── features/                    # 🎯 Features de alto nível
│   │   │       ├── dashboard/               # Dashboard executivo
│   │   │       ├── details/                 # Páginas de detalhes
│   │   │       ├── reports/                 # Relatórios e analytics
│   │   │       ├── route-planning/          # Planejamento de rotas
│   │   │       └── settings/                # Configurações do sistema
│   │   ├── pages/                           # 📄 Páginas da aplicação
│   │   │   ├── Home/, Passengers/, Drivers/, Routes/, Stops/, Reports/
│   │   │   ├── auth/ (Login, Register)
│   │   │   ├── Search/, details/*
│   │   │   └── settings/
│   │   ├── hooks/                           # 🎣 Custom Hooks organizados
│   │   │   ├── dashboard/                   # Hooks para métricas e KPIs
│   │   │   ├── data/                        # usePassengers, useDrivers, useRoutes, useStops
│   │   │   ├── map/                         # Hooks para funcionalidades de mapa
│   │   │   ├── operations/                  # CRUD operations hooks
│   │   │   └── ui/                          # Hooks de interface (modals, themes, etc)
│   │   ├── api/                             # 🌐 Clientes de API
│   │   │   ├── api.ts                       # Cliente principal da API
│   │   │   └── autocomplete.ts              # API de autocomplete
│   │   └── utils/                           # 🛠️ Utilitários
│   │       └── config.js                    # Configurações dinâmicas (baseUrl, endpoints)
│   ├── public/                              # Assets estáticos
│   └── styles/                              # 🎨 Sistema de temas (SCSS)
│       ├── themes/light.scss, dark.scss
│       └── components/
│
├── 📁 webapp/                               # 📱 Progressive Web App (Mobile-First)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                      # FloatingButton, ThemeToggle
│   │   │   ├── MapComponent.jsx             # Mapa interativo Leaflet
│   │   │   ├── BottomSheet.jsx              # Componente deslizante mobile
│   │   │   ├── SideBar.jsx                  # Navegação lateral responsiva
│   │   │   └── MapTest.jsx                  # Componente de teste do mapa
│   │   ├── pages/
│   │   │   └── HomePage.jsx                 # Página principal mobile-first
│   │   └── styles/                          # Estilos específicos PWA
│   ├── public/
│   │   ├── manifest.json                    # Manifesto PWA
│   │   └── icons/                           # Ícones para instalação
│   └── vite.config.js                       # Configuração Vite + PWA
│
├── 📁 mobile/                               # 📲 App React Native (Expo)
│   ├── app/                                 # 🗂️ Telas (Expo Router file-based)
│   │   ├── _layout.tsx                      # Layout principal
│   │   ├── index.jsx                        # Tela inicial
│   │   ├── home.jsx, otherPage.jsx
│   │   └── auth/                            # Fluxo de autenticação
│   ├── components/
│   │   ├── BusLineCard.jsx                  # Cartão de linha de ônibus
│   │   ├── PopUpComponent.jsx               # Modais nativos
│   │   └── SearchBar.jsx                    # Barra de pesquisa
│   ├── api/api.ts                           # 📡 Cliente REST (configurado para emuladores)
│   ├── constants/Colors.ts                  # Sistema de cores
│   ├── hooks/                               # Custom hooks específicos mobile
│   ├── assets/fonts/, images/
│   ├── scripts/configure-variables.js       # Configuração ANDROID_HOME
│   └── app.json                             # Configurações Expo
│
├── 📁 server/                               # ⚙️ API Backend (Express 5 + MySQL)
│   ├── src/
│   │   ├── index.js                         # Servidor principal
│   │   ├── enterprise/                      # 🏢 Módulos empresariais
│   │   │   ├── auth/                        # Autenticação JWT
│   │   │   ├── passengerRoutes.js           # CRUD Passageiros
│   │   │   ├── driverRoutes.js              # CRUD Motoristas
│   │   │   ├── busRoutes.js                 # CRUD Ônibus
│   │   │   ├── routeRoutes.js               # CRUD Rotas + Associações
│   │   │   ├── stopRoutes.js                # CRUD Pontos
│   │   │   ├── reportsRoutes.js             # Relatórios e estatísticas
│   │   │   ├── searchRoutes.js              # Sistema de busca full-text
│   │   │   └── lastChangesRoutes.js         # Auditoria de mudanças
│   │   └── setupDB.js                       # Configuração inteligente do DB
│   ├── migrations/                          # 🗄️ 38+ Migrations estruturadas
│   │   ├── 001-037_*.sql                    # Criação de tabelas
│   │   ├── *_search_index_trigger.sql       # Triggers para busca
│   │   └── 100_insert_data_with_triggers.sql # Dados iniciais
│   └── scripts/                             # Utilitários de desenvolvimento
│
├── 📁 shared/                               # 🔗 Código compartilhado
│   ├── brazilianStates.ts                   # Estados brasileiros
│   ├── formatters.ts                        # Formatadores (CPF, telefone, etc)
│   ├── validators.ts                        # Validadores brasileiros
│   └── types/                               # Tipos TypeScript comuns
│
├── 📁 scripts/                              # 🔧 Scripts de automação
│   ├── setup.js                             # Setup inteligente do projeto
│   └── start.js                             # Inicialização coordenada
│
├── package.json                             # 📦 Scripts raiz (setup, start)
├── tsconfig.json                            # Configuração TypeScript global
└── README.md                                # 📖 Documentação principal
```

### 🔗 Aliases de Importação Configurados

**Web App (`web/jsconfig.json`):**
- `@web/*` → `web/src/*`
- `@shared/*` → `shared/*`
- `@components/*` → `web/src/components/*`
- `@pages/*` → `web/src/pages/*`
- `@hooks/*` → `web/src/hooks/*`
- `@utils/*` → `web/src/utils/*`

**Mobile App (`mobile/tsconfig.json`):**
- `@mobile/*` → `mobile/*`
- `@shared/*` → `shared/*`
- `@components/*` → `mobile/components/*`
- `@constants/*` → `mobile/constants/*`

**PWA (`webapp/jsconfig.json`):**
- `@webapp/*` → `webapp/src/*`
- `@shared/*` → `shared/*`

### 🧭 Principais Funcionalidades por Módulo

**🌐 Web App (Administrativo)**
- Dashboard executivo com KPIs em tempo real
- CRUD completo para todas as entidades
- Sistema de busca full-text com autocomplete
- Relatórios interativos com Chart.js
- Mapeamento avançado com Leaflet
- Sistema de autenticação empresarial

**📱 PWA (Mobile-First)**
- Interface otimizada para dispositivos móveis
- Bottom sheet deslizante nativo
- Mapeamento interativo responsivo
- Temas escuro/claro persistentes
- Funcionalidades offline básicas

**📲 Mobile App (Nativo)**
- Interface 100% nativa com Expo
- Navegação file-based com Expo Router
- Componentes otimizados para performance
- Integração com APIs do sistema

**⚙️ Backend API**
- 38+ migrations estruturadas
- Sistema de busca full-text avançado
- Auditoria automática com triggers
- Endpoints RESTful completos
- Validação robusta de dados brasileiros

## 🛠️ Tecnologias

### 🌐 Frontend Web Administrativo
- **React 19** - Biblioteca UI moderna com Concurrent Features
- **Vite 6+** - Build tool ultra-rápida com HMR otimizado
- **React Router DOM 7** - Roteamento declarativo
- **Bootstrap 5.3** - Framework CSS com componentes responsivos
- **Chart.js 4** - Gráficos interativos e visualizações de dados
- **Leaflet + React Leaflet** - Mapas interativos de alta performance
- **Sass** - Pré-processador CSS com sistema de temas

### 📱 Progressive Web App (PWA)
- **React 19** - Base sólida com Concurrent Features
- **Vite PWA Plugin** - Configuração automática de Service Workers
- **Vite 7+** - Build otimizada para PWA
- **Leaflet** - Mapas leves para dispositivos móveis
- **Bootstrap 5** - Sistema responsivo mobile-first
- **Sass Embedded** - Compilação CSS otimizada

### 📲 Mobile Nativo
- **React Native 0.79** - Framework cross-platform
- **Expo ~53** - Plataforma de desenvolvimento simplificada
- **Expo Router 5** - Navegação baseada em sistema de arquivos
- **React Native Reanimated 3** - Animações nativas de alta performance
- **React Native Gesture Handler** - Gestos nativos otimizados
- **TypeScript 5.8** - Tipagem estática para maior robustez

### ⚙️ Backend & API
- **Node.js 18+** - Runtime JavaScript moderno
- **Express 5.1** - Framework web minimalista e flexível
- **MySQL2 3.14** - Driver MySQL nativo com Promise support
- **bcrypt 5.1** - Hash seguro de senhas
- **CORS 2.8** - Política de cross-origin configurável
- **dotenv 16.5** - Gerenciamento seguro de variáveis de ambiente
- **body-parser 2.2** - Parsing avançado de requisições

### 🗄️ Banco de Dados & Infraestrutura
- **MySQL 8.0+** - Sistema robusto com JSON support
- **Full-text Search Indexes** - Busca textual otimizada
- **Database Triggers** - Automatização de índices e auditoria
- **38+ Structured Migrations** - Versionamento profissional do schema
- **Connection Pooling** - Gerenciamento eficiente de conexões

### 🌐 APIs Externas & Integrações
- **ViaCEP API** - Consulta de CEP brasileiros
- **Nominatim OpenStreetMap** - Geolocalização reversa gratuita
- **OpenStreetMap Tiles** - Tiles de mapa open source
- **REST Architecture** - Padrão de API bem estruturado

### 🔧 Desenvolvimento & DevOps
- **ESLint 9** - Linting moderno com flat config
- **Concurrently** - Execução paralela de processos
- **Hot Module Replacement** - Desenvolvimento em tempo real
- **Source Maps** - Debugging facilitado em produção
- **Environment Variables** - Configuração por ambiente

### 🛡️ Segurança & Validação
- **JWT (JSON Web Tokens)** - Autenticação stateless
- **bcrypt** - Hash seguro de senhas com salt
- **Input Sanitization** - Prevenção de XSS e injection
- **CORS Policy** - Controle de acesso cross-origin
- **SQL Prepared Statements** - Proteção contra SQL Injection
- **Brazilian Data Validators** - CPF, CNPJ, telefone, etc

## 🌐 API Endpoints

### Autenticação (Usuário Empresa)
```http
POST   /api/auth/register       # Campos: nome, email, password
POST   /api/auth/login          # Campos: email, password (retorna token)
POST   /api/auth/logout         # Header: Authorization: Bearer <token>
GET    /api/auth/me             # Header: Authorization: Bearer <token>
POST   /api/auth/change-password# Header + Campos: old_password, new_password
```

### Passageiros
```http
GET    /api/passengers          # Listar passageiros (com paginação)
GET    /api/passengers/:id      # Obter passageiro por ID
POST   /api/passengers          # Criar novo passageiro
PUT    /api/passengers/:id      # Atualizar passageiro
DELETE /api/passengers/:id      # Excluir passageiro
GET    /api/passengers/tipos    # Listar tipos de passageiro
GET    /api/passengers/search   # Busca full-text (?query=)
```

### Motoristas
```http
GET    /api/drivers             # Listar motoristas
GET    /api/drivers/:id         # Obter motorista por ID
POST   /api/drivers             # Criar novo motorista
PUT    /api/drivers/:id         # Atualizar motorista
DELETE /api/drivers/:id         # Excluir motorista
GET    /api/drivers/status      # Listar status de motoristas
```

### Ônibus
```http
GET    /api/buses               # Listar ônibus
GET    /api/buses/:id           # Obter ônibus por ID
POST   /api/buses               # Criar novo ônibus
PUT    /api/buses/:id           # Atualizar ônibus
DELETE /api/buses/:id           # Excluir ônibus
GET    /api/buses/status        # Listar status de ônibus
```

### Rotas
```http
GET    /api/routes              # Listar rotas
GET    /api/routes/:id          # Obter rota por ID
POST   /api/routes              # Criar nova rota
PUT    /api/routes/:id          # Atualizar rota
DELETE /api/routes/:id          # Excluir rota
GET    /api/routes/status       # Listar status de rotas
GET    /api/routes/stops/:id    # Listar pontos de uma rota
GET    /api/routes/:id/assignments                  # Listar associações ônibus-motorista da rota
POST   /api/routes/:id/assignments                  # Criar associação
PUT    /api/routes/:id/assignments/:assignmentId    # Atualizar associação
DELETE /api/routes/:id/assignments/:assignmentId    # Remover associação (soft delete)
```

### Pontos
```http
GET    /api/stops               # Listar pontos
GET    /api/stops/:id           # Obter ponto por ID
POST   /api/stops               # Criar novo ponto
PUT    /api/stops/:id           # Atualizar ponto
DELETE /api/stops/:id           # Excluir ponto
GET    /api/stops/search        # Buscar pontos por nome
PATCH  /api/stops/:id/status    # Ativar/Desativar ponto (body: { ativo: boolean })
```

### Relatórios
```http
GET    /api/reports/stats       # Estatísticas gerais
GET    /api/reports/charts      # Dados para gráficos
GET    /api/reports/utilization # Dados de utilização
```

### Busca
```http
GET    /api/autocomplete        # Autocomplete para busca
```

### Usuários da Empresa
```http
GET    /api/enterpriseUsers/:id # Detalhes do usuário empresa por ID
```

### Mudanças Recentes (Auditoria)
```http
GET    /api/lastChanges?limit=50
```

## 📝 Scripts Disponíveis

### 🚀 Raiz do Projeto (Orquestração)
```bash
npm run setup    # 🔧 Configuração inicial completa e inteligente
npm start        # 🏃 Executa web + webapp + server simultaneamente
```

### 🌐 Web App Administrativa (`web/`)
```bash
npm run start    # 🚀 Servidor de desenvolvimento (localhost:5173)
npm run dev      # 🔄 Alias para start com hot reload
npm run build    # 📦 Build otimizada para produção
npm run preview  # 👀 Preview do build de produção
npm run lint     # 🔍 Verificação de código com ESLint
npm run setup    # ⚙️ Instalar dependências apenas desta aplicação
```

### 📱 Progressive Web App (`webapp/`)
```bash
npm run start    # 🚀 Servidor PWA (localhost:4173)
npm run dev      # 🔄 Desenvolvimento com PWA features
npm run build    # 📦 Build PWA com Service Workers
npm run preview  # 👀 Preview da PWA construída
npm run lint     # 🔍 Linting específico para PWA
npm run setup    # ⚙️ Setup do ambiente PWA
```

### ⚙️ Backend API (`server/`)
```bash
npm start        # 🚀 Inicia servidor API (localhost:3000)
npm run dev      # 🔄 Desenvolvimento com auto-restart (nodemon)
npm run setup    # 🗄️ Configuração completa do banco de dados
npm run nodemon  # 🔄 Execução com nodemon para desenvolvimento
```

### 📲 Mobile App (`mobile/`)
```bash
npm start        # 📱 Inicia Expo Development Server
npm run android  # 🤖 Build e execução no Android
npm run ios      # 🍎 Build e execução no iOS
npm run web      # 🌐 Versão web do aplicativo móvel
npm run setup    # ⚙️ Setup + configuração Android (Windows)
npm run setup-variables # 🔧 Configura ANDROID_HOME (Windows)
npm run lint     # 🔍 Verificação de código Expo
```

### 🛠️ Scripts de Desenvolvimento Avançados

**Execução Seletiva:**
```bash
# Executar apenas frontend administrativo
npm run start --prefix web

# Executar apenas PWA
npm run start --prefix webapp  

# Executar apenas backend
npm run start --prefix server

# Executar apenas mobile
cd mobile && npm start
```

**Build para Produção:**
```bash
# Build completo do sistema
npm run build --prefix web && npm run build --prefix webapp

# Build individual
cd web && npm run build      # Web app administrativa
cd webapp && npm run build   # PWA
cd mobile && npm run build   # Mobile (via EAS Build)
```

**Manutenção e Debugging:**
```bash
# Limpar node_modules em todos os projetos
npm run clean-all

# Reinstalar dependências em todo o projeto
npm run reinstall-all

# Verificar status de todos os serviços
npm run health-check
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📋 Padrões de Código
- Use ESLint para JavaScript/React
- Siga as convenções de nomenclatura estabelecidas
- Documente funções complexas
- Teste suas alterações antes do commit

## 🐛 Solução de Problemas

### ❓ Problemas Comuns

**🔌 Erro de conexão com banco de dados:**
```bash
# 1. Verifique se o MySQL está rodando
# Windows: Verifique serviços ou XAMPP
# Linux/Mac: sudo systemctl status mysql

# 2. Confirme as credenciais no arquivo server/.env
# Verifique DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# 3. Execute as migrations manualmente
cd server
npm run setup
```

**🚪 Porta já em uso (3000, 5173, 4173):**
```bash
# Verificar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :4173

# Terminar processo (Windows)
taskkill /PID <PID> /F

# Ou alterar portas nos arquivos de configuração
# server/.env: PORT=3001
# web/vite.config.js: server.port
# webapp/vite.config.js: server.port
```

**📦 Dependências não instaladas:**
```bash
# Execute instalação completa
npm run setup

# Ou instalar manualmente cada módulo
npm install                    # Raiz
npm install --prefix web       # Web app
npm install --prefix webapp    # PWA
npm install --prefix server    # Backend
npm install --prefix mobile    # Mobile app
```

**🗺️ Problemas com mapeamento (Leaflet):**
```bash
# 1. Verifique conexão com internet para tiles do OpenStreetMap
# 2. Confirme se as coordenadas estão corretas
# 3. Verifique console do browser para erros de CORS
# 4. Teste com tiles alternativos se necessário
```

**📱 Expo/Android emulador não acessa API local:**
```bash
# 1. Use 10.0.2.2:3000 para emulador Android (já configurado)
# 2. Use IP da máquina para dispositivo físico
# 3. Certifique-se que o backend está em 0.0.0.0:3000
# 4. Verifique firewall do Windows
# 5. Para iOS Simulator use localhost:3000
```

**🔍 Erro de autocomplete/busca:**
```bash
# 1. Verifique se as migrations do banco foram executadas
cd server && npm run setup

# 2. Confirme se os índices full-text foram criados
# Verifique migrations /*_search_index_trigger.sql

# 3. Teste endpoints de busca diretamente
curl http://localhost:3000/api/autocomplete?query=test
```

**⚡ PWA não instala/não funciona offline:**
```bash
# 1. Verifique se está sendo servido via HTTPS ou localhost
# 2. Confirme se o manifest.json está acessível
curl http://localhost:5173/manifest.json

# 3. Verifique Service Worker no DevTools
# Application > Service Workers

# 4. Rebuild a PWA
cd webapp && npm run build && npm run preview
```

**📊 Gráficos não carregam (Chart.js):**
```bash
# 1. Verifique console para erros de API
# 2. Teste endpoint de relatórios
curl http://localhost:3000/api/reports/charts

# 3. Confirme se dados estão no formato correto
# 4. Verifique se Chart.js está importado corretamente
```

**🔐 Erro de autenticação/login:**
```bash
# 1. Verifique se a tabela usuarios_empresa foi criada
# 2. Confirme se há um usuário de teste criado
# 3. Verifique se o JWT está sendo gerado corretamente
# 4. Teste login via API diretamente

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 🆘 Soluções Rápidas

**Reset Completo do Ambiente:**
```bash
# Parar todos os processos
# Ctrl+C em todos os terminais

# Limpar dependências
rm -rf node_modules web/node_modules webapp/node_modules server/node_modules mobile/node_modules

# Reinstalar tudo
npm run setup

# Recriar banco de dados
cd server
npm run setup
```

**Verificação de Saúde do Sistema:**
```bash
# 1. Teste conectividade do banco
cd server && node -e "
const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha'
});
connection.connect().then(() => console.log('✅ MySQL OK')).catch(console.error);
"

# 2. Teste endpoints principais
curl http://localhost:3000/api/passengers
curl http://localhost:3000/api/drivers  
curl http://localhost:3000/api/routes

# 3. Verifique logs em cada terminal para erros específicos
```

### 📞 Quando Buscar Ajuda

Se os problemas persistirem:

1. **Verifique os logs detalhados** em cada terminal/console
2. **Reproduza o erro** com passos específicos
3. **Colete informações do ambiente**:
   - Sistema operacional
   - Versões do Node.js e MySQL
   - Mensagens de erro completas
4. **Consulte a documentação** específica de cada tecnologia
5. **Abra uma issue** no repositório GitHub com:
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Logs de erro
   - Configuração do ambiente

### 🔧 Ferramentas de Debug Recomendadas

- **MySQL Workbench** - Interface visual para o banco de dados
- **Postman/Insomnia** - Testes de API
- **Chrome DevTools** - Debug do frontend
- **React Developer Tools** - Debug específico do React
- **Expo DevTools** - Debug do app móvel
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - MySQL (cweijan.vscode-mysql-client2)
  - Thunder Client (API testing)
  - Error Lens (highlight de erros)

---

**💡 Dica: Mantenha sempre os logs visíveis durante o desenvolvimento para identificar problemas rapidamente.**

---

## � Suporte Técnico

### 🆘 Canais de Suporte

**Problemas Técnicos:**
1. 📖 Consulte primeiro a [seção de Solução de Problemas](#-solução-de-problemas)
2. 🔍 Verifique os **logs detalhados** do console para erros específicos
3. 🐛 **Abra uma issue** no [repositório GitHub](https://github.com/TCC-JB-02-2025/tcc/issues)
4. 📧 Entre em contato com a equipe de desenvolvimento

**Documentação e Tutoriais:**
- 📚 [Wiki do Projeto](https://github.com/TCC-JB-02-2025/tcc/wiki)
- 📖 Documentação in-code em cada componente principal
- 🎥 Vídeos demonstrativos (em desenvolvimento)

**Comunidade:**
- 💬 [Discussions do GitHub](https://github.com/TCC-JB-02-2025/tcc/discussions)
- 📱 Discord da turma (acesso via convite)

### 🏢 Informações Acadêmicas

**Instituição:** ETEC João Belarmino - Centro Paula Souza  
**Curso:** Técnico em Desenvolvimento de Sistemas  
**Período:** 2025  
**Orientação:** Professor orientador Rubens Castaldelli Carlos.

### 📈 Roadmap e Funcionalidades Futuras

**Versão 2.0 (Planejada):**
- 🔔 Sistema de notificações push
- 📊 Dashboard analytics avançado
- 🗺️ Rastreamento GPS em tempo real
- � Integração com sistema de pagamento
- 🌐 API pública para desenvolvedores
- 📱 App para motoristas

**Contribuições Bem-vindas:**
- 🐛 Reports de bugs
- ✨ Sugestões de melhorias  
- 📝 Melhorias na documentação
- 🔧 Pull requests com correções
- 🧪 Testes e feedback de usabilidade

---

## 🏆 Reconhecimentos

### 👥 Equipe Principal

**🚀 Victor Ramos** - *Tech Lead & Full Stack Developer*
- Arquitetura do sistema e banco de dados
- Desenvolvimento backend (Express + MySQL)
- Desenvolvimento frontend (React + Vite)
- Integração de APIs e componentes
- Testes e otimização de performance
- DevOps e deployment
- Documentação técnica

**💻 Renan Andrade** - *Full Stack Developer*  
- Arquitetura do sistema e banco de dados
- Desenvolvimento backend (Express + MySQL)
- Desenvolvimento mobile
- Integração de APIs e componentes
- Testes e otimização de performance
- DevOps e deployment
- Documentação técnica

**🎨 Luiz Souza** - *Frontend Developer & UI/UX Designer*
- Design de interface e experiência do usuário
- Desenvolvimento de componentes visuais
- Responsividade

**📚 Sarah Porsch** - *Technical Writer & QA*
- Documentação do projeto e manuais
- Testes de qualidade e usabilidade  
- Análise de requisitos

**📋 Marcelo Camillo** - *Documentation*
- Gerenciamento de projeto e cronogramas
- Documentação de processos

### 🙏 Agradecimentos Especiais

- **ETEC João Belarmino** - Infraestrutura e apoio institucional
- **Centro Paula Souza** - Suporte educacional e recursos
- **Professores Orientadores** - Mentoria técnica e acadêmica
- **Comunidade Open Source** - Ferramentas e bibliotecas utilizadas
- **OpenStreetMap & ViaCEP** - APIs públicas utilizadas

### 🏅 Tecnologias e Créditos

Este projeto foi construído com amor e as seguintes tecnologias open source:
- ⚛️ **React** e **React Native** - Facebook/Meta
- ⚡ **Vite** - Evan You e equipe
- 🚀 **Node.js** e **Express** - OpenJS Foundation  
- 🗄️ **MySQL** - Oracle Corporation
- 🗺️ **Leaflet** - Vladimir Agafonkin
- 🎨 **Bootstrap** - Twitter/Bootstrap Team
- 📊 **Chart.js** - Chart.js Contributors

---

**⭐ Se este projeto foi útil para você ou te inspirou, considere dar uma estrela no repositório!**

**🔗 [github.com/TCC-JB-02-2025/tcc](https://github.com/TCC-JB-02-2025/tcc)**

---

*Desenvolvido pela turma de Desenvolvimento de Sistemas da ETEC João Belarmino - 2025*