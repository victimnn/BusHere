# 📧 Services - BusHere!# 📧 Serviço de Email - BusHere!



Este diretório contém os serviços do sistema BusHere!Este documento explica como configurar o envio de emails no sistema BusHere!, incluindo convites para passageiros.



## 📁 Arquivos## 📋 Visão Geral



- **`emailService.js`** - Serviço modular de envio de emailsO sistema utiliza **Nodemailer** para envio de emails via SMTP. Quando um convite é gerado, um email automático é enviado para o endereço do convidado contendo:

- **`testEmail.js`** - Script de teste para o serviço de email- Código único do convite

- **`EMAIL_SERVICE_DOCS.md`** - 📚 **Documentação completa do serviço de email**- Link direto para aceitar o convite

- Instruções de uso

## 📖 Documentação- Data de expiração (7 dias)



Para informações completas sobre o serviço de email, incluindo:## ⚙️ Configuração

- Configuração

- Uso e exemplos### 1. Variáveis de Ambiente

- Integração com avisos

- Templates disponíveisAdicione as seguintes variáveis no arquivo `.env` do servidor:

- Troubleshooting

```env

**Leia:** [`EMAIL_SERVICE_DOCS.md`](./EMAIL_SERVICE_DOCS.md)# Configurações de Email (SMTP)

EMAIL_HOST=smtp.gmail.com

## 🚀 Início RápidoEMAIL_PORT=587

EMAIL_SECURE=false

### Enviar Email de ConviteEMAIL_USER=seu_email@gmail.com

EMAIL_PASS=sua_senha_de_app

```javascriptEMAIL_FROM=noreply@bushere.com

const { sendInviteEmail } = require('./services/emailService');EMAIL_TLS_REJECT_UNAUTHORIZED=false

WEBAPP_URL=http://localhost:5174

await sendInviteEmail('usuario@example.com', 'ABC123');```

```

### 2. Configuração por Provedor

### Enviar Email de Notificação

#### 📮 Gmail

```javascript

const { sendNotificationEmail } = require('./services/emailService');1. Acesse [Senhas de App do Google](https://myaccount.google.com/apppasswords)

2. Crie uma nova senha de aplicativo

await sendNotificationEmail(3. Configure no `.env`:

  ['email1@example.com', 'email2@example.com'],

  {```env

    titulo: 'Título do Aviso',EMAIL_HOST=smtp.gmail.com

    conteudo: 'Conteúdo da notificação',EMAIL_PORT=587

    prioridade: 'ALTA'EMAIL_SECURE=false

  }EMAIL_USER=seu_email@gmail.com

);EMAIL_PASS=senha_de_app_gerada

``````



### Testar Serviço#### 📮 Outlook/Office365



```bash```env

cd serverEMAIL_HOST=smtp-mail.outlook.com

node src/services/testEmail.jsEMAIL_PORT=587

```EMAIL_SECURE=false

EMAIL_USER=seu_email@outlook.com

---EMAIL_PASS=sua_senha

```

**Para documentação completa, veja:** [`EMAIL_SERVICE_DOCS.md`](./EMAIL_SERVICE_DOCS.md)

#### 📮 Yahoo

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@yahoo.com
EMAIL_PASS=sua_senha_de_app
```

#### 📮 Mailtrap (Desenvolvimento/Testes)

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASS=sua_senha_mailtrap
```

