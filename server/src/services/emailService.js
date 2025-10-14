const nodemailer = require('nodemailer');

/**
 * Serviço de envio de emails para o sistema BusHere!
 * Utiliza Nodemailer com suporte para diferentes provedores SMTP
 */

// Configuração do transporter (serviço de email)
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Variáveis de email não configuradas. Emails não serão enviados.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false'
    }
  });
};

/**
 * Template HTML para email de convite
 */
const getInviteEmailTemplate = (emailConvidado, codigoConvite, linkConvite) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite BusHere!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #12BE4D 0%, #20c997 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .logo {
          display: inline-block;
          font-size: 40px;
          margin-right: 10px;
          vertical-align: middle;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .header p {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #12BE4D;
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .content p {
          margin: 15px 0;
          font-size: 16px;
          color: #555;
        }
        .invite-code {
          background: #f8f9fa;
          border-left: 4px solid #12BE4D;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .invite-code strong {
          display: block;
          color: #12BE4D;
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .invite-code code {
          display: block;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #333;
          background: white;
          padding: 10px;
          border-radius: 4px;
          word-break: break-all;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #12BE4D;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          transition: background 0.3s ease;
        }
        .button:hover {
          background: #0E8F3A;
        }
        .instructions {
          background: #e7f5f1;
          border-radius: 6px;
          padding: 20px;
          margin: 25px 0;
        }
        .instructions h3 {
          color: #12BE4D;
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .instructions ol {
          margin: 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 8px 0;
          color: #555;
        }
        .footer {
          background: #f8f9fa;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #6c757d;
        }
        .footer a {
          color: #12BE4D;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          vertical-align: middle;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="logo">🚌</span>BusHere!</h1>
        </div>
        
        <div class="content">
          <h2>Você foi convidado!</h2>
          
          <p>Olá,</p>
          
          <p>
            Você recebeu um convite para se cadastrar no <strong>BusHere!</strong>, 
            o app de transporte que facilita o seu dia a dia.
          </p>
          
          <div class="invite-code">
            <strong>📋 Código do Convite</strong>
            <code>${codigoConvite}</code>
          </div>
          
          <div class="button-container">
            <a href="${linkConvite}" class="button">
              Aceitar Convite
            </a>
          </div>
          
          <div class="instructions">
            <h3>Como usar este convite?</h3>
            <ol>
              <li>Clique no botão "Aceitar Convite" acima</li>
              <li>Você será redirecionado para a página do convite</li>
              <li>Aceite o convite se estiver logado ou crie uma conta</li>
              <li>Preencha seus dados pessoais</li>
              <li>Comece a usar o BusHere!</li>
            </ol>
          </div>
          
          <p style="margin-top: 30px;">
            <strong>⏰ Validade:</strong> Este convite é válido por 7 dias a partir da data de envio.
          </p>
          
          <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
            Se você não solicitou este convite ou não deseja se cadastrar, 
            pode ignorar este email com segurança.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>BusHere!</strong></p>
          <p>
            Se precisar de ajuda, entre em contato: 
            <a href="mailto:bushereapp@gmail.com">bushereapp@gmail.com</a>
          </p>
          <p style="font-size: 12px; margin-top: 15px;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Envia email de convite para o passageiro
 * @param {string} emailConvidado - Email do destinatário
 * @param {string} codigoConvite - Código único do convite
 * @returns {Promise<Object>} Resultado do envio
 */
const sendInviteEmail = async (emailConvidado, codigoConvite) => {
  const transporter = createTransporter();
  
  // Se não houver transporter configurado, retornar sucesso simulado
  if (!transporter) {
    console.log(` [modo dev] Email de convite seria enviado para: ${emailConvidado}`);
    console.log(` [modo dev] Código do convite: ${codigoConvite}`);
    return {
      success: true,
      message: 'Email não enviado (modo de desenvolvimento)',
      info: null
    };
  }

  // Construir link do convite (ajustar URL se hospedado em outro lugar)
  const baseUrl = process.env.WEBAPP_URL || 'http://localhost:5174';
  const linkConvite = `${baseUrl}/convite/${codigoConvite}`;

  // Configurar opções do email
  const mailOptions = {
    from: {
      name: 'BusHere!',
      address: process.env.EMAIL_FROM || process.env.EMAIL_USER
    },
    to: emailConvidado,
    subject: 'Você foi convidado para o BusHere!',
    html: getInviteEmailTemplate(emailConvidado, codigoConvite, linkConvite),
    text: `
Você foi convidado para o BusHere!

Olá,

Você recebeu um convite para se cadastrar no BusHere!, o app de transporte que facilita seu dia a dia.

Código do Convite: ${codigoConvite}

Para aceitar o convite, acesse o link:
${linkConvite}

Como usar este convite:
1. Clique no botão "Aceitar Convite" acima
2. Você será redirecionado para a página do convite
3. Aceite o convite se estiver logado ou crie uma conta
4. Preencha seus dados pessoais
5. Comece a usar o BusHere!

Validade: Este convite é válido por 7 dias a partir da data de envio.

Se você não solicitou este convite ou não deseja se cadastrar, pode ignorar este email com segurança.

---
BusHere! - Sistema de Transportes
Suporte: bushereapp@gmail.com
    `.trim()
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email de convite enviado com sucesso para: ${emailConvidado}`);
    console.log(`Message ID: ${info.messageId}`);
    
    return {
      success: true,
      message: 'Email enviado com sucesso',
      info: info
    };
  } catch (error) {
    console.error(`Erro ao enviar email para ${emailConvidado}:`, error.message);
    
    return {
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    };
  }
};

/**
 * Verifica se o serviço de email está configurado corretamente
 * @returns {Promise<boolean>} True se configurado, false caso contrário
 */
const verifyEmailService = async () => {
  const transporter = createTransporter();
  
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log('Serviço de email está pronto para enviar mensagens');
    return true;
  } catch (error) {
    console.error('Erro na configuração do serviço de email:', error.message);
    return false;
  }
};

// ============================================================================
// FUNÇÃO GENÉRICA DE ENVIO (NÚCLEO MODULAR REUTILIZÁVEL)
// ============================================================================

/**
 * Função genérica e modular para envio de emails
 * USE ESTA para qualquer tipo de email personalizado
 * 
 * @param {Object} options - Opções do email
 * @param {string} options.to - Email do destinatário
 * @param {string} options.subject - Assunto do email
 * @param {string} options.html - Conteúdo HTML do email
 * @param {string} options.text - Conteúdo em texto plano (fallback)
 * @param {string} [options.from] - Email do remetente (opcional)
 * @param {string} [options.fromName] - Nome do remetente (opcional, padrão: 'BusHere!')
 * @param {boolean} [options.devMode] - Se true, simula envio sem enviar
 * @returns {Promise<Object>} {success, message, info/error, messageId}
 */
const sendEmail = async (options) => {
  const {
    to,
    subject,
    html,
    text,
    from,
    fromName = 'BusHere!',
    devMode = false
  } = options;

  // Validações básicas
  if (!to) {
    return {
      success: false,
      message: 'Email do destinatário é obrigatório',
      error: 'MISSING_RECIPIENT'
    };
  }

  if (!subject) {
    return {
      success: false,
      message: 'Assunto do email é obrigatório',
      error: 'MISSING_SUBJECT'
    };
  }

  if (!html && !text) {
    return {
      success: false,
      message: 'Conteúdo do email (HTML ou texto) é obrigatório',
      error: 'MISSING_CONTENT'
    };
  }

  const transporter = createTransporter();
  
  // Se não houver transporter configurado OU modo dev ativado
  if (!transporter || devMode) {
    console.log(`📧 [modo dev] Email seria enviado para: ${to}`);
    console.log(`📧 [modo dev] Assunto: ${subject}`);
    if (text) {
      console.log(`📧 [modo dev] Conteúdo: ${text.substring(0, 100)}...`);
    }
    return {
      success: true,
      message: 'Email não enviado (modo de desenvolvimento)',
      info: null,
      devMode: true
    };
  }

  // Configurar opções do email
  const mailOptions = {
    from: {
      name: fromName,
      address: from || process.env.EMAIL_FROM || process.env.EMAIL_USER
    },
    to: to,
    subject: subject,
    html: html,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado com sucesso para: ${to}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    
    return {
      success: true,
      message: 'Email enviado com sucesso',
      info: info,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`❌ Erro ao enviar email para ${to}:`, error.message);
    
    return {
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    };
  }
};

// ============================================================================
// TEMPLATE PARA EMAIL DE NOTIFICAÇÃO/AVISO
// ============================================================================

/**
 * Template HTML para email de notificação/aviso
 */
const getNotificationEmailTemplate = (params) => {
  const {
    titulo,
    conteudo,
    prioridade = 'MEDIA',
    dataExpiracao,
    linkAcao,
    textoLinkAcao = 'Ver Detalhes'
  } = params;

  // Define classe CSS baseada na prioridade
  const priorityClass = prioridade === 'ALTA' ? 'priority-high' : 
                       prioridade === 'MEDIA' ? 'priority-medium' : '';

  // Ícone baseado na prioridade
  const priorityIcon = prioridade === 'ALTA' ? '🔴' : 
                      prioridade === 'MEDIA' ? '🟡' : '🟢';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titulo}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #12BE4D 0%, #20c997 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
        }
        .logo {
          display: inline-block;
          font-size: 40px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #12BE4D;
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .content p {
          margin: 15px 0;
          font-size: 16px;
          color: #555;
        }
        .message-box {
          background: #f8f9fa;
          border-left: 4px solid #12BE4D;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .message-box strong {
          display: block;
          color: #12BE4D;
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .message-box.priority-high {
          border-left-color: #dc3545;
        }
        .message-box.priority-high strong {
          color: #dc3545;
        }
        .message-box.priority-medium {
          border-left-color: #ffc107;
        }
        .message-box.priority-medium strong {
          color: #ffc107;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #12BE4D;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        }
        .button:hover {
          background: #0E8F3A;
        }
        .footer {
          background: #f8f9fa;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #6c757d;
        }
        .footer a {
          color: #12BE4D;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="logo">🚌</span>BusHere!</h1>
        </div>
        
        <div class="content">
          <h2>${priorityIcon} ${titulo}</h2>
          
          <div class="message-box ${priorityClass}">
            <strong>📢 Mensagem</strong>
            <div style="margin-top: 10px; line-height: 1.6;">
              ${conteudo}
            </div>
          </div>
          
          ${linkAcao ? `
            <div class="button-container">
              <a href="${linkAcao}" class="button">
                ${textoLinkAcao}
              </a>
            </div>
          ` : ''}
          
          ${dataExpiracao ? `
            <p style="margin-top: 30px;">
              <strong>⏰ Válido até:</strong> ${new Date(dataExpiracao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          ` : ''}
          
          <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
            Esta é uma notificação automática do sistema BusHere!. 
            Para mais informações, acesse o aplicativo.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>BusHere!</strong></p>
          <p>
            Se precisar de ajuda, entre em contato: 
            <a href="mailto:bushereapp@gmail.com">bushereapp@gmail.com</a>
          </p>
          <p style="font-size: 12px; margin-top: 15px;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ============================================================================
// FUNÇÃO PARA ENVIAR EMAIL DE NOTIFICAÇÃO
// ============================================================================

/**
 * Envia email de notificação/aviso para passageiros
 * 
 * @param {string|string[]} destinatarios - Email(s) do(s) destinatário(s)
 * @param {Object} aviso - Dados do aviso
 * @param {string} aviso.titulo - Título do aviso
 * @param {string} aviso.conteudo - Conteúdo do aviso
 * @param {string} [aviso.prioridade] - Prioridade (ALTA, MEDIA, BAIXA)
 * @param {string} [aviso.data_expiracao] - Data de expiração
 * @param {string} [aviso.aviso_id] - ID do aviso (para link)
 * @param {Object} [options] - Opções adicionais
 * @param {boolean} [options.devMode] - Modo de desenvolvimento
 * @returns {Promise<Object[]>} Array com resultados do envio
 */
const sendNotificationEmail = async (destinatarios, aviso, options = {}) => {
  // Garantir que destinatarios seja array
  const emails = Array.isArray(destinatarios) ? destinatarios : [destinatarios];

  // Validações
  if (emails.length === 0) {
    return [{
      success: false,
      message: 'Nenhum destinatário fornecido',
      error: 'NO_RECIPIENTS'
    }];
  }

  if (!aviso.titulo || !aviso.conteudo) {
    return [{
      success: false,
      message: 'Título e conteúdo do aviso são obrigatórios',
      error: 'MISSING_REQUIRED_FIELDS'
    }];
  }

  // Construir link para o aviso (se houver ID)
  let linkAcao = null;
  if (aviso.aviso_id) {
    const baseUrl = process.env.MOBILE_APP_URL || process.env.WEBAPP_URL || 'http://localhost:5174';
    linkAcao = `${baseUrl}/avisos/${aviso.aviso_id}`;
  }

  // Gerar HTML
  const htmlContent = getNotificationEmailTemplate({
    titulo: aviso.titulo,
    conteudo: aviso.conteudo,
    prioridade: aviso.prioridade || 'MEDIA',
    dataExpiracao: aviso.data_expiracao,
    linkAcao,
    textoLinkAcao: 'Ver no App'
  });

  // Gerar texto plano
  const priorityLabel = aviso.prioridade === 'ALTA' ? '[URGENTE]' :
                       aviso.prioridade === 'MEDIA' ? '[IMPORTANTE]' : '';
  const textContent = `
${priorityLabel} ${aviso.titulo}

${aviso.conteudo}

${aviso.data_expiracao ? `Válido até: ${new Date(aviso.data_expiracao).toLocaleDateString('pt-BR')}` : ''}

${linkAcao ? `Para mais detalhes, acesse: ${linkAcao}` : ''}

---
BusHere! - Sistema de Transportes
Suporte: bushereapp@gmail.com
  `.trim();

  // Enviar email para cada destinatário
  const results = [];
  for (const email of emails) {
    const result = await sendEmail({
      to: email,
      subject: `${priorityLabel} ${aviso.titulo}`,
      html: htmlContent,
      text: textContent,
      ...options
    });
    
    results.push({
      ...result,
      destinatario: email
    });
  }

  return results;
};

module.exports = {
  // Funções originais (manter compatibilidade)
  sendInviteEmail,
  verifyEmailService,
  
  // Novas funções modulares
  sendEmail,
  sendNotificationEmail,
  
  // Templates (para customização)
  getInviteEmailTemplate,
  getNotificationEmailTemplate
};
