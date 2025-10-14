const express = require('express');
const { extractToken } = require("../helpers");

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

      return res.json({
        data: {
          aviso_id: insertResult.insertId,
          ...notification
        }
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