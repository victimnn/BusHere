# 📧 Serviço de Email - BusHere! - Documentação Completa

> **Última atualização:** 14 de Outubro de 2025  
> **Versão:** 2.0.0 (Modular)  
> **Status:** ✅ Pronto para uso

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Modular](#arquitetura-modular)
3. [Configuração](#configuração)
4. [Uso Básico](#uso-básico)
5. [Funções Disponíveis](#funções-disponíveis)
6. [Templates de Email](#templates-de-email)
7. [Integração com Avisos](#integração-com-avisos)
8. [Testes](#testes)
9. [Changelog](#changelog)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O serviço de email do BusHere! foi projetado para ser **modular, reutilizável e fácil de expandir**. Utiliza **Nodemailer** para envio via SMTP e suporta múltiplos tipos de emails com templates HTML responsivos.

### Funcionalidades

- ✅ Envio de emails de convite para passageiros
- ✅ Envio de notificações/avisos por email
- ✅ Função genérica para qualquer tipo de email
- ✅ Templates HTML responsivos e profissionais
- ✅ Suporte a múltiplos destinatários
- ✅ Modo de desenvolvimento (simula envio)
- ✅ Tratamento robusto de erros
- ✅ Logs detalhados com emojis

### O que foi implementado

1. **`emailService.js`** - Serviço modular de email
   - Função genérica `sendEmail()`
   - Funções específicas: `sendInviteEmail()`, `sendNotificationEmail()`
   - Templates HTML reutilizáveis
   - Configuração SMTP centralizada

2. **Integração com Convites** (`inviteRoutes.js`)
   - Envio automático de email ao criar convite
   - Logs melhorados
   - Status de email na resposta

3. **Integração com Avisos** (exemplo fornecido)
   - Envio em massa para múltiplos destinatários
   - Filtro por escopo (todos, rota, tipo, individual)
   - Prioridades (ALTA, MEDIA, BAIXA)

---

## 🏗️ Arquitetura Modular

### Estrutura de Camadas

```
┌─────────────────────────────────────────────────────────┐
│          FUNÇÕES ESPECÍFICAS (API Pública)              │
│  sendInviteEmail()  │  sendNotificationEmail()  │ ...   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         FUNÇÃO GENÉRICA CENTRAL (Núcleo)                 │
│                  sendEmail()                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 TEMPLATES HTML                            │
│  getInviteEmailTemplate()  │  getNotificationEmail...   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│             TEMPLATE BASE & ESTILOS                       │
│                (getBaseEmailStyles)                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              CONFIGURAÇÃO SMTP                            │
│              createTransporter()                          │
└─────────────────────────────────────────────────────────┘
```

### Exports Disponíveis

```javascript
const {
  // Função principal (genérica)
  sendEmail,
  
  // Funções específicas
  sendInviteEmail,
  sendNotificationEmail,
  
  // Utilitários
  verifyEmailService,
  
  // Templates (para customização)
  getInviteEmailTemplate,
  getNotificationEmailTemplate
} = require('./services/emailService');
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie ou edite o arquivo **`server/.env`**:

```env
# ==========================================
# CONFIGURAÇÕES DE EMAIL (SMTP)
# ==========================================

# Servidor SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Credenciais
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Remetente
EMAIL_FROM=noreply@bushere.com

# TLS (opcional)
EMAIL_TLS_REJECT_UNAUTHORIZED=false

# URLs para links nos emails
WEBAPP_URL=http://localhost:5174
MOBILE_APP_URL=http://localhost:19006
```

### 2. Configuração por Provedor

#### 📮 Gmail (Recomendado para testes)

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma senha de aplicativo
3. Configure no `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Senha de app
```

#### 📮 Outlook/Office365

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@outlook.com
EMAIL_PASS=sua_senha
```

#### 📮 SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=SG.sua_api_key
```

#### 📮 Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@seu_dominio.mailgun.org
EMAIL_PASS=sua_senha_mailgun
```

#### 📮 Amazon SES

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=suas_credenciais_smtp
EMAIL_PASS=sua_senha_smtp
```

### 3. Modo de Desenvolvimento

**Sem configuração**: O sistema funciona sem SMTP configurado, mas apenas simula o envio:

```
📧 [modo dev] Email seria enviado para: usuario@example.com
📧 [modo dev] Assunto: Você foi convidado para o BusHere!
```

---

## 🚀 Uso Básico

### 1. Enviar Email de Convite

```javascript
const { sendInviteEmail } = require('./services/emailService');

// Enviar convite
const result = await sendInviteEmail(
  'passageiro@example.com',
  'ABC123XYZ'  // Código do convite
);

if (result.success) {
  console.log('✅ Email enviado!', result.messageId);
} else {
  console.error('❌ Erro:', result.error);
}
```

### 2. Enviar Email de Notificação/Aviso

```javascript
const { sendNotificationEmail } = require('./services/emailService');

// Um destinatário
const result = await sendNotificationEmail(
  'passageiro@example.com',
  {
    titulo: 'Manutenção Programada',
    conteudo: 'O sistema estará em manutenção no dia 20/10 das 2h às 6h.',
    prioridade: 'ALTA',  // ALTA, MEDIA, BAIXA
    data_expiracao: '2025-10-20T06:00:00Z',
    aviso_id: 123
  }
);

// Múltiplos destinatários
const results = await sendNotificationEmail(
  ['email1@example.com', 'email2@example.com', 'email3@example.com'],
  {
    titulo: 'Nova Rota Disponível',
    conteudo: 'A rota Centro-Bairro Norte está agora disponível!',
    prioridade: 'MEDIA'
  }
);

// Verificar resultados
results.forEach(r => {
  console.log(`${r.destinatario}: ${r.success ? '✅' : '❌'}`);
});
```

### 3. Enviar Email Genérico (Personalizado)

```javascript
const { sendEmail } = require('./services/emailService');

const result = await sendEmail({
  to: 'usuario@example.com',
  subject: 'Bem-vindo ao BusHere!',
  html: '<h1>Olá!</h1><p>Bem-vindo ao nosso sistema.</p>',
  text: 'Olá! Bem-vindo ao nosso sistema.',
  
  // Opcionais
  from: 'contato@bushere.com',
  fromName: 'Equipe BusHere',
  devMode: false  // true = apenas simula
});
```

---

## 📦 Funções Disponíveis

### `sendEmail(options)` - Função Genérica (Núcleo)

Função principal para envio de qualquer tipo de email.

**Parâmetros:**
```javascript
{
  to: string,              // Email destinatário (obrigatório)
  subject: string,         // Assunto (obrigatório)
  html: string,            // Conteúdo HTML (obrigatório se text vazio)
  text: string,            // Conteúdo texto plano (obrigatório se html vazio)
  from?: string,           // Email remetente (opcional)
  fromName?: string,       // Nome remetente (padrão: 'BusHere!')
  devMode?: boolean        // Modo dev (padrão: false)
}
```

**Retorno:**
```javascript
{
  success: boolean,
  message: string,
  info?: object,           // Informações do nodemailer
  messageId?: string,      // ID da mensagem
  error?: string,          // Erro (se houver)
  devMode?: boolean        // true se foi simulado
}
```

### `sendInviteEmail(email, codigoConvite, options)` - Email de Convite

Envia email de convite para passageiro.

**Parâmetros:**
```javascript
email: string,           // Email do convidado
codigoConvite: string,   // Código único do convite
options?: {
  devMode?: boolean      // Modo dev
}
```

**Exemplo:**
```javascript
const result = await sendInviteEmail('user@example.com', 'ABC123');
```

### `sendNotificationEmail(destinatarios, aviso, options)` - Email de Aviso

Envia email de notificação para um ou mais passageiros.

**Parâmetros:**
```javascript
destinatarios: string | string[],  // Email(s) destinatário(s)
aviso: {
  titulo: string,                  // Título do aviso
  conteudo: string,                // Conteúdo
  prioridade?: string,             // 'ALTA', 'MEDIA', 'BAIXA'
  data_expiracao?: string,         // Data de expiração
  aviso_id?: number                // ID do aviso (gera link)
},
options?: {
  devMode?: boolean                // Modo dev
}
```

**Retorno:** Array de resultados (um para cada destinatário)

**Exemplo:**
```javascript
const results = await sendNotificationEmail(
  ['email1@example.com', 'email2@example.com'],
  {
    titulo: 'Título',
    conteudo: 'Mensagem',
    prioridade: 'ALTA'
  }
);
```

### `verifyEmailService()` - Verificar Configuração

Verifica se o serviço de email está configurado corretamente.

**Retorno:** `Promise<boolean>`

**Exemplo:**
```javascript
const isConfigured = await verifyEmailService();
if (isConfigured) {
  console.log('✅ Email configurado');
} else {
  console.log('⚠️ Email NÃO configurado');
}
```

---

## 🎨 Templates de Email

### Templates Disponíveis

1. **Convite** (`getInviteEmailTemplate`)
   - Email de convite para passageiros
   - Código do convite destacado
   - Botão "Aceitar Convite"
   - Instruções de uso
   - Validade (7 dias)

2. **Notificação** (`getNotificationEmailTemplate`)
   - Email de aviso/notificação
   - 3 níveis de prioridade (cores diferentes)
   - Botão de ação personalizável
   - Data de expiração
   - Link para o aviso

### Classes CSS Disponíveis

Todos os templates compartilham estes estilos:

- `.highlight-box` - Caixa com destaque (borda verde)
- `.priority-high` - Modificador prioridade alta (vermelho)
- `.priority-medium` - Modificador prioridade média (amarelo)
- `.button` - Botão de ação
- `.button-container` - Container centralizado
- `.info-box` - Caixa de informações (fundo verde claro)
- `.message-box` - Caixa de mensagem

### Criar Novo Template

Para criar um novo tipo de email:

```javascript
// No emailService.js

const getMeuNovoEmailTemplate = (params) => {
  const { titulo, mensagem } = params;
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        /* Estilos CSS aqui */
      </style>
    </head>
    <body>
      <h1>${titulo}</h1>
      <p>${mensagem}</p>
    </body>
    </html>
  `;
};

// Função específica
const sendMeuNovoEmail = async (destinatario, dados, options = {}) => {
  const htmlContent = getMeuNovoEmailTemplate(dados);
  const textContent = `${dados.titulo}\n\n${dados.mensagem}`;
  
  return await sendEmail({
    to: destinatario,
    subject: dados.titulo,
    html: htmlContent,
    text: textContent,
    ...options
  });
};

// Adicionar nos exports
module.exports = {
  // ... exports existentes
  sendMeuNovoEmail,
  getMeuNovoEmailTemplate
};
```

---

## 📊 Integração com Avisos

### Exemplo Completo - POST de Aviso com Email

```javascript
// Em notificationRoutes.js
const { sendNotificationEmail } = require('../services/emailService');

router.post('/', extractToken, async (req, res) => {
  try {
    // 1. Criar aviso no banco
    const notification = { /* ... */ };
    const [insertResult] = await pool.query("INSERT INTO Avisos SET ?", [notification]);
    const avisoId = insertResult.insertId;
    
    // 2. Enviar emails (se solicitado)
    if (notification.enviar_email) {
      let emailsDestinatarios = [];
      
      // Buscar emails baseado no escopo
      if (notification.escopo_aviso_id === 1) {
        // Todos os passageiros
        const [passageiros] = await pool.query(
          "SELECT email FROM Passageiros WHERE email IS NOT NULL AND email != ''"
        );
        emailsDestinatarios = passageiros.map(p => p.email);
      }
      else if (notification.escopo_aviso_id === 2) {
        // Rota específica
        const [passageiros] = await pool.query(`
          SELECT DISTINCT p.email 
          FROM Passageiros p
          JOIN Contratos c ON p.passageiro_id = c.passageiro_id
          WHERE c.rota_id = ? AND p.email IS NOT NULL
        `, [notification.rota_alvo_id]);
        emailsDestinatarios = passageiros.map(p => p.email);
      }
      // ... outros escopos
      
      // Enviar
      if (emailsDestinatarios.length > 0) {
        const resultados = await sendNotificationEmail(
          emailsDestinatarios,
          {
            titulo: notification.titulo,
            conteudo: notification.conteudo,
            prioridade: notification.prioridade,
            data_expiracao: notification.data_expiracao,
            aviso_id: avisoId
          }
        );
        
        const sucessos = resultados.filter(r => r.success).length;
        const falhas = resultados.filter(r => !r.success).length;
        console.log(`📧 Emails: ${sucessos} ✅ | ${falhas} ❌`);
      }
    }
    
    res.json({ data: { aviso_id: avisoId, ...notification } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
});
```

### Escopos de Aviso

| ID | Nome | Descrição |
|----|------|-----------|
| 1  | Todos | Todos os passageiros |
| 2  | Rota | Passageiros de uma rota específica |
| 3  | Tipo | Passageiros de um tipo específico |
| 4  | Individual | Passageiro específico |

### Prioridades

- **ALTA**: `[URGENTE]` no assunto, borda vermelha 🔴
- **MEDIA**: `[IMPORTANTE]` no assunto, borda amarela 🟡
- **BAIXA**: Email normal, borda verde 🟢

---

## 🧪 Testes

### Teste Manual

```javascript
// server/src/services/testEmail.js
const { sendInviteEmail, verifyEmailService } = require('./emailService');

async function testar() {
  // Verificar configuração
  const isConfigured = await verifyEmailService();
  console.log('Configurado:', isConfigured);
  
  // Enviar teste
  const result = await sendInviteEmail('seu_email@gmail.com', 'TEST123');
  console.log('Resultado:', result);
}

testar();
```

Execute:
```bash
cd server
node src/services/testEmail.js
```

### Teste com Modo Dev

```javascript
const result = await sendEmail({
  to: 'teste@example.com',
  subject: 'Teste',
  html: '<p>Teste</p>',
  text: 'Teste',
  devMode: true  // ← Apenas simula
});
```

---

## 📝 Changelog

### v2.0.0 - Serviço Modular (14/10/2025)

**✨ Adicionado:**
- Função genérica `sendEmail()` (núcleo reutilizável)
- Função `sendNotificationEmail()` para avisos
- Template HTML para notificações com prioridades
- Suporte a múltiplos destinatários
- Logs melhorados com emojis
- Status de email na resposta de convites

**🔧 Mantido:**
- Função `sendInviteEmail()` (compatibilidade)
- Todas as configurações existentes
- Templates de convite

**🐛 Melhorado:**
- Tratamento de erros mais robusto
- Documentação consolidada
- Exemplos de uso completos

### v1.0.0 - Release Inicial

- Envio de emails de convite
- Integração com inviteRoutes
- Configuração SMTP básica

---

## ❓ Troubleshooting

### Problema: Emails não são enviados

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique o arquivo `.env`
2. Execute `verifyEmailService()` para diagnóstico
3. Verifique os logs no console

### Problema: "Authentication failed" com Gmail

**Causa:** Senha incorreta ou 2FA ativo

**Solução:**
1. Ative a verificação em 2 etapas
2. Crie uma senha de aplicativo
3. Use a senha de app no `EMAIL_PASS`

### Problema: Emails vão para SPAM

**Causa:** Remetente não verificado

**Solução:**
1. Configure SPF e DKIM no domínio
2. Use um serviço profissional (SendGrid, Mailgun)
3. Aqueça o IP gradualmente

### Problema: Erro "ETIMEDOUT" ou "ECONNREFUSED"

**Causa:** Porta bloqueada ou firewall

**Solução:**
1. Verifique se a porta 587 está aberta
2. Tente porta 465 com `EMAIL_SECURE=true`
3. Verifique firewall/antivírus

### Problema: Modo dev sempre ativo

**Causa:** Variáveis de ambiente não carregadas

**Solução:**
1. Instale `dotenv`: `npm install dotenv`
2. Carregue no início: `require('dotenv').config()`
3. Reinicie o servidor

---

## 📚 Recursos Adicionais

### Documentos Relacionados

- **Estrutura do Banco**: `server/migrations/`
- **Rotas de API**: `server/src/enterprise/`, `server/src/passenger/`
- **Helpers**: `server/src/helpers.js`

### Links Úteis

- [Nodemailer Docs](https://nodemailer.com/)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)

---

## ✅ Checklist de Implementação

- [x] Serviço de email modular criado
- [x] Função genérica `sendEmail()`
- [x] Função `sendInviteEmail()` (compatível)
- [x] Função `sendNotificationEmail()`
- [x] Templates HTML responsivos
- [x] Integração com convites
- [x] Documentação completa
- [x] Exemplos de uso
- [ ] Integração com avisos (próximo passo)
- [ ] Template de redefinição de senha
- [ ] Template de confirmação de cadastro
- [ ] Fila de emails (opcional)

---

**📧 Serviço pronto para uso!**

Para dúvidas ou sugestões, consulte o código em `server/src/services/emailService.js` ou entre em contato com a equipe.

**Criado seguindo o protocolo CURSOR.md** 🤖
