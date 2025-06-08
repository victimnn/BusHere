# 🚌 BusHere! - Sistema de Gestão de Transporte Público

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://www.mysql.com/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-purple.svg)](https://expo.dev/)

O **BusHere!** é um sistema completo de gestão de transporte público desenvolvido como Trabalho de Conclusão de Curso (TCC) da ETEC João Belarmino do Centro Paula Souza. O projeto inclui uma aplicação web para administração, um aplicativo móvel para passageiros e uma API robusta para integração de dados.

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

### 🖥️ Aplicação Web (Admin)
- **Gestão de Passageiros**: Cadastro, edição e visualização completa de passageiros
- **Sistema de Busca**: Pesquisa avançada com autocomplete
- **Interface Responsiva**: Design moderno com Bootstrap e componentes personalizados
- **Validação de Dados**: Validação em tempo real de CPF, telefone e e-mail
- **Paginação**: Navegação eficiente para grandes volumes de dados

### 📱 Aplicativo Móvel
- **Interface Nativa**: Desenvolvido com React Native e Expo
- **Cartões de Linha**: Visualização intuitiva das linhas de ônibus
- **Componentização**: Arquitetura modular e reutilizável

### 🔧 API Backend
- **RESTful API**: Endpoints organizados e documentados
- **Autenticação**: Sistema de tokens JWT
- **Validação**: Validação robusta de dados de entrada
- **Banco de Dados**: MySQL com migrations organizadas
- **Middleware**: CORS, autenticação e tratamento de erros

## 🏗️ Arquitetura

```
BusHere!
├── 🌐 Frontend Web (React + Vite)
├── 📱 Mobile App (React Native + Expo) 
├── ⚙️ Backend API (Node.js + Express)
└── 🗄️ Database (MySQL)
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
cd bushere
```

### 2. Setup Automático
Execute o script de configuração que instalará todas as dependências e configurará os arquivos de ambiente:

```bash
npm run setup
```

Este comando irá:
- Instalar dependências na raiz do projeto
- Instalar dependências do frontend (`web/`)
- Instalar dependências do backend (`server/`)
- Copiar arquivos `.env.example` para `.env`
- Configurar o banco de dados

### 3. Configurar Banco de Dados
Edite o arquivo `server/.env` com suas credenciais:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=bushere_db
```

### 4. Executar o Sistema
```bash
npm start
```

O sistema iniciará automaticamente:
- 🌐 Frontend: http://localhost:5173
- ⚙️ Backend: http://localhost:3000
- 📱 Mobile: Use o Expo CLI separadamente

## ⚙️ Configuração Manual

Se preferir configurar manualmente ou encontrar problemas:

### Frontend (Web)
```bash
cd web
npm install
cp .env.example .env
npm run dev
```

### Backend (Server)
```bash
cd server
npm install
cp .env.example .env
# Configure as variáveis do banco no .env
npm run setup  # Configura o banco de dados
npm start
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## 🚦 Execução

### Desenvolvimento
```bash
# Executa web + server simultaneamente
npm start

# Executa apenas o frontend
npm run start --prefix web

# Executa apenas o backend
npm run start --prefix server

# Executa o mobile
cd mobile && npx expo start
```

### Produção
```bash
# Build do frontend
cd web && npm run build

# Inicia servidor em produção
cd server && NODE_ENV=production npm start
```

## 📁 Estrutura do Projeto

```
bushere/
├── 📁 web/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   └── passengers/    # Componentes específicos de passageiros
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── api/              # Configuração da API
│   │   └── utils/            # Utilitários e helpers
│   └── public/               # Arquivos estáticos
│
├── 📁 server/                 # Backend API
│   ├── src/
│   │   ├── routes/           # Rotas da API
│   │   ├── helpers.js        # Funções auxiliares
│   │   └── setupDB.js        # Configuração do banco
│   └── migrations/           # Scripts SQL de migração
│
├── 📁 mobile/                 # App React Native
│   ├── app/                  # Telas do app
│   ├── components/           # Componentes reutilizáveis
│   └── assets/               # Imagens e fontes
│
├── package.json              # Configuração raiz
└── README.md                 # Este arquivo
```

## 🛠️ Tecnologias

### Frontend Web
- **React 19** - Biblioteca UI
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Bootstrap 5** - Framework CSS
- **Chart.js** - Gráficos e visualizações
- **Sass** - Pré-processador CSS

### Mobile
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação baseada em arquivos

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **MySQL2** - Driver do banco de dados
- **bcrypt** - Hash de senhas
- **CORS** - Cross-origin resource sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

### Banco de Dados
- **MySQL 8.0+** - Sistema de gerenciamento de banco de dados
- **Migrations** - Versionamento do esquema do banco

## 🌐 API Endpoints

### Passageiros
```http
GET    /api/passengers          # Listar passageiros (com paginação)
GET    /api/passengers/:id      # Obter passageiro por ID
POST   /api/passengers          # Criar novo passageiro
PUT    /api/passengers/:id      # Atualizar passageiro
DELETE /api/passengers/:id      # Excluir passageiro
GET    /api/passengers/tipos    # Listar tipos de passageiro
```

### Autenticação
```http
POST   /api/auth/register       # Registrar usuário
POST   /api/auth/login          # Fazer login
POST   /api/auth/logout         # Fazer logout
```

### Busca
```http
GET    /api/search              # Busca global no sistema
```

## 📝 Scripts Disponíveis

### Raiz do Projeto
```bash
npm run setup    # Configuração inicial completa
npm start        # Executa web + server simultaneamente
```

### Frontend (web/)
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Linter ESLint
```

### Backend (server/)
```bash
npm start        # Inicia o servidor
npm run dev      # Servidor com nodemon
npm run setup    # Configura banco de dados
```

### Mobile (mobile/)
```bash
npm start        # Inicia Expo
npm run android  # Build para Android
npm run ios      # Build para iOS
npm run web      # Versão web do app
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

### Problemas Comuns

**Erro de conexão com banco de dados:**
```bash
# Verifique se o MySQL está rodando
# Confirme as credenciais no arquivo .env
# Execute as migrations: npm run setup no diretório server/
```

**Porta já em uso:**
```bash
# Frontend (5173) ou Backend (3000) já em uso
# Termine os processos ou mude as portas nos arquivos de configuração
```

**Dependências não instaladas:**
```bash
# Execute npm install em cada diretório (raiz, web/, server/, mobile/)
```

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 👥 Equipe de Desenvolvimento

- **Victor Ramos** - Desenvolvimento Full Stack, Banco de Dados, Documentação e Design
- **Renan Andrade** - Desenvolvimento Full Stack e Mobile
- **Luiz Souza** - Desenvolvimento FrontEnd e Design
- **Sarah Porsch** - Documentação
- **Marcelo Camillo** - Documentação e Banco de Dados

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção [Solução de Problemas](#-solução-de-problemas)
2. Consulte os logs do console para erros específicos
3. Abra uma issue no repositório GitHub
4. Entre em contato com a equipe de desenvolvimento

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**
