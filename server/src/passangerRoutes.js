const express = require('express');

module.exports = (pool) => {
  const safeUserFields = [
    "passageiro_id",
    "nome_completo",
    "email",
    "data_nascimento",
    "telefone",
    "cpf",
    "logradouro",
    "bairro",
    "cidade",
    "uf",
    "cep",
    "status_pagamento_id",
  ]
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const queryFields = safeUserFields.join(", ");
      const [rows] = await pool.query(`SELECT ${queryFields} FROM passageiros`);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching passengers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const queryFields = safeUserFields.join(", ");
      const [rows] = await pool.query(`SELECT ${queryFields} FROM passageiros WHERE passageiro_id = ?`, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Passenger not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error("Error fetching passenger:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  return router;
}
