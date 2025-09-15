const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de veículos com paginação e filtros opcionais
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let params = [];
      let whereClause = "";
      let limitClause = "";

      if (search) {
        whereClause = ' WHERE V.nome LIKE ? OR V.placa LIKE ? OR V.modelo LIKE ? OR V.marca LIKE ?';
        const searchPattern = `%${search}%`;
        params = [searchPattern, searchPattern, searchPattern, searchPattern];
      }

      if (limit > 0) {
        limitClause = " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);
      }

      const [rows] = await pool.execute(
        `SELECT 
          V.veiculo_id,
          V.nome,
          V.placa,
          V.modelo,
          V.marca,
          V.ano_fabricacao,
          V.capacidade,
          V.quilometragem,
          V.data_ultima_manutencao,
          V.data_proxima_manutencao,
          V.tipo_veiculo_id,
          V.status_veiculo_id,
          TV.nome AS tipo_nome,
          SV.nome AS status_nome,
          V.ativo,
          COUNT(*) OVER() as total_vehicles_found
        FROM Veiculos V
        LEFT JOIN TipoVeiculo TV ON V.tipo_veiculo_id = TV.tipo_veiculo_id
        LEFT JOIN StatusVeiculo SV ON V.status_veiculo_id = SV.status_veiculo_id
        ${whereClause}
        ORDER BY V.veiculo_id ${limitClause}`,
        params
      );

      const data = rows.map(({ total_vehicles_found, ...rest }) => rest);
      const totalVehicles = rows.length > 0 ? rows[0].total_vehicles_found : 0;
      const totalPages = limit > 0 ? Math.ceil(totalVehicles / limit) : 1;

      res.json({
        data: data,
        total: totalVehicles,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      });
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
  });

  // Rota para buscar status de veículos
  router.get('/status', async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT status_veiculo_id, nome 
        FROM StatusVeiculo 
        ORDER BY nome`
      );

      res.json({ 
        data: rows 
      });
    } catch (error) {
      console.error('Erro ao buscar status de veículos:', error);
      res.status(500).json({ error: 'Erro ao buscar status de veículos', details: error.message });
    }
  });

  // Rota para buscar tipos de veículos
  router.get('/types', async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT tipo_veiculo_id, nome, descricao 
        FROM TipoVeiculo 
        WHERE ativo = TRUE
        ORDER BY nome`
      );

      res.json({ 
        data: rows 
      });
    } catch (error) {
      console.error('Erro ao buscar tipos de veículos:', error);
      res.status(500).json({ error: 'Erro ao buscar tipos de veículos', details: error.message });
    }
  });

  // Rota para obter detalhes de um veículo específico
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute(`
        SELECT V.*, TV.nome AS tipo_nome, SV.nome AS status_nome
        FROM Veiculos V
        LEFT JOIN TipoVeiculo TV ON V.tipo_veiculo_id = TV.tipo_veiculo_id
        LEFT JOIN StatusVeiculo SV ON V.status_veiculo_id = SV.status_veiculo_id
        WHERE V.veiculo_id = ?
      `, [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do veículo:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes do veículo' });
    }
  });

  // Rota para criar um novo veículo
  router.post('/', async (req, res) => {
    const requiredFields = ['nome', 'placa', 'capacidade'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
      }
    }

    const {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, 
      data_ultima_manutencao, data_proxima_manutencao, tipo_veiculo_id, status_veiculo_id, ativo
    } = req.body;

    const newVehicleData = {
      nome, 
      placa, 
      modelo, 
      marca, 
      ano_fabricacao, 
      capacidade, 
      quilometragem, 
      data_ultima_manutencao, 
      data_proxima_manutencao, 
      tipo_veiculo_id,
      status_veiculo_id, 
      ativo
    };

    try {
      const [result] = await pool.query('INSERT INTO Veiculos SET ?', newVehicleData);
      const [newVehicle] = await pool.execute(`
        SELECT V.*, TV.nome AS tipo_nome, SV.nome AS status_nome
        FROM Veiculos V
        LEFT JOIN TipoVeiculo TV ON V.tipo_veiculo_id = TV.tipo_veiculo_id
        LEFT JOIN StatusVeiculo SV ON V.status_veiculo_id = SV.status_veiculo_id
        WHERE V.veiculo_id = ?
      `, [result.insertId]);
      res.status(201).json(newVehicle[0]);
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Placa ou nome já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar veículo' });
    }
  });

  // Rota para atualizar um veículo existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, 
      data_ultima_manutencao, data_proxima_manutencao, tipo_veiculo_id, status_veiculo_id, ativo
    } = req.body;

    const updatedVehicleData = {
      nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, 
      data_ultima_manutencao, data_proxima_manutencao, tipo_veiculo_id, status_veiculo_id, ativo
    };

    Object.keys(updatedVehicleData).forEach(key => updatedVehicleData[key] === undefined && delete updatedVehicleData[key]);

    if (Object.keys(updatedVehicleData).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
    }

    try {
      await pool.query('UPDATE Veiculos SET ? WHERE veiculo_id = ?', [updatedVehicleData, id]);
      const [updatedVehicle] = await pool.execute(`
        SELECT V.*, TV.nome AS tipo_nome, SV.nome AS status_nome
        FROM Veiculos V
        LEFT JOIN TipoVeiculo TV ON V.tipo_veiculo_id = TV.tipo_veiculo_id
        LEFT JOIN StatusVeiculo SV ON V.status_veiculo_id = SV.status_veiculo_id
        WHERE V.veiculo_id = ?
      `, [id]);
      res.json(updatedVehicle[0]);
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Placa ou nome já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
  });

  // Rota para excluir um veículo
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Veiculos WHERE veiculo_id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.json({ message: 'Veículo excluído com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      res.status(500).json({ error: 'Erro ao excluir veículo' });
    }
  });

  return router;
};
