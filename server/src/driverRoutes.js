const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de motoristas com paginação e filtros opcionais
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let params = [];
      let whereClause = "";
      let limitClause = "";

      if (search) {
        whereClause = ' WHERE M.nome LIKE ? OR M.cpf LIKE ? OR M.email LIKE ? OR M.telefone LIKE ? OR M.cnh_numero LIKE ?';
        const searchPattern = `%${search}%`;
        params = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
      }

      if (limit > 0) {
        limitClause = " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);
      }

      // Query para buscar motoristas com status
      const [rows] = await pool.execute(
        `SELECT 
          M.motorista_id,
          M.nome,
          M.cpf,
          M.cnh_numero,
          M.cnh_categoria,
          M.cnh_validade,
          M.telefone,
          M.email,
          M.data_admissao,
          M.status_motorista_id,
          SM.nome as status_nome,
          M.ativo,
          COUNT(*) OVER() as total_drivers_found
        FROM Motoristas M
        LEFT JOIN StatusMotorista SM ON M.status_motorista_id = SM.status_motorista_id
        ${whereClause}
        ORDER BY M.motorista_id ${limitClause}`,
        params
      );

      const totalDrivers = rows.length > 0 ? rows[0].total_drivers_found : 0;
      const totalPages = limit > 0 ? Math.ceil(totalDrivers / limit) : 1;

      res.json({
        data: rows.map(({ total_drivers_found, ...rest }) => rest),
        total: totalDrivers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      });
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      res.status(500).json({ error: 'Erro ao buscar motoristas' });
    }
  });

  // Rota para buscar status de motorista
  router.get('/status', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT status_motorista_id, nome 
        FROM StatusMotorista 
        ORDER BY nome`
      );

      res.json({ 
        data: rows 
      });
    } catch (error) {
      console.error('Erro ao buscar status de motorista:', error);
      res.status(500).json({ error: 'Erro ao buscar status de motorista' });
    }
  });

  // Rota para obter detalhes de um motorista específico
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const [rows] = await pool.execute(
        `SELECT 
          M.motorista_id,
          M.nome,
          M.cpf,
          M.cnh_numero,
          M.cnh_categoria,
          M.cnh_validade,
          M.telefone,
          M.email,
          M.data_admissao,
          M.status_motorista_id,
          SM.nome as status_nome,
          M.ativo
        FROM Motoristas M
        LEFT JOIN StatusMotorista SM ON M.status_motorista_id = SM.status_motorista_id
        WHERE M.motorista_id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do motorista:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes do motorista' });
    }
  });

  // Rota para criar um novo motorista
  router.post('/', async (req, res) => {
    const requiredFields = ['nome', 'cpf', 'cnh_numero', 'cnh_categoria', 'cnh_validade'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
      }
    }

    const {
      nome, cpf, cnh_numero, cnh_categoria, cnh_validade, telefone, email, 
      data_admissao, status_motorista_id, ativo
    } = req.body;

    const newDriverData = {
      nome,
      cpf,
      cnh_numero,
      cnh_categoria,
      cnh_validade,
      telefone: telefone || null,
      email: email || null,
      data_admissao: data_admissao || null,
      status_motorista_id: status_motorista_id || 1, // Default para "Ativo"
      ativo: ativo !== undefined ? ativo : true
    };

    try {
      // Verificar duplicatas
      const [existingRows] = await pool.execute(
        'SELECT motorista_id, cpf, cnh_numero, email FROM Motoristas WHERE cpf = ? OR cnh_numero = ? OR (email IS NOT NULL AND email = ?)',
        [cpf, cnh_numero, email || '']
      );

      if (existingRows.length > 0) {
        let field = 'unknown';
        if (existingRows[0].cpf === cpf) field = 'CPF';
        else if (existingRows[0].cnh_numero === cnh_numero) field = 'CNH';
        else if (existingRows[0].email === email) field = 'email';

        return res.status(409).json({ error: `${field} já cadastrado` });
      }

      const [result] = await pool.query('INSERT INTO Motoristas SET ?', newDriverData);
      const [newDriver] = await pool.execute(
        `SELECT 
          M.motorista_id,
          M.nome,
          M.cpf,
          M.cnh_numero,
          M.cnh_categoria,
          M.cnh_validade,
          M.telefone,
          M.email,
          M.data_admissao,
          M.status_motorista_id,
          SM.nome as status_nome,
          M.ativo
        FROM Motoristas M
        LEFT JOIN StatusMotorista SM ON M.status_motorista_id = SM.status_motorista_id
        WHERE M.motorista_id = ?`,
        [result.insertId]
      );

      res.status(201).json(newDriver[0]);
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      res.status(500).json({ error: 'Erro ao criar motorista' });
    }
  });

  // Rota para atualizar um motorista existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      nome, cpf, cnh_numero, cnh_categoria, cnh_validade, telefone, email,
      data_admissao, status_motorista_id, ativo
    } = req.body;

    try {
      // Verificar se o motorista existe
      const [existingDriver] = await pool.execute(
        'SELECT motorista_id FROM Motoristas WHERE motorista_id = ?',
        [id]
      );

      if (existingDriver.length === 0) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }

      // Verificar duplicatas
      if (cpf || cnh_numero || email) {
        const [duplicateRows] = await pool.execute(
          `SELECT motorista_id, cpf, cnh_numero, email 
           FROM Motoristas 
           WHERE motorista_id != ? AND (cpf = ? OR cnh_numero = ? OR (email IS NOT NULL AND email = ?))`,
          [id, cpf || '', cnh_numero || '', email || '']
        );

        if (duplicateRows.length > 0) {
          let field = 'unknown';
          if (duplicateRows[0].cpf === cpf) field = 'CPF';
          else if (duplicateRows[0].cnh_numero === cnh_numero) field = 'CNH';
          else if (duplicateRows[0].email === email) field = 'email';

          return res.status(409).json({ error: `${field} já está sendo usado por outro motorista` });
        }
      }

      // Preparar dados para atualização
      const updateData = {};
      if (nome !== undefined) updateData.nome = nome;
      if (cpf !== undefined) updateData.cpf = cpf;
      if (cnh_numero !== undefined) updateData.cnh_numero = cnh_numero;
      if (cnh_categoria !== undefined) updateData.cnh_categoria = cnh_categoria;
      if (cnh_validade !== undefined) updateData.cnh_validade = cnh_validade;
      if (telefone !== undefined) updateData.telefone = telefone;
      if (email !== undefined) updateData.email = email;
      if (data_admissao !== undefined) updateData.data_admissao = data_admissao;
      if (status_motorista_id !== undefined) updateData.status_motorista_id = status_motorista_id;
      if (ativo !== undefined) updateData.ativo = ativo;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
      }

      await pool.query('UPDATE Motoristas SET ? WHERE motorista_id = ?', [updateData, id]);

      const [updatedDriver] = await pool.execute(
        `SELECT 
          M.motorista_id,
          M.nome,
          M.cpf,
          M.cnh_numero,
          M.cnh_categoria,
          M.cnh_validade,
          M.telefone,
          M.email,
          M.data_admissao,
          M.status_motorista_id,
          SM.nome as status_nome,
          M.ativo
        FROM Motoristas M
        LEFT JOIN StatusMotorista SM ON M.status_motorista_id = SM.status_motorista_id
        WHERE M.motorista_id = ?`,
        [id]
      );

      res.json(updatedDriver[0]);
    } catch (error) {
      console.error('Erro ao atualizar motorista:', error);
      res.status(500).json({ error: 'Erro ao atualizar motorista' });
    }
  });

  // Rota para excluir um motorista
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Motoristas WHERE motorista_id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }
      
      res.json({ message: 'Motorista excluído com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      res.status(500).json({ error: 'Erro ao excluir motorista' });
    }
  });

  return router;
};
