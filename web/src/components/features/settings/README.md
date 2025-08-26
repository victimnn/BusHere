# Componentes de Configurações

Este diretório contém os componentes relacionados às configurações do sistema.

## UserProfile

### Descrição
Componente para exibir informações do perfil do usuário da empresa de forma dinâmica e interativa.

### Funcionalidades
- **Exibição de Dados Reais**: Mostra informações reais do usuário autenticado
- **Interface Expansível**: Botão "Mais/Menos" para mostrar detalhes adicionais
- **Informações Básicas**: Nome, login, email, telefone
- **Informações do Sistema**: ID, datas de criação/atualização, último login, IP
- **Status da Conta**: Status ativo/inativo, tipo de usuário, sessão ativa
- **Ações Rápidas**: Botões para editar perfil, histórico e permissões

### Dados Exibidos
O componente utiliza diretamente os dados do usuário retornados pela API `/auth/me`, que incluem:

#### Campos da Tabela UsuariosEmpresa:
- `usuario_empresa_id`: ID único do usuário
- `nome`: Nome completo do usuário
- `login_usuario`: Login de acesso ao sistema
- `email`: Email do usuário
- `telefone`: Número de telefone
- `data_ultimo_login`: Timestamp do último login
- `ip_ultimo_login`: IP do último login
- `criacao`: Data de criação da conta
- `atualizacao`: Data da última atualização
- `ativo`: Status da conta (boolean)

### Como Funciona
1. **Autenticação**: O usuário é autenticado via `/auth/me`
2. **Dados**: Os dados são extraídos da resposta `{ success: true, user: {...} }`
3. **Renderização**: O componente renderiza os dados em tempo real
4. **Interatividade**: Usuário pode expandir/contrair detalhes

### Estrutura da API
```javascript
// Endpoint: GET /auth/me
// Resposta:
{
  success: true,
  user: {
    usuario_empresa_id: 1,
    nome: "Administrador",
    login_usuario: "admin",
    email: "admin@admin.com",
    telefone: "40028992",
    data_ultimo_login: "2024-01-15T10:30:00Z",
    ip_ultimo_login: "192.168.1.100",
    criacao: "2024-01-01T00:00:00Z",
    atualizacao: "2024-01-15T10:30:00Z",
    ativo: true
  }
}
```

### Uso
```jsx
import UserProfile from './UserProfile';

<UserProfile
  user={user} // Dados do usuário do contexto de autenticação
  onLogout={logout} // Função de logout
  animationDelay="0.1s" // Delay para animação
/>
```

### Vantagens da Implementação
1. **Dados Reais**: Não mais dados estáticos/hardcoded
2. **Performance**: Sem chamadas adicionais à API
3. **Consistência**: Dados sempre sincronizados com o backend
4. **Manutenibilidade**: Código mais limpo e direto
5. **Experiência do Usuário**: Informações sempre atualizadas

## SystemInfo

### Descrição
Componente para exibir informações do sistema em tempo real.

### Funcionalidades
- **Health Check do Servidor**: Verifica status do servidor e banco de dados
- **Informações do Navegador**: Memória, cache, tempo de carregamento
- **Métricas do Sistema**: Uptime, uso de RAM, status da conexão
- **Atualizações Automáticas**: Dados são atualizados a cada 30 segundos
- **Tratamento de Erros**: Exibe mensagens de erro com opção de retry

### Endpoints Utilizados
- `/debug/health-simple`: Status simplificado do servidor e banco
- Retorna: `{ dbConnected, dbPing, serverUptime, memoryUsage }`

### Dados Exibidos
- **Versão do Sistema**: Detectada automaticamente
- **Ambiente**: Desenvolvimento/Produção baseado no hostname
- **Status do Servidor**: Online/Offline/Timeout
- **Status do Banco**: Conectado/Desconectado
- **Uptime**: Tempo de funcionamento do servidor
- **RAM do Servidor**: Uso de memória em MB
- **Tempo Ativo**: Tempo da sessão atual
- **Cache Local**: Tamanho do localStorage
- **Memória do Navegador**: Uso de heap JavaScript

### Como Funciona
1. **Inicialização**: Carrega dados básicos do navegador
2. **Health Check**: Faz requisição ao servidor para status
3. **Atualizações**: Atualiza dados periodicamente
4. **Fallbacks**: Usa valores padrão quando APIs não estão disponíveis

### Tratamento de Erros
- **Timeout**: 5 segundos para requisições ao servidor
- **APIs do Navegador**: Verifica disponibilidade antes de usar
- **Fallbacks**: Valores padrão para campos não disponíveis
- **Retry**: Botão para tentar novamente em caso de erro

### Compatibilidade
- **Navegadores Antigos**: Usa AbortController em vez de AbortSignal.timeout
- **Performance API**: Verifica disponibilidade de performance.memory
- **Timing API**: Fallback para navegadores sem performance.timing

## Outros Componentes

### ThemeSwitch
- Alterna entre tema claro e escuro
- Persiste preferência no localStorage

### SettingSection
- Container para grupos de configurações
- Suporte a ícones e descrições

### SettingItem
- Item individual de configuração
- Suporte a diferentes tipos de valores

### PageHeader
- Cabeçalho da página de configurações
- Título, descrição e ícone

## Estrutura de Dados

### Contexto de Autenticação
```javascript
const { user, isAuthenticated, isLoading, logout } = useAuth();
```

### Dados do Usuário
```javascript
user: {
  usuario_empresa_id: number,
  nome: string,
  login_usuario: string,
  email: string,
  telefone: string,
  data_ultimo_login: string,
  criacao: string,
  atualizacao: string,
  ativo: boolean,
  ip_ultimo_login: string
}
```

### Configurações
```javascript
settings: [
  {
    id: number,
    name: string,
    description: string,
    value: string,
    icon: string
  }
]
```

## Melhorias Futuras

1. **Edição de Perfil**: Formulário para atualizar dados do usuário
2. **Histórico de Login**: Lista de logins anteriores
3. **Permissões**: Sistema de permissões e roles
4. **Notificações**: Sistema de notificações em tempo real
5. **Backup**: Exportar/importar configurações
6. **Auditoria**: Log de mudanças nas configurações
