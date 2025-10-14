# 📧 Configuração de Envio de Emails - BusHere!

## 🎯 Objetivo

Este guia explica como configurar o envio automático de emails para convites de passageiros no sistema BusHere!

## ✅ O que foi implementado

1. **Serviço de Email** (`server/src/services/emailService.js`)
   - Configuração SMTP com Nodemailer
   - Template HTML responsivo para emails
   - Suporte para múltiplos provedores de email
   - Modo de desenvolvimento (sem necessidade de SMTP)

2. **Integração com Convites** (`server/src/enterprise/inviteRoutes.js`)
   - Envio automático de email ao criar convite
   - Tratamento de erros sem quebrar o fluxo
   - Logs detalhados de envio

3. **Documentação Completa**
   - README detalhado do serviço
   - Script de teste automatizado
   - Exemplos de configuração para diferentes provedores

## 🚀 Como Usar

### 1. Configuração Básica (Opcional)

O sistema funciona **sem configuração de email**, mas não enviará emails reais. Para habilitar o envio:

**Crie ou edite o arquivo `server/.env`:**

```env
# Configurações de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=noreply@bushere.com
WEBAPP_URL=http://localhost:5174
```

### 2. Configuração Gmail (Recomendado para Testes)

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma senha de aplicativo
3. Use a senha gerada no `EMAIL_PASS`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 3. Testar Configuração

```bash
cd server
npm run test:email
```

Este comando irá:
- ✅ Verificar variáveis de ambiente
- ✅ Testar conexão SMTP
- ✅ Enviar um email de teste

### 4. Usar no Sistema

Ao criar um convite pela interface web:

1. Acesse: http://localhost:5173/passageiros
2. Clique em "Convites"
3. Digite o email do passageiro
4. Clique em "Gerar Convite"

**O email será enviado automaticamente! 📧**

## 📨 Template do Email

O email enviado contém:

- 🎨 Design HTML responsivo
- 📋 Código do convite
- 🔗 Botão "Aceitar Convite" com link direto
- 📝 Instruções passo a passo
- ⏰ Informação de validade (7 dias)
- 📞 Informações de contato/suporte

## 🔧 Provedores Suportados

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Outlook/Office365
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Mailtrap (Testes)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
```

### SendGrid (Produção)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=sua_api_key_sendgrid
```

## 🛡️ Segurança

✅ **Boas Práticas:**
- Nunca comite o arquivo `.env` no Git
- Use senhas de aplicativo (não a senha principal)
- Em produção, configure `EMAIL_TLS_REJECT_UNAUTHORIZED=true`
- Monitore logs de envio

## 📚 Arquivos Criados/Modificados

### Arquivos Novos:
```
server/
  ├── src/
  │   └── services/
  │       ├── emailService.js      # Serviço de email
  │       ├── testEmail.js         # Script de teste
  │       └── README.md            # Documentação detalhada
```

### Arquivos Modificados:
```
server/
  ├── package.json                 # Adicionado nodemailer e script de teste
  ├── .env.example                 # Variáveis de ambiente para email
  └── src/
      └── enterprise/
          └── inviteRoutes.js      # Integração com envio de email
```

## 🧪 Testes

### Teste Manual

1. Inicie o servidor:
   ```bash
   npm start
   ```

2. Crie um convite pela interface web

3. Verifique o console para logs:
   ```
   ✅ Email enviado com sucesso para: usuario@exemplo.com
   📨 Message ID: <abc123@gmail.com>
   ```

### Teste Automatizado

```bash
npm run test:email
```

## 📊 Logs

### Modo Desenvolvimento (sem configuração)
```
📧 [MODO DE DESENVOLVIMENTO] Email de convite seria enviado para: usuario@exemplo.com
📋 Código do convite: ABC123XYZ789...
```

### Modo Produção (com configuração)
```
✅ Email enviado com sucesso para: usuario@exemplo.com
📨 Message ID: <abc123@gmail.com>
```

### Erros
```
❌ Erro ao enviar email para usuario@exemplo.com: Connection timeout
⚠️ Convite criado mas email não foi enviado para: usuario@exemplo.com
```

## 🌐 Produção

Para ambientes de produção, recomenda-se:

1. **Usar serviço profissional:**
   - SendGrid (100 emails/dia grátis)
   - Amazon SES (pay-as-you-go)
   - Mailgun
   - Postmark

2. **Configurar no servidor:**
   - Adicione variáveis de ambiente
   - Configure `EMAIL_TLS_REJECT_UNAUTHORIZED=true`
   - Use `WEBAPP_URL` com domínio real

3. **Monitoramento:**
   - Taxas de entrega
   - Emails rejeitados
   - Tempo de resposta

## 💡 Dicas

- ✅ Teste primeiro com Mailtrap (https://mailtrap.io)
- ✅ Verifique a caixa de spam ao testar
- ✅ Use emails reais apenas em produção
- ✅ Configure SPF/DKIM para melhor entrega
- ✅ Monitore logs do servidor

## 🆘 Problemas Comuns

### Email não chega

1. Verifique configurações no `.env`
2. Execute `npm run test:email`
3. Verifique logs do servidor
4. Teste credenciais SMTP

### Gmail bloqueia

1. Use senha de aplicativo
2. Habilite acesso a apps menos seguros
3. Verifique verificação em duas etapas

### Email vai para spam

1. Configure SPF, DKIM e DMARC
2. Use domínio profissional
3. Evite palavras spam
4. Use serviço profissional (SendGrid, etc)

## 📖 Documentação Adicional

- **Documentação Completa:** `server/src/services/README.md`
- **Nodemailer Docs:** https://nodemailer.com/
- **Gmail SMTP:** https://support.google.com/mail/answer/7126229

---

**Desenvolvido seguindo o protocolo CURSOR.md** 🚀
**BusHere! Sistema de Gestão de Transporte** 🚌
