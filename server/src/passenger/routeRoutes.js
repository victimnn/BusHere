const express = require('express');
const {extractToken} = require("../helpers");

module.exports = (pool) => {
  const router = express.Router();
  
  router.get('/', extractToken, async (req, res) => {
      const token = req.token;

      try {
        const [tokenRows] = await pool.query("SELECT * FROM TokensPassageiro WHERE token = ?", [token]);
        if (tokenRows.length === 0) {
            return res.status(401).json({ error: "Token inválido" });
        }

        const tokenData = tokenRows[0];
        const userId = tokenData.passageiro_id;

        const [userRows] = await pool.query("SELECT * FROM Passageiros WHERE passageiro_id = ?", [userId]);
        const user = userRows[0];
        const routeId = user.rota_id;

        const [routeRows] = await pool.query("SELECT * FROM Rotas WHERE rota_id = ?", [routeId]);
        if (routeRows.length === 0) {
            return res.status(404).json({ error: "Rota não encontrada para o passageiro" });
        }

        return res.status(200).json({
            data: routeRows[0]
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar rota do passageiro no banco de dados" });
      }
  });

  return router; 
};