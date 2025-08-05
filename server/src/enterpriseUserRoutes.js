const express = require('express');
const { validateCPF, generateToken64, extractToken } = require("./helpers");

// Importa o bcrypt para fazer o hash da senha
const bcrypt = require('bcrypt');
const saltRounds = 10; // quantos calculos de hash serão feitos
const bcryptSalt = bcrypt.genSaltSync(saltRounds);

// Constantes
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

module.exports = (pool) => {
  const router = express.Router();

  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // Aqui você pode adicionar a lógica para buscar o usuário pelo ID
    // Por exemplo:
    try {
      const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user.rows[0]);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
}

