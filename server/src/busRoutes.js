const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de onibus com paginação e filtros opcionais
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let params = [];
      let whereClause = "";
      let limitClause = "";

      if (search) {
        whereClause = ' WHERE nome LIKE ? OR placa LIKE ? OR modelo LIKE ? OR marca LIKE ?';
        const searchPattern = `%${search}%`;
        params = [searchPattern, searchPattern, searchPattern, searchPattern];
      }

      if (limit > 0) {
        limitClause = " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);
      }

      const [rows] = await pool.execute(
        `SELECT 
          O.onibus_id,
          O.nome,
          O.placa,
          O.modelo,
          O.marca,
          O.ano_fabricacao,
          O.capacidade,
          O.quilometragem,
          O.data_ultima_manutencao,
          O.data_proxima_manutencao,
          O.status_onibus_id,
          SO.nome AS status_nome,
          O.ativo,
          COUNT(*) OVER() as total_buses_found
        FROM Onibus O
        JOIN StatusOnibus SO ON O.status_onibus_id = SO.status_onibus_id
        ${whereClause}
        ORDER BY O.onibus_id ${limitClause}`,
        params
      );

      const totalBuses = rows.length > 0 ? rows[0].total_buses_found : 0;
      const totalPages = limit > 0 ? Math.ceil(totalBuses / limit) : 1;

      res.json({
        data: rows.map(({ total_buses_found, ...rest }) => rest),
        total: totalBuses,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      });
    } catch (error) {
      console.error('Erro ao buscar onibus:', error);
      res.status(500).json({ error: 'Erro ao buscar onibus' });
    }
  });

  // Rota para buscar status de onibus
  router.get('/status', async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT status_onibus_id, nome 
        FROM StatusOnibus 
        ORDER BY nome`
      );

      res.json({
         data: rows 
        });
    } catch (error) {
      console.error('Erro ao buscar status de onibus:', error);
      res.status(500).json({ error: 'Erro ao buscar status de onibus', details: error.message });
    }
  });

  // Rota para obter detalhes de um onibus específico
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM Onibus WHERE onibus_id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Onibus não encontrado' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do onibus:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes do onibus' });
    }
  });

  // Rota para criar um novo onibus
  router.post('/', async (req, res) => {
    const requiredFields = ['nome', 'placa', 'capacidade'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
      }
    }

    const {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, 
      data_ultima_manutencao, data_proxima_manutencao, status_onibus_id, ativo
    } = req.body;

    const newBusData = {
      nome, 
      placa, 
      modelo, 
      marca, 
      ano_fabricacao, 
      capacidade, 
      quilometragem, 
      data_ultima_manutencao, 
      data_proxima_manutencao, 
      status_onibus_id, 
      ativo
    };

    try {
      const [result] = await pool.query('INSERT INTO Onibus SET ?', newBusData);
      const [newBus] = await pool.execute('SELECT * FROM Onibus WHERE onibus_id = ?', [result.insertId]);
      res.status(201).json(newBus[0]);
    } catch (error) {
      console.error('Erro ao criar onibus:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Placa ou nome já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar onibus' });
    }
  });

  // Rota para atualizar um onibus existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, 
      data_ultima_manutencao, data_proxima_manutencao, status_onibus_id, ativo
    } = req.body;

    const updatedBusData = {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, data_ultima_manutencao, data_proxima_manutencao, status_onibus_id, ativo
    };

    Object.keys(updatedBusData).forEach(key => updatedBusData[key] === undefined && delete updatedBusData[key]);

    if (Object.keys(updatedBusData).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
    }

    try {
      await pool.query('UPDATE Onibus SET ? WHERE onibus_id = ?', [updatedBusData, id]);
      const [updatedBus] = await pool.execute('SELECT * FROM Onibus WHERE onibus_id = ?', [id]);
      res.json(updatedBus[0]);
    } catch (error) {
      console.error('Erro ao atualizar onibus:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Placa ou nome já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar onibus' });
    }
  });

  // Rota para excluir um onibus
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Onibus WHERE onibus_id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Onibus não encontrado' });
      }
      res.json({ message: 'Onibus excluído com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir onibus:', error);
      res.status(500).json({ error: 'Erro ao excluir onibus' });
    }
  });

  return router;
};
