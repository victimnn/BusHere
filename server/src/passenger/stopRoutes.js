const express = require('express');
/*
ponto_id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
latitude DECIMAL(10,8) NOT NULL,
longitude DECIMAL(11,8) NOT NULL,
logradouro VARCHAR(255),
numero_endereco VARCHAR(20),
bairro VARCHAR(100),
cidade VARCHAR(100),
uf CHAR(2),
cep VARCHAR(9),
referencia TEXT COMMENT 'Ponto de referência ou descrição adicional',
criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ativo BOOLEAN DEFAULT TRUE,
*/

module.exports = (pool) => {
  const router = express.Router();

  // Rota para buscar informações de ponto
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Pontos");
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pontos no banco de dados" });
    }
  });

  // Rota para buscar informações de um ponto específico pelo ID
  router.get("/:id", async (req, res) => {
    const pontoId = req.params.id;
    if (!pontoId) {
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });
    }
    if (isNaN(pontoId)) {
      return res.status(400).json({ error: "O parâmetro 'id' deve ser um número" });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM Pontos WHERE ponto_id = ?", [pontoId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Ponto não encontrado" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar ponto no banco de dados" });
    }
  });
    
  return router;
}
