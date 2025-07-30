const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de passageiros com paginação e filtros opcionais
  // Retorna:
  // data: array de passageiros, total: total de passageiros, page: página atual, limit: limite por página, totalPages: total de páginas
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
      
      if (limit && limit > 0) {
        limitClause = "LIMIT ?";
        params.push(parseInt(limit));
      }

      if( offset && offset > 0) {
        limitClause += " OFFSET ?";
        params.push(offset);
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
          P.ativo,
          P.pcd,
          COUNT(*) OVER() as total_passengers_found
        FROM Passageiros P
        ${whereClause}
        ORDER BY passageiro_id ${limitClause}`,
        params
      );

      const totalPassengers = rows.length > 0 ? rows[0].total_passengers_found : 0;
      const totalPages = Math.ceil(totalPassengers / limit);

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
  // Retorna:
  // data: array de tipos de passageiro disponíveis
  router.get('/tipos', async (req, res) => {
    try {
      //console.log('Tentando buscar tipos de passageiro...');
      const [rows] = await pool.execute(
        `SELECT tipo_passageiro_id, nome, descricao 
        FROM TipoPassageiro 
        ORDER BY nome`
      );
      
      //console.log('Tipos encontrados:', rows);

      res.json({
        data: rows
      });
    } catch (error) {
      console.error('Erro ao buscar tipos de passageiro:', error);
      res.status(500).json({ error: 'Erro ao buscar tipos de passageiro', details: error.message });
    }
  });

  // Rota para obter detalhes de um passageiro específico
  // O usuário deve fornecer o 'id' do passageiro nos parâmetros da rota
  // Retorna:
  // Um objeto de passageiro com todos os detalhes
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.execute(
        `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, pcd,
        logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
        tipo_passageiro_id,
        data_criacao, data_atualizacao, ativo
        FROM Passageiros WHERE passageiro_id = ?`,
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
  // O usuário deve fornecer os seguintes campos no corpo da requisição:
  // nome_completo, cpf, email, senha_hash, telefone, data_nascimento, logradouro,
  // numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
  // tipo_passageiro_id, rota_id, notificacoes_json, configuracoes_json, ativo
  // Retorna:
  // O objeto do passageiro recém-criado
  router.post('/', async (req, res) => {
    const requiredFields = ['nome_completo', 'cpf', 'email', 'senha_hash', 'logradouro', 'numero_endereco', 'bairro', 'cidade', 'uf', 'cep', 'tipo_passageiro_id'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}`, request: req.body });
      }
    }    
    const {
      nome_completo, cpf, email, senha_hash, telefone, data_nascimento, pcd,
      logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
      tipo_passageiro_id, rota_id, notificacoes_json, configuracoes_json, ativo
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
      notificacoes_json: notificacoes_json || '{}',
      configuracoes_json: configuracoes_json || '{}',
      ativo: ativo !== undefined ? ativo : true
    };

    try {const [existingRows] = await pool.execute(
        'SELECT passageiro_id, cpf, email FROM Passageiros WHERE cpf = ? OR email = ?',
        [cpf, email]
      );

      if (existingRows.length > 0) {
        let field = 'unknown';
        if (existingRows[0].cpf === cpf){ field = 'CPF' }
        if (existingRows[0].email === email) { field = 'email' };

        return res.status(409).json({ error: `${field} já cadastrado` });
      }

      const [result] = await pool.query('INSERT INTO Passageiros SET ?', newPassengerData);      const [newPassenger] = await pool.execute(
        `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, pcd,
        logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
        tipo_passageiro_id, rota_id, data_criacao, data_atualizacao, ativo
        FROM Passageiros WHERE passageiro_id = ?`,
        [result.insertId]
      );

      res.status(201).json(newPassenger[0]);
    } catch (error) {
      console.error('Erro ao criar passageiro:', error);
      res.status(500).json({ error: 'Erro ao criar passageiro' });
    }
  });

  // Rota para atualizar um passageiro existente
  // O usuário deve fornecer o 'id' do passageiro nos parâmetros da rota
  // E os campos a serem atualizados no corpo da requisição
  // Retorna:
  // O objeto do passageiro atualizado
  router.put('/:id', async (req, res) => {
    const { id } = req.params;    const {
      nome_completo, cpf, email, senha_hash, telefone, data_nascimento, pcd,
      logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
      tipo_passageiro_id, rota_id, notificacoes_json, configuracoes_json, ativo
    } = req.body;

    const updatedPassengerData = {
      nome_completo, cpf, email, senha_hash, telefone, data_nascimento, pcd,
      logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
      tipo_passageiro_id, rota_id, notificacoes_json, configuracoes_json, ativo
    };

    // Remove campos undefined para que o SET ? não tente atualizá-los com 'undefined'
    Object.keys(updatedPassengerData).forEach(key => {
      if (updatedPassengerData[key] === undefined) {
        delete updatedPassengerData[key];
      }
    });

    try {
      const [existingRows] = await pool.execute(
        'SELECT passageiro_id FROM Passageiros WHERE passageiro_id = ?',
        [id]
      );

      if (existingRows.length === 0) {
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

      if (Object.keys(updatedPassengerData).length > 0) {
        await pool.query('UPDATE Passageiros SET ? WHERE passageiro_id = ?', [updatedPassengerData, id]);
      } else {
        return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
      }      
      const [updatedRows] = await pool.execute(
        `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, pcd,
        logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
        tipo_passageiro_id, rota_id, data_criacao, data_atualizacao, ativo
        FROM Passageiros WHERE passageiro_id = ?`,
        [id]
      );

      res.json(updatedRows[0]);
    } catch (error) {
      console.error('Erro ao atualizar passageiro:', error);
      res.status(500).json({ error: 'Erro ao atualizar passageiro' });
    }
  });

  // Rota para excluir um passageiro
  // O usuário deve fornecer o 'id' do passageiro nos parâmetros da rota
  // Retorna:
  // message: mensagem de sucesso, id: o ID do passageiro excluído
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [existingRows] = await pool.execute(
        'SELECT passageiro_id FROM Passageiros WHERE passageiro_id = ?',
        [id]
      );

      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Passageiro não encontrado' });
      }

      await pool.execute('DELETE FROM Passageiros WHERE passageiro_id = ?', [id]);

      res.json({ message: 'Passageiro excluído com sucesso', id });
    } catch (error) {
      console.error('Erro ao excluir passageiro:', error);
      res.status(500).json({ error: 'Erro ao excluir passageiro' });
    }
  });

  // Rota de pesquisa de passageiros usando FULLTEXT search através da tabela searchIndex
  // O usuário deve fornecer o 'query' (termo de busca) nos parâmetros da query
  // Retorna:
  // data: array de passageiros encontrados, count: número de resultados, query: termo de busca
  router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Termo de busca é obrigatório' });
      }

      const [rows] = await pool.execute(
        `SELECT p.* FROM Passageiros p
        INNER JOIN searchIndex s ON p.passageiro_id = s.item_id
        WHERE s.item_type = 'Passageiro'
        AND MATCH(s.search_text) AGAINST(? IN BOOLEAN MODE)
        ORDER BY p.passageiro_id`,
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