#### 📮 SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=sua_api_key_sendgrid
```

### 3. Modo de Desenvolvimento

Se as variáveis de email **não estiverem configuradas**, o sistema:
- ✅ Funcionará normalmente
- ✅ Criará convites no banco de dados
- ℹ️ Não enviará emails reais
- 📝 Registrará logs no console simulando o envio

Isso permite desenvolvimento sem precisar configurar SMTP.

## 🚀 Uso

### Criar Convite (com envio de email automático)

```javascript
// Rota: POST /api/enterprise/invites
{
  "email": "usuario@exemplo.com"
}
```

O sistema automaticamente:
1. Gera um código único de convite
2. Salva no banco de dados
3. **Envia email para o destinatário**
4. Retorna os dados do convite criado

## 📨 Template do Email

O email enviado é HTML responsivo e inclui:

- ✉️ **Assunto:** "🚌 Você foi convidado para o BusHere!"
- 🎨 **Design:** Visual moderno com cores do sistema
- 📋 **Conteúdo:**
  - Mensagem de boas-vindas
  - Código do convite (com destaque)
  - Botão "Aceitar Convite" (link direto)
  - Instruções passo a passo
  - Informação de validade (7 dias)
  - Rodapé com informações de contato

### Exemplo Visual

```
┌─────────────────────────────────┐
│  🚌 BusHere!                    │
│  Sistema de Gestão de Transporte│
├─────────────────────────────────┤
│                                  │
│  Você foi convidado!            │
│                                  │
│  Olá,                           │
│                                  │
│  Você recebeu um convite para   │
│  se cadastrar no BusHere!...    │
│                                  │
│  ┌──────────────────────────┐  │
│  │ 📋 Código do Convite     │  │
│  │ ABC123XYZ789...          │  │
│  └──────────────────────────┘  │
│                                  │
│     [  Aceitar Convite  ]       │
│                                  │
│  Como usar este convite:        │
│  1. Clique no botão acima       │
│  2. Preencha seus dados         │
│  3. Comece a usar o BusHere!    │
│                                  │
├─────────────────────────────────┤
│  BusHere! - Sistema de Gestão   │
│  suporte@bushere.com            │
└─────────────────────────────────┘
```

## 🔍 Verificação e Logs

### Logs de Sucesso

```
✅ Email de convite enviado com sucesso para: usuario@exemplo.com
📨 Message ID: <abc123@gmail.com>
```

### Logs de Desenvolvimento

```
📧 [MODO DE DESENVOLVIMENTO] Email de convite seria enviado para: usuario@exemplo.com
📋 Código do convite: ABC123XYZ789...
```

### Logs de Erro

```
❌ Erro ao enviar email para usuario@exemplo.com: Connection timeout
⚠️ Convite criado mas email não foi enviado para: usuario@exemplo.com
```

## 🛡️ Segurança

### Boas Práticas

1. **Nunca comitar o arquivo `.env`** com credenciais reais
2. Use **senhas de aplicativo** em vez de senhas principais (Gmail, Yahoo)
3. Em produção, configure `EMAIL_TLS_REJECT_UNAUTHORIZED=true`
4. Use **variáveis de ambiente** no servidor de produção
5. Monitore logs de envio para detectar problemas

### Validação de Email

O sistema valida emails antes de enviar:
- ✅ Formato válido (regex completo)
- ✅ Domínio com extensão válida
- ✅ Caracteres permitidos

## 🔧 Troubleshooting

### Email não está sendo enviado

1. **Verifique as variáveis de ambiente:**
   ```bash
   # No servidor
   echo $EMAIL_HOST
   echo $EMAIL_USER
   ```

2. **Teste a conexão SMTP:**
   ```javascript
   const { verifyEmailService } = require('./src/services/emailService');
   await verifyEmailService();
   ```

3. **Verifique logs do servidor:**
   - Procure por mensagens de erro relacionadas a email
   - Verifique se as credenciais estão corretas

### Gmail bloqueia o envio

1. Habilite "Acesso a apps menos seguros" ou use Senhas de App
2. Verifique se a verificação em duas etapas está ativa
3. Use uma senha de aplicativo dedicada

### Porta bloqueada

Se a porta 587 estiver bloqueada, tente:
- Porta 465 (SSL): Configure `EMAIL_SECURE=true`
- Porta 25 (não recomendado para produção)

### Email vai para spam

Para evitar que emails sejam marcados como spam:
1. Configure SPF, DKIM e DMARC no seu domínio
2. Use um provedor de email profissional (SendGrid, Amazon SES)
3. Evite palavras spam no conteúdo
4. Mantenha lista de emails limpa

## 📊 Monitoramento

### Métricas Importantes

- Taxa de entrega de emails
- Tempo de resposta SMTP
- Erros de autenticação
- Emails rejeitados/bounce

### Logs Recomendados

```javascript
// Em produção, considere integrar com serviços de log
console.log(`📧 Email enviado: ${email} | Status: ${status} | Time: ${time}ms`);
```

## 🌐 Produção

### Provedores Recomendados

Para produção, considere usar serviços especializados:

1. **SendGrid** - Até 100 emails/dia grátis
2. **Amazon SES** - Pay-as-you-go, muito escalável
3. **Mailgun** - Boa documentação e APIs
4. **Postmark** - Focado em emails transacionais

### Configuração no Render (exemplo)

No painel do Render, adicione as variáveis de ambiente:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@seudominio.com
WEBAPP_URL=https://seuapp.onrender.com
```

## 📚 Referências

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Best Practices for Transactional Emails](https://postmarkapp.com/guides/transactional-email-best-practices)

## 💡 Dicas

1. **Teste localmente** com Mailtrap antes de usar email real
2. **Monitore** taxas de bounce e rejeição
3. **Personalize** templates para melhor conversão
4. **Documente** todas as configurações de produção
5. **Faça backup** das configurações SMTP

---

**Desenvolvido para BusHere! Sistema de Gestão de Transporte** 🚌
