/**
 * Script de teste para o serviço de email
 * Este script testa o envio de emails de convite
 * 
 * Uso:
 *   node server/src/services/testEmail.js
 */

require('dotenv').config();
const { sendInviteEmail, verifyEmailService } = require('./emailService');

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`),
};

async function testEmailService() {
  log.section();
  console.log(`${colors.blue}🧪 TESTE DO SERVIÇO DE EMAIL - BusHere!${colors.reset}`);
  log.section();

  // 1. Verificar variáveis de ambiente
  console.log('\n1️⃣  Verificando configurações...');
  
  const requiredVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'];
  const configStatus = {};
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    configStatus[varName] = !!value;
    
    if (value) {
      log.success(`${varName}: Configurado`);
    } else {
      log.warning(`${varName}: Não configurado`);
    }
  });

  const optionalVars = ['EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_FROM', 'WEBAPP_URL'];
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      log.info(`${varName}: ${value}`);
    } else {
      log.info(`${varName}: Usando padrão`);
    }
  });

  // 2. Verificar conexão SMTP
  console.log('\n2️⃣  Testando conexão SMTP...');
  
  if (!configStatus.EMAIL_HOST || !configStatus.EMAIL_USER || !configStatus.EMAIL_PASS) {
    log.warning('Configurações de email não encontradas');
    log.info('O sistema funcionará em modo de desenvolvimento (sem envio real)');
    log.info('Configure as variáveis no arquivo .env para habilitar o envio');
    console.log('\nExemplo de configuração (.env):');
    console.log('EMAIL_HOST=smtp.gmail.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_SECURE=false');
    console.log('EMAIL_USER=seu_email@gmail.com');
    console.log('EMAIL_PASS=sua_senha_de_app');
    log.section();
    return;
  }

  try {
    const isVerified = await verifyEmailService();
    if (isVerified) {
      log.success('Conexão SMTP estabelecida com sucesso!');
    } else {
      log.error('Falha ao conectar com servidor SMTP');
      log.warning('Verifique as credenciais e configurações');
      return;
    }
  } catch (error) {
    log.error(`Erro ao verificar serviço: ${error.message}`);
    return;
  }

  // 3. Testar envio de email
  console.log('\nEnviando email de teste...');
  
  // Usar o próprio email do usuário como teste
  const testEmail = process.env.EMAIL_USER;
  const testInviteCode = 'TEST-' + Date.now().toString(36).toUpperCase();
  
  log.info(`Destinatário: ${testEmail}`);
  log.info(`Código de convite: ${testInviteCode}`);
  log.info('Enviando...');

  try {
    const result = await sendInviteEmail(testEmail, testInviteCode);
    
    if (result.success) {
      log.success('Email enviado com sucesso!');
      if (result.info && result.info.messageId) {
        log.info(`Message ID: ${result.info.messageId}`);
      }
      log.info(`Verifique a caixa de entrada: ${testEmail}`);
    } else {
      log.error('Falha ao enviar email');
      log.warning(`Motivo: ${result.message}`);
      if (result.error) {
        log.error(`Detalhes: ${result.error}`);
      }
    }
  } catch (error) {
    log.error(`Erro ao enviar email: ${error.message}`);
  }

  // 4. Resumo
  log.section();
  console.log(`${colors.blue}RESUMO${colors.reset}`);
  log.section();
  
  console.log('\nConfigurações verificadas');
  console.log('Conexão SMTP testada');
  console.log('Email de teste enviado');
  
  console.log('\n Próximos passos:');
  console.log('   1. Verifique se o email chegou na caixa de entrada');
  console.log('   2. Teste criar um convite pela interface web');
  console.log('   3. Configure SPF/DKIM se for usar em produção');
  
  log.section();
}

// Executar teste
testEmailService()
  .then(() => {
    console.log('\n Teste concluído!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n Erro:');
    console.error(error);
    process.exit(1);
  });
