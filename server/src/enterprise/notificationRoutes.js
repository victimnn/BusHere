const express = require('express');
const { extractToken } = require("../helpers");
const { sendNotificationEmail } = require('../services/emailService');
const webpush = require('web-push');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [notificationResult] = await pool.query("SELECT * FROM Avisos");
      res.json({
        data: notificationResult
     });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.post('/', extractToken, async (req, res) => {
    const requiredFields = ["titulo","conteudo","escopo_aviso_id"]
    if(!req.body){
      return res.status(400).json({ error: "Corpo da requisição está vazio" });
    }
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo '${field}' é obrigatório` });
      }
    }



    try {
      const token = req.token;
      [enterpriseTokenResult] = await pool.query("SELECT * FROM TokensEmpresaLogin WHERE token = ?", [token]);
      const enterpriseId = enterpriseTokenResult[0]?.usuario_empresa_id;

      const b = req.body;

      const notification = {
        titulo: b.titulo,
        conteudo: b.conteudo,
        escopo_aviso_id: b.escopo_aviso_id,
        usuario_criador_id: enterpriseId,

        data_expiracao: b.data_expiracao ?? null,
        rota_alvo_id: b.rota_alvo_id ?? null,
        tipo_passageiro_alvo_id: b.tipo_passageiro_alvo_id ?? null,
        passageiro_alvo_id: b.passageiro_alvo_id ?? null,
        prioridade: b.prioridade ?? 'MEDIA',
        enviar_push: b.enviar_push ?? true,
        enviar_email: b.enviar_email ?? false,
        enviar_sms: b.enviar_sms ?? false,
        ativo: b.ativo ?? true
      }

      const [insertResult] = await pool.query("INSERT INTO Avisos SET ?", [notification]);

      console.log(`📋 [notificationRoutes] Aviso criado com ID: ${insertResult.insertId}`);

      // Enviar push notification se solicitado
      let pushStatus = { enviado: false, mensagem: 'Push não configurado para envio' };
      let emailStatus = { enviado: false, mensagem: 'Email não configurado para envio' };

      // Buscar passageiros afetados conforme escopo
      let passageirosAfetados = [];
      if (notification.escopo_aviso_id === 1) {
        const [passengers] = await pool.query("SELECT passageiro_id FROM Passageiros");
        passageirosAfetados = passengers.map(p => p.passageiro_id);
      } else if (notification.escopo_aviso_id === 2 && notification.rota_alvo_id) {
        const [passengers] = await pool.query("SELECT passageiro_id FROM Passageiros WHERE rota_id = ?", [notification.rota_alvo_id]);
        passageirosAfetados = passengers.map(p => p.passageiro_id);
      } else if (notification.escopo_aviso_id === 3 && notification.tipo_passageiro_alvo_id) {
        const [passengers] = await pool.query("SELECT passageiro_id FROM Passageiros WHERE tipo_passageiro_id = ?", [notification.tipo_passageiro_alvo_id]);
        passageirosAfetados = passengers.map(p => p.passageiro_id);
      } else if (notification.escopo_aviso_id === 4 && notification.passageiro_alvo_id) {
        passageirosAfetados = [notification.passageiro_alvo_id];
      }

      // Buscar subscriptions desses passageiros
      let subscriptions = [];
      if (notification.enviar_push && passageirosAfetados.length > 0) {
        const [subs] = await pool.query(
          `SELECT endpoint, expirationTime, p256dh, auth FROM inscricoes_notificacao_push WHERE id_passageiro IN (?)`,
          [passageirosAfetados]
        );
        subscriptions = subs.map(s => ({
          endpoint: s.endpoint,
          expirationTime: s.expirationTime,
          keys: { p256dh: s.p256dh, auth: s.auth }
        }));
        // Enviar push notification para cada subscription
        let successCount = 0;
        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification(sub, JSON.stringify({
              title: notification.titulo,
              body: notification.conteudo,
              prioridade: notification.prioridade,
              data_expiracao: notification.data_expiracao
            }));
            successCount++;
          } catch (err) {
            console.error('Erro ao enviar push:', err);
          }
        }
        pushStatus = {
          enviado: true,
          mensagem: `Push enviado para ${successCount} de ${subscriptions.length} inscrição(ões)`
        };
      }

      // Enviar email se solicitado
      if (notification.enviar_email) {
        console.log(`📧 [notificationRoutes] Flag enviar_email ativada, buscando destinatários...`);
        
        try {
          // Buscar destinatários baseado no escopo
          let destinatarios = [];
          
          // Escopo 1: Todos os passageiros
          if (notification.escopo_aviso_id === 1) {
            console.log(`📧 [notificationRoutes] Escopo: TODOS os passageiros`);
            const [passengers] = await pool.query(
              "SELECT email FROM Passageiros WHERE email IS NOT NULL AND email != ''"
            );
            destinatarios = passengers.map(p => p.email);
          }
          
          // Escopo 2: Passageiros de uma rota específica
          else if (notification.escopo_aviso_id === 2 && notification.rota_alvo_id) {
            console.log(`📧 [notificationRoutes] Escopo: Rota específica (ID: ${notification.rota_alvo_id})`);
            const [passengers] = await pool.query(
              "SELECT email FROM Passageiros WHERE rota_id = ? AND email IS NOT NULL AND email != ''",
              [notification.rota_alvo_id]
            );
            destinatarios = passengers.map(p => p.email);
          }
          
          // Escopo 3: Passageiros de um tipo específico
          else if (notification.escopo_aviso_id === 3 && notification.tipo_passageiro_alvo_id) {
            console.log(`📧 [notificationRoutes] Escopo: Tipo de passageiro (ID: ${notification.tipo_passageiro_alvo_id})`);
            const [passengers] = await pool.query(
              "SELECT email FROM Passageiros WHERE tipo_passageiro_id = ? AND email IS NOT NULL AND email != ''",
              [notification.tipo_passageiro_alvo_id]
            );
            destinatarios = passengers.map(p => p.email);
          }
          
          // Escopo 4: Passageiro específico
          else if (notification.escopo_aviso_id === 4 && notification.passageiro_alvo_id) {
            console.log(`📧 [notificationRoutes] Escopo: Passageiro específico (ID: ${notification.passageiro_alvo_id})`);
            const [passengers] = await pool.query(
              "SELECT email FROM Passageiros WHERE passageiro_id = ? AND email IS NOT NULL AND email != ''",
              [notification.passageiro_alvo_id]
            );
            destinatarios = passengers.map(p => p.email);
          }
          
          console.log(`📧 [notificationRoutes] ${destinatarios.length} destinatário(s) encontrado(s)`);
          
          // Enviar email para os destinatários
          if (destinatarios.length > 0) {
            console.log(`📧 [notificationRoutes] Iniciando envio de emails...`);
            
            const emailResult = await sendNotificationEmail(destinatarios, {
              titulo: notification.titulo,
              conteudo: notification.conteudo,
              prioridade: notification.prioridade,
              data_expiracao: notification.data_expiracao
            });
            
            console.log(`📧 [notificationRoutes] Resultado do envio:`, emailResult);
            
            if (emailResult.success) {
              emailStatus = { 
                enviado: true, 
                mensagem: `Email enviado com sucesso para ${destinatarios.length} destinatário(s)`,
                destinatarios: destinatarios.length
              };
              console.log(`✅ [notificationRoutes] Emails enviados com sucesso!`);
            } else {
              emailStatus = { 
                enviado: false, 
                mensagem: emailResult.message || 'Erro ao enviar email',
                erro: emailResult.error
              };
              console.log(`❌ [notificationRoutes] Falha no envio de emails:`, emailResult.message);
            }
          } else {
            emailStatus = { 
              enviado: false, 
              mensagem: 'Nenhum destinatário encontrado para o escopo selecionado' 
            };
            console.log(`⚠️ [notificationRoutes] Nenhum destinatário encontrado`);
          }
          
        } catch (emailError) {
          console.error(`❌ [notificationRoutes] Erro ao processar envio de email:`, emailError);
          console.error(`❌ [notificationRoutes] Stack:`, emailError.stack);
          emailStatus = { 
            enviado: false, 
            mensagem: 'Erro ao processar envio de email',
            erro: emailError.message
          };
        }
      }

      return res.json({
        data: {
          aviso_id: insertResult.insertId,
          ...notification
        },
        emailStatus,
        pushStatus
      });
    } catch (error) { 
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.get("/scopes", async (req, res) => {
    try {
      const [scopeResult] = await pool.query("SELECT * FROM EscoposAviso");
      res.json({
        data: scopeResult
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [notificationResult] = await pool.query("SELECT * FROM Avisos WHERE aviso_id = ?", [id]);
      if (notificationResult.length === 0) {
        return res.status(404).json({ error: "Aviso não encontrado" });
      }
      res.json({
        data: notificationResult[0]
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.put("/:id", extractToken, async (req, res) => {
    const { id } = req.params;
    
    if(!req.body){
      return res.status(400).json({ error: "Corpo da requisição está vazio" });
    }

    try {
      // Verifica se o aviso existe
      const [existingNotification] = await pool.query("SELECT * FROM Avisos WHERE aviso_id = ?", [id]);
      if (existingNotification.length === 0) {
        return res.status(404).json({ error: "Aviso não encontrado" });
      }

      const token = req.token;
      [enterpriseTokenResult] = await pool.query("SELECT * FROM TokensEmpresaLogin WHERE token = ?", [token]);
      const enterpriseId = enterpriseTokenResult[0]?.usuario_empresa_id;

      const b = req.body;

      // Monta objeto com campos a serem atualizados
      const updateFields = {
        titulo: b.titulo,
        conteudo: b.conteudo,
        escopo_aviso_id: b.escopo_aviso_id,
        data_expiracao: b.data_expiracao ?? null,
        rota_alvo_id: b.rota_alvo_id ?? null,
        tipo_passageiro_alvo_id: b.tipo_passageiro_alvo_id ?? null,
        passageiro_alvo_id: b.passageiro_alvo_id ?? null,
        prioridade: b.prioridade ?? 'MEDIA',
        enviar_push: b.enviar_push ?? true,
        enviar_email: b.enviar_email ?? false,
        enviar_sms: b.enviar_sms ?? false,
        ativo: b.ativo ?? true
      };

      await pool.query("UPDATE Avisos SET ? WHERE aviso_id = ?", [updateFields, id]);

      // Retorna o aviso atualizado
      const [updatedNotification] = await pool.query("SELECT * FROM Avisos WHERE aviso_id = ?", [id]);

      return res.json({
        data: updatedNotification[0]
      });
    } catch (error) { 
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.delete("/:id", extractToken, async (req, res) => {
    const { id } = req.params;

    try {
      // Verifica se o aviso existe
      const [existingNotification] = await pool.query("SELECT * FROM Avisos WHERE aviso_id = ?", [id]);
      if (existingNotification.length === 0) {
        return res.status(404).json({ error: "Aviso não encontrado" });
      }

      // Deleta o aviso
      await pool.query("DELETE FROM Avisos WHERE aviso_id = ?", [id]);

      return res.json({
        message: "Aviso excluído com sucesso"
      });
    } catch (error) { 
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router
}