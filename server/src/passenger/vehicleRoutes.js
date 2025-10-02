const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter veículos com motoristas associados a uma rota específica
  router.get('/by-route/:rotaId', async (req, res) => {
    try {
      const { rotaId } = req.params;
      
      const [rows] = await pool.execute(`
        SELECT 
          V.veiculo_id,
          V.nome AS veiculo_nome,
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
          M.motorista_id,
          M.nome AS motorista_nome,
          M.cpf AS motorista_cpf,
          M.cnh_numero,
          M.cnh_categoria,
          M.cnh_validade,
          M.telefone AS motorista_telefone,
          M.email AS motorista_email,
          M.data_admissao,
          SM.nome AS status_motorista_nome,
          VR.veiculo_rota_id,
          VR.observacoes,
          VR.ativo AS veiculo_rota_ativo
        FROM VeiculoRota VR
        INNER JOIN Veiculos V ON VR.veiculo_id = V.veiculo_id
        INNER JOIN Motoristas M ON VR.motorista_id = M.motorista_id
        LEFT JOIN TipoVeiculo TV ON V.tipo_veiculo_id = TV.tipo_veiculo_id
        LEFT JOIN StatusVeiculo SV ON V.status_veiculo_id = SV.status_veiculo_id
        LEFT JOIN StatusMotorista SM ON M.status_motorista_id = SM.status_motorista_id
        WHERE VR.rota_id = ? AND VR.ativo = TRUE
        ORDER BY VR.criacao DESC
      `, [rotaId]);

      res.json({
        data: rows,
        total: rows.length
      });
    } catch (error) {
      console.error('Erro ao buscar veículos com motoristas da rota:', error);
      res.status(500).json({ error: 'Erro ao buscar veículos com motoristas da rota', details: error.message });
    }
  });

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

  return router;
};
