const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de rotas com paginação e filtros opcionais
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let params = [];
      let whereClause = "";
      let limitClause = "";

      if (search) {
        whereClause = ' WHERE nome LIKE ? OR codigo_rota LIKE ?';
        const searchPattern = `%${search}%`;
        params = [searchPattern, searchPattern];
      }

      if (limit > 0) {
        limitClause = " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);
      }

      const [rows] = await pool.execute(
        `SELECT 
          R.rota_id,
          R.nome,
          R.codigo_rota,
          R.origem_descricao,
          R.destino_descricao,
          R.distancia_km,
          R.tempo_viagem_estimado_minutos,
          SR.nome AS status_nome,
          R.ativo,
          COUNT(*) OVER() as total_routes_found
        FROM Rotas R
        JOIN StatusRota SR ON R.status_rota_id = SR.status_rota_id
        ${whereClause}
        ORDER BY R.rota_id ${limitClause}`,
        params
      );

      const totalRoutes = rows.length > 0 ? rows[0].total_routes_found : 0;
      const totalPages = limit > 0 ? Math.ceil(totalRoutes / limit) : 1;

      res.json({
        data: rows.map(({ total_routes_found, ...rest }) => rest),
        total: totalRoutes,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      });
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      res.status(500).json({ error: 'Erro ao buscar rotas' });
    }
  });

  // Rota para buscar status de rotas
  router.get('/status', async (req, res) => {
    try {
      const [rows] = await pool.execute('SELECT status_rota_id, nome FROM StatusRota ORDER BY nome');
      res.json({ data: rows });
    } catch (error) {
      console.error('Erro ao buscar status de rotas:', error);
      res.status(500).json({ error: 'Erro ao buscar status de rotas' });
    }
  });

  // Rota para obter detalhes de uma rota específica
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM Rotas WHERE rota_id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes da rota:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes da rota' });
    }
  });

  // Rota para criar uma nova rota
  router.post('/', async (req, res) => {
    const requiredFields = ['nome', 'codigo_rota'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
      }
    }

    const {
      nome, codigo_rota, descricao, origem_descricao, destino_descricao, distancia_km, tempo_viagem_estimado_minutos, status_rota_id, ativo
    } = req.body;

    const newRouteData = {
      nome, codigo_rota, descricao, origem_descricao, destino_descricao, distancia_km, tempo_viagem_estimado_minutos, status_rota_id, ativo
    };

    try {
      const [result] = await pool.query('INSERT INTO Rotas SET ?', newRouteData);
      const [newRoute] = await pool.execute('SELECT * FROM Rotas WHERE rota_id = ?', [result.insertId]);
      res.status(201).json(newRoute[0]);
    } catch (error) {
      console.error('Erro ao criar rota:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Código da rota já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar rota' });
    }
  });

  // Rota para atualizar uma rota existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      nome, codigo_rota, descricao, origem_descricao, destino_descricao, distancia_km, tempo_viagem_estimado_minutos, status_rota_id, ativo
    } = req.body;

    const updatedRouteData = {
      nome, codigo_rota, descricao, origem_descricao, destino_descricao, distancia_km, tempo_viagem_estimado_minutos, status_rota_id, ativo
    };

    Object.keys(updatedRouteData).forEach(key => updatedRouteData[key] === undefined && delete updatedRouteData[key]);

    if (Object.keys(updatedRouteData).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
    }

    try {
      await pool.query('UPDATE Rotas SET ? WHERE rota_id = ?', [updatedRouteData, id]);
      const [updatedRoute] = await pool.execute('SELECT * FROM Rotas WHERE rota_id = ?', [id]);
      res.json(updatedRoute[0]);
    } catch (error) {
      console.error('Erro ao atualizar rota:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Código da rota já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar rota' });
    }
  });

  // Rota para excluir uma rota
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Rotas WHERE rota_id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      res.json({ message: 'Rota excluída com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir rota:', error);
      res.status(500).json({ error: 'Erro ao excluir rota' });
    }
  });

  return router;
};
