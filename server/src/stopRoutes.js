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

  // Rota para buscar pontos por nome
  router.get("/search", async (req, res) => {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "O parâmetro 'name' é obrigatório" });
    }
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: "O parâmetro 'name' deve ser uma string não vazia" });
    }
    
    try {
      // Busca no índice de busca por pontos
      const [rows] = await pool.query(
        "SELECT * FROM searchIndex WHERE item_type = 'Ponto' AND MATCH (search_text) AGAINST (? IN BOOLEAN MODE)",
        [name]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Nenhum ponto encontrado com esse nome" });
      }
      // Busca os pontos correspondentes
      const pontoIds = rows.map(row => row.item_id);
      const [pontos] = await pool.query(
        `SELECT * FROM Pontos WHERE ponto_id IN (${pontoIds.map(() => '?').join(',')})`,
        pontoIds
      );
      return res.status(200).json(pontos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pontos no banco de dados" });
    }
  });

  // Rota para adicionar um novo ponto
  router.post("/", async (req, res) => {
    // Campos obrigatorios
    const requiredFields = ['nome', 'coordinates',];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `O campo '${field}' é obrigatório` });
      }
    }

    // Campos opcionais
    const optionalFields = ['logradouro', 'numero_endereco', 'bairro', 'cidade', 'uf', 'cep', 'referencia'];
    for (const field of optionalFields) {
      if (req.body[field] && typeof req.body[field] !== 'string') {
        return res.status(400).json({ error: `O campo '${field}' deve ser uma string` });
      }
    }

    // Valores para o insert
    const { nome, coordinates } = req.body;
    const { logradouro=null, numero_endereco=null, bairro=null, cidade=null, uf=null, cep=null, referencia=null } = req.body;
    if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
        typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
      return res.status(400).json({ error: "O campo 'coordinates' deve ser um array com dois números (latitude e longitude)" });
    }
    const [latitude, longitude] = coordinates;
    if( latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: "As coordenadas devem estar dentro dos limites válidos: latitude entre -90 e 90, longitude entre -180 e 180" });
    }
    

    // Inserção no banco de dados
    try {
      const [result] = await pool.query(
        `INSERT INTO Pontos (nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia]
      );
      const newPontoId = result.insertId;

      return res.status(201).json({ ponto_id: newPontoId, nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao adicionar ponto no banco de dados" });
    }
  });

  // Rota para atualizar um ponto existente
  router.put("/:id", async (req, res) => {
    const pontoId = req.params.id;
    if (!pontoId) {
      return res.status(400).json({ error: "O parâmetro 'id' é obrigatório" });
    }
    if (isNaN(pontoId)) {
      return res.status(400).json({ error: "O parâmetro 'id' deve ser um número" });
    }

    // Campos para atualização
    const { nome, coordinates, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia } = req.body;
    const updates = {
      nome,
      logradouro,
      numero_endereco,
      bairro,
      cidade,
      uf,
      cep,
      referencia
    };
    // Verifica se as coordenadas foram fornecidas
    if (coordinates) {
      if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
          typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
        return res.status(400).json({ error: "O campo 'coordinates' deve ser um array com dois números (latitude e longitude)" });
      }
      const [latitude, longitude] = coordinates;
      if( latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ error: "As coordenadas devem estar dentro dos limites válidos: latitude entre -90 e 90, longitude entre -180 e 180" });
      }
      updates.latitude = latitude;
      updates.longitude = longitude;
    }

    // apaga os campos nao fornecidos
    for (const key in updates) {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
    }

    // Atualização no banco de dados
    try {
      const updateFields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
      const updateValues = Object.values(updates);
      updateValues.push(pontoId); // Adiciona o ID do ponto ao final

      const [result] = await pool.query(
        `UPDATE Pontos SET ${updateFields} WHERE ponto_id = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Ponto não encontrado" });
      }
      return res.status(200).json({ message: "Ponto atualizado com sucesso", ponto_id: pontoId, ...updates });      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar ponto no banco de dados" });
    }
  });






  return router;
}
