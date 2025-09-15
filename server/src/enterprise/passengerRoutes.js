const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de passageiros com paginação e filtros opcionais
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 0, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit) ?? 0;

      let params = [];
      let whereClause = "";
      let limitClause = "";

      if (search) {
        whereClause = ' WHERE nome_completo LIKE ? OR cpf LIKE ? OR email LIKE ? OR telefone LIKE ?';
        const searchPattern = `%${search}%`;
        params = [searchPattern, searchPattern, searchPattern, searchPattern];
      }
      
      if (limit > 0) {
        limitClause = " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);
      }

      // Single query to fetch data and total count using a window function
      const [rows] = await pool.execute(
        `SELECT 
          P.passageiro_id,
          P.nome_completo, 
          P.cpf, 
          P.email, 
          P.telefone,
          P.data_nascimento,
          P.data_criacao,
          P.tipo_passageiro_id,
          TP.nome AS tipo_passageiro_nome,
          P.ativo,
          P.pcd,
          P.logradouro,
          P.numero_endereco,
          P.complemento_endereco,
          P.bairro,
          P.cidade,
          P.uf,
          P.cep,
          P.rota_id,
          R.nome AS rota_nome,
          P.ponto_id,
          PO.nome AS ponto_nome,
          COUNT(*) OVER() as total_passengers_found
        FROM Passageiros P
        LEFT JOIN TipoPassageiro TP ON P.tipo_passageiro_id = TP.tipo_passageiro_id
        LEFT JOIN Rotas R ON P.rota_id = R.rota_id
        LEFT JOIN Pontos PO ON P.ponto_id = PO.ponto_id
        ${whereClause}
        ORDER BY passageiro_id ${limitClause}`,
        params
      );

      const totalPassengers = rows.length > 0 ? rows[0].total_passengers_found : 0;
      const totalPages = limit > 0 ? Math.ceil(totalPassengers / limit) : 1;

      res.json({
        data: rows.map(({ total_passengers_found, ...rest }) => rest), // Remove the total_passengers_found from each row
        total: totalPassengers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      });    
    } catch (error) {
      console.error('Erro ao buscar passageiros:', error);
      res.status(500).json({ error: 'Erro ao buscar passageiros' });
    }
  });

  // Rota para buscar tipos de passageiro
  router.get('/tipos', async (req, res) => {
    try {
      //console.log('Tentando buscar tipos de passageiro...');
      const [rows] = await pool.execute(
        `SELECT tipo_passageiro_id, nome, descricao 
        FROM TipoPassageiro 
        ORDER BY nome`
      );

      res.json({
        data: rows
      });
    } catch (error) {
      console.error('Erro ao buscar tipos de passageiro:', error);
      res.status(500).json({ error: 'Erro ao buscar tipos de passageiro', details: error.message });
    }
  });

  // Rota para buscar rotas disponíveis
  router.get('/rotas', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT R.rota_id, R.nome, R.codigo_rota 
        FROM Rotas R
        LEFT JOIN StatusRota SR ON R.status_rota_id = SR.status_rota_id
        WHERE R.ativo = true 
        AND (SR.nome = 'Ativa' OR R.status_rota_id IS NULL)
        ORDER BY R.nome`
      );

      res.json({
        data: rows
      });
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      res.status(500).json({ error: 'Erro ao buscar rotas', details: error.message });
    }
  });

  // Rota para buscar pontos disponíveis
  router.get('/pontos', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT ponto_id, nome, cidade, uf 
        FROM Pontos 
        WHERE ativo = true 
        ORDER BY nome`
      );

      res.json({
        data: rows
      });
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
      res.status(500).json({ error: 'Erro ao buscar pontos', details: error.message });
    }
  });

  // Rota para obter detalhes de um passageiro específico
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.execute(
        `SELECT 
        P.passageiro_id, 
        P.nome_completo, 
        P.cpf, 
        P.email, 
        P.telefone, 
        P.data_nascimento, 
        P.pcd,
        P.logradouro, 
        P.numero_endereco, 
        P.complemento_endereco, 
        P.bairro, 
        P.cidade, 
        P.uf, 
        P.cep,
        P.tipo_passageiro_id,
        TP.nome AS tipo_passageiro_nome,
        P.rota_id,
        R.nome AS rota_nome,
        P.ponto_id,
        PO.nome AS ponto_nome,
        P.data_criacao, 
        P.data_atualizacao, 
        P.ativo
        FROM Passageiros P
        LEFT JOIN TipoPassageiro TP ON P.tipo_passageiro_id = TP.tipo_passageiro_id
        LEFT JOIN Rotas R ON P.rota_id = R.rota_id
        LEFT JOIN Pontos PO ON P.ponto_id = PO.ponto_id
        WHERE P.passageiro_id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Passageiro não encontrado' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar detalhes do passageiro:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes do passageiro' });
    }
  });

  // Rota para criar um novo passageiro
  router.post('/', async (req, res) => {
    // LOG: Verificar dados recebidos
    console.log('POST /passengers req.body:', req.body);

    const requiredFields = ['nome_completo', 'cpf', 'email', 'senha_hash', 'logradouro', 'numero_endereco', 'bairro', 'cidade', 'uf', 'cep', 'tipo_passageiro_id'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.error(`Campo obrigatório faltando: ${field}`);
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}`, request: req.body });
      }
    }

    const {
      nome_completo, cpf, email, senha_hash, telefone, data_nascimento, pcd,
      logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
      tipo_passageiro_id, rota_id, ponto_id, notificacoes_json, configuracoes_json, ativo
    } = req.body;

    const newPassengerData = {
      nome_completo,
      cpf,
      email,
      senha_hash,
      telefone: telefone || null,
      data_nascimento: data_nascimento || null,
      pcd: pcd || false,
      logradouro,
      numero_endereco,
      complemento_endereco: complemento_endereco || null,
      bairro,
      cidade,
      uf,
      cep,
      tipo_passageiro_id: tipo_passageiro_id || null,
      rota_id: rota_id || null,
      ponto_id: ponto_id || null,
      notificacoes_json: notificacoes_json || '{}',
      configuracoes_json: configuracoes_json || '{}',
      ativo: ativo !== undefined ? ativo : true
    };

    try {
      const [existingRows] = await pool.execute(
        'SELECT passageiro_id, cpf, email FROM Passageiros WHERE cpf = ? OR email = ?',
        [cpf, email]
      );

      if (existingRows.length > 0) {
        let field = 'unknown';
        if (existingRows[0].cpf === cpf){ field = 'CPF' }
        if (existingRows[0].email === email) { field = 'email' };
        return res.status(409).json({ error: `${field} já cadastrado` });
      }

      const [result] = await pool.query('INSERT INTO Passageiros SET ?', newPassengerData);
      const [newPassenger] = await pool.execute(
        `SELECT 
        P.passageiro_id, 
        P.nome_completo, 
        P.cpf, 
        P.email, 
        P.telefone, 
        P.data_nascimento, 
        P.pcd,
        P.logradouro, 
        P.numero_endereco, 
        P.complemento_endereco, 
        P.bairro, 
        P.cidade, 
        P.uf, 
        P.cep,
        P.tipo_passageiro_id,
        TP.nome AS tipo_passageiro_nome,
        P.rota_id,
        R.nome AS rota_nome,
        P.ponto_id,
        PO.nome AS ponto_nome,
        P.data_criacao, 
        P.data_atualizacao, 
        P.ativo
        FROM Passageiros P 
        LEFT JOIN TipoPassageiro TP ON P.tipo_passageiro_id = TP.tipo_passageiro_id
        LEFT JOIN Rotas R ON P.rota_id = R.rota_id
        LEFT JOIN Pontos PO ON P.ponto_id = PO.ponto_id
        WHERE P.passageiro_id = ?`,
        [result.insertId]
      );

      res.status(201).json(newPassenger[0]);
    } catch (error) {
      console.error('Erro ao criar passageiro:', error);
      console.error('Stack:', error.stack);
      res.status(500).json({ error: 'Erro ao criar passageiro', details: error.message, stack: error.stack });
    }
  });

  // Rota para atualizar um passageiro existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
      nome_completo, cpf, email, senha_hash, telefone, data_nascimento, pcd,
      logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
      tipo_passageiro_id, rota_id, ponto_id, notificacoes_json, configuracoes_json, ativo
    } = req.body;

    try {
      const [existingPassenger] = await pool.execute(
        'SELECT passageiro_id FROM Passageiros WHERE passageiro_id = ?',
        [id]
      );

      if (existingPassenger.length === 0) {
        return res.status(404).json({ error: 'Passageiro não encontrado' });
      }

      if (cpf || email) {
        const [existingCpfEmailRows] = await pool.execute(
          'SELECT passageiro_id, cpf, email FROM Passageiros WHERE (cpf = ? OR email = ?) AND passageiro_id != ?',
          [cpf, email, id]
        );

        if (existingCpfEmailRows.length > 0) {
          let field = 'unknown';
          if (existingCpfEmailRows[0].cpf === cpf) field = 'CPF';
          else if (existingCpfEmailRows[0].email === email) field = 'email';

          return res.status(409).json({ error: `${field} já está sendo usado por outro passageiro` });
        }
      }

      const updateData = {};
      if (nome_completo) updateData.nome_completo = nome_completo;
      if (cpf) updateData.cpf = cpf;
      if (email) updateData.email = email;
      if (senha_hash) updateData.senha_hash = senha_hash;
      if (telefone) updateData.telefone = telefone;
      if (data_nascimento) updateData.data_nascimento = data_nascimento;
      if (pcd !== undefined) updateData.pcd = pcd;
      if (logradouro) updateData.logradouro = logradouro;
      if (numero_endereco) updateData.numero_endereco = numero_endereco;
      if (complemento_endereco) updateData.complemento_endereco = complemento_endereco;
      if (bairro) updateData.bairro = bairro;
      if (cidade) updateData.cidade = cidade;
      if (uf) updateData.uf = uf;
      if (cep) updateData.cep = cep;
      if (tipo_passageiro_id !== undefined) updateData.tipo_passageiro_id = tipo_passageiro_id;
      if (rota_id !== undefined) updateData.rota_id = rota_id;
      if (ponto_id !== undefined) updateData.ponto_id = ponto_id;
      if (notificacoes_json !== undefined) updateData.notificacoes_json = notificacoes_json;
      if (configuracoes_json !== undefined) updateData.configuracoes_json = configuracoes_json;
      if (ativo !== undefined) updateData.ativo = ativo;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' });
      }

      await pool.query('UPDATE Passageiros SET ? WHERE passageiro_id = ?', [updateData, id]);

      const [updatedPassenger] = await pool.execute(
        `SELECT 
        P.passageiro_id, 
        P.nome_completo, 
        P.cpf, 
        P.email, 
        P.telefone, 
        P.data_nascimento, 
        P.pcd,
        P.logradouro, 
        P.numero_endereco, 
        P.complemento_endereco, 
        P.bairro, 
        P.cidade, 
        P.uf, 
        P.cep,
        P.tipo_passageiro_id,
        TP.nome AS tipo_passageiro_nome,
        P.rota_id,
        R.nome AS rota_nome,
        P.ponto_id,
        PO.nome AS ponto_nome,
        P.data_criacao, 
        P.data_atualizacao, 
        P.ativo
        FROM Passageiros P
        LEFT JOIN TipoPassageiro TP ON P.tipo_passageiro_id = TP.tipo_passageiro_id
        LEFT JOIN Rotas R ON P.rota_id = R.rota_id
        LEFT JOIN Pontos PO ON P.ponto_id = PO.ponto_id
        WHERE P.passageiro_id = ?`,
        [id]
      );

      res.json(updatedPassenger[0]);
    } catch (error) {
      console.error('Erro ao atualizar passageiro:', error);
      res.status(500).json({ error: 'Erro ao atualizar passageiro' });
    }
  });

  // Rota para excluir um passageiro
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Passageiros WHERE passageiro_id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Passageiro não encontrado' });
      }

      res.json({ message: 'Passageiro excluído com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir passageiro:', error);
      res.status(500).json({ error: 'Erro ao excluir passageiro' });
    }
  });

  // Rota de pesquisa de passageiros usando FULLTEXT search através da tabela searchIndex
  router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Termo de busca é obrigatório' });
      }

      const [rows] = await pool.execute(
        `SELECT P.* FROM Passageiros P
        INNER JOIN searchIndex S ON P.passageiro_id = S.item_id
        WHERE S.item_type = 'Passageiro'
        AND MATCH(S.search_text) AGAINST(? IN BOOLEAN MODE)
        ORDER BY P.passageiro_id`,
        [query]
      );

      res.json({
        data: rows,
        count: rows.length,
        query
      });    
    } catch (error) {
      console.error('Erro ao pesquisar passageiros:', error);
      res.status(500).json({ error: 'Erro ao pesquisar passageiros' });
    }
  });

  return router;
};