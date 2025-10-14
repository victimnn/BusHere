const express = require('express');
const { extractToken } = require("../helpers");

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', extractToken, async (req, res) => {
    try {
      const token = req.token;
      console.log(`📋 [passenger/notificationRoutes] Iniciando busca de avisos`);
      
      const [passengerTokenResult] = await pool.query(
        "SELECT passageiro_id FROM TokensPassageiro WHERE token = ?", 
        [token]
      );
      
      if (!passengerTokenResult || passengerTokenResult.length === 0) {
        console.log(`⚠️ [passenger/notificationRoutes] Token inválido`);
        return res.status(401).json({ error: "Token inválido" });
      }

      const passageiroId = passengerTokenResult[0].passageiro_id;
      console.log(`📋 [passenger/notificationRoutes] Passageiro ID: ${passageiroId}`);

      // Buscar informações do passageiro
      const [passengerInfo] = await pool.query(
        "SELECT rota_id, tipo_passageiro_id FROM Passageiros WHERE passageiro_id = ?",
        [passageiroId]
      );

      if (!passengerInfo || passengerInfo.length === 0) {
        console.log(`⚠️ [passenger/notificationRoutes] Passageiro não encontrado`);
        return res.status(404).json({ error: "Passageiro não encontrado" });
      }

      const { rota_id, tipo_passageiro_id } = passengerInfo[0];
      console.log(`📋 [passenger/notificationRoutes] Rota: ${rota_id}, Tipo: ${tipo_passageiro_id}`);

      // Buscar avisos que se aplicam a este passageiro
      // Escopo 1 (Geral) = todos
      // Escopo 2 (Por Rota) = mesma rota (se rota_id não for NULL)
      // Escopo 3 (Por Tipo) = mesmo tipo (se tipo_passageiro_id não for NULL)
      // Escopo 4 (Específico) = este passageiro
      const [notificationResult] = await pool.query(`
        SELECT a.*, e.nome_escopo, e.descricao as escopo_descricao
        FROM Avisos a
        LEFT JOIN EscoposAviso e ON a.escopo_aviso_id = e.escopo_aviso_id
        WHERE a.ativo = TRUE
        AND (
          a.escopo_aviso_id = 1  -- Geral (todos)
          OR (a.escopo_aviso_id = 2 AND a.rota_alvo_id = ? AND ? IS NOT NULL)  -- Por Rota
          OR (a.escopo_aviso_id = 3 AND a.tipo_passageiro_alvo_id = ? AND ? IS NOT NULL)  -- Por Tipo
          OR (a.escopo_aviso_id = 4 AND a.passageiro_alvo_id = ?)  -- Específico
        )
        AND (a.data_expiracao IS NULL OR a.data_expiracao > NOW())
        ORDER BY 
          CASE a.prioridade
            WHEN 'ALTA' THEN 1
            WHEN 'MEDIA' THEN 2
            WHEN 'BAIXA' THEN 3
          END,
          a.data_publicacao DESC
      `, [rota_id, rota_id, tipo_passageiro_id, tipo_passageiro_id, passageiroId]);

      console.log(`📋 [passenger/notificationRoutes] ${notificationResult.length} aviso(s) encontrado(s)`);

      res.json({
        data: notificationResult
     });
    } catch (error) {
      console.error("❌ [passenger/notificationRoutes] Erro ao processar a requisição:", error);
      console.error("❌ [passenger/notificationRoutes] Stack:", error.stack);
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

  return router
}