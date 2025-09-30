const express = require('express');


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