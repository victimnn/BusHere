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
          R.status_rota_id,
          SR.nome AS status_nome,
          R.ativo,
          OBR.onibus_id,
          OBR.motorista_id,
          OBR.observacoes AS observacoes_assignment,
          O.nome AS onibus_nome,
          O.placa AS onibus_placa,
          M.nome AS motorista_nome,
          M.cnh_numero AS motorista_cnh,
          COUNT(*) OVER() as total_routes_found
        FROM Rotas R
        JOIN StatusRota SR ON R.status_rota_id = SR.status_rota_id
        LEFT JOIN OnibusRota OBR ON R.rota_id = OBR.rota_id AND OBR.ativo = TRUE
        LEFT JOIN Onibus O ON OBR.onibus_id = O.onibus_id AND O.ativo = TRUE
        LEFT JOIN Motoristas M ON OBR.motorista_id = M.motorista_id AND M.ativo = TRUE
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

  // Rota para obter as paradas de uma rota
  router.get('/stops/:id', async (req, res) => {
    const {id} = req.params;
    try {
      const query = `
        SELECT 
          pr.ponto_rota_id,
          pr.rota_id,
          pr.ponto_id,
          pr.ordem,
          pr.horario_previsto_passagem,
          pr.distancia_do_ponto_anterior_km as distancia_anterior,
          pr.criacao as ponto_rota_criacao,
          pr.atualizacao as ponto_rota_atualizacao,
          pr.ativo as ponto_rota_ativo,
          p.nome,
          p.latitude,
          p.longitude,
          p.logradouro,
          p.numero_endereco,
          p.bairro,
          p.cidade,
          p.uf,
          p.cep,
          p.referencia,
          p.criacao,
          p.atualizacao,
          p.ativo
        FROM PontosRota pr
        INNER JOIN Pontos p ON pr.ponto_id = p.ponto_id
        WHERE pr.rota_id = ? AND pr.ativo = TRUE AND p.ativo = TRUE
        ORDER BY pr.ordem
      `;
      const [rows] = await pool.execute(query, [id]);
      res.json({ data: rows });
    } catch (error) {
      console.error('Erro ao buscar paradas da rota:', error);
      res.status(500).json({ error: 'Erro ao buscar paradas da rota' });
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
      const { includeStops = 'false' } = req.query; // Parâmetro opcional para incluir pontos
      
      // Buscar dados básicos da rota
      const [rows] = await pool.execute('SELECT * FROM Rotas WHERE rota_id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }
      
      const route = rows[0];
      
      // Se solicitado, incluir pontos da rota
      if (includeStops === 'true') {
        const stopQuery = `
          SELECT 
            pr.ponto_rota_id,
            pr.rota_id,
            pr.ponto_id,
            pr.ordem,
            pr.horario_previsto_passagem,
            pr.distancia_do_ponto_anterior_km as distancia_anterior,
            pr.criacao as ponto_rota_criacao,
            pr.atualizacao as ponto_rota_atualizacao,
            pr.ativo as ponto_rota_ativo,
            p.nome,
            p.latitude,
            p.longitude,
            p.logradouro,
            p.numero_endereco,
            p.bairro,
            p.cidade,
            p.uf,
            p.cep,
            p.referencia,
            p.criacao,
            p.atualizacao,
            p.ativo
          FROM PontosRota pr
          INNER JOIN Pontos p ON pr.ponto_id = p.ponto_id
          WHERE pr.rota_id = ? AND pr.ativo = TRUE AND p.ativo = TRUE
          ORDER BY pr.ordem
        `;
        
        const [stopRows] = await pool.execute(stopQuery, [id]);
        route.pontos = stopRows;
      }
      
      res.json(route);
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

  //Rota de criar porem usa entidade assosiativa, no futuro mudar para o POST "/" normal
  router.post("/new", async (req, res) => {
    const requiredFields = ['nome', 'codigo_rota', 'origem_descricao', 'destino_descricao', 'pontos'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
      }
    }
    const { 
      nome, 
      codigo_rota, 
      descricao, 
      origem_descricao, 
      destino_descricao, 
      distancia_km, 
      tempo_viagem_estimado_minutos, 
      status_rota_id, 
      ativo, 
      pontos 
    } = req.body;
    
    if(!Array.isArray(pontos) || pontos.length < 2) {
      return res.status(400).json({ error: "O campo 'pontos' deve ser um array com pelo menos dois elementos"});
    }

    // Validação dos horários em ordem cronológica
    try {
      const pontosComHorario = [];
      
      pontos.forEach((ponto, index) => {
        const horario = typeof ponto === 'object' ? ponto.horario_previsto_passagem : null;
        if (horario && horario.trim() !== '') {
          pontosComHorario.push({
            index: index + 1,
            horario: horario.trim(),
            ponto_id: typeof ponto === 'object' ? ponto.ponto_id : ponto
          });
        }
      });

      if (pontosComHorario.length > 1) {
        for (let i = 1; i < pontosComHorario.length; i++) {
          const pontoAnterior = pontosComHorario[i - 1];
          const pontoAtual = pontosComHorario[i];
          
          if (pontoAtual.horario <= pontoAnterior.horario) {
            return res.status(400).json({ 
              error: `Horário inválido: o ponto na posição ${pontoAtual.index} (${pontoAtual.horario}) deve ter horário posterior ao ponto na posição ${pontoAnterior.index} (${pontoAnterior.horario})`
            });
          }
        }
      }
    } catch (validationError) {
      console.error('Erro na validação de horários:', validationError);
      // Continuar mesmo com erro na validação de horários
    }

    const newRouteData = { 
      nome, 
      codigo_rota, 
      descricao, 
      origem_descricao, 
      destino_descricao, 
      distancia_km, 
      tempo_viagem_estimado_minutos, 
      status_rota_id, 
      ativo 
    };

    try {
      const [result] = await pool.query('INSERT INTO Rotas SET ?', newRouteData);
      const rota_id = result.insertId;

      console.log('Rota criada com ID:', rota_id);
      console.log('Pontos recebidos:', pontos);

      // Suporte para pontos com horário
      const routePointsData = pontos.map((ponto, index) => {
        console.log(`Processando ponto ${index + 1}:`, ponto);
        // Se o ponto é um objeto com ponto_id e horario_previsto_passagem
        if (typeof ponto === 'object' && ponto.ponto_id !== undefined) {
          const data = [
            rota_id, 
            ponto.ponto_id, 
            index + 1, 
            ponto.horario_previsto_passagem || null
          ];
          console.log(`Dados do ponto objeto ${index + 1}:`, data);
          return data;
        }
        // Se o ponto é apenas um ID (compatibilidade com versão anterior)
        const data = [rota_id, ponto, index + 1, null];
        console.log(`Dados do ponto ID ${index + 1}:`, data);
        return data;
      });
      
      console.log('Dados finais para inserir em PontosRota:', routePointsData);
      
      const resultPontos = await pool.query(
        'INSERT INTO PontosRota (rota_id, ponto_id, ordem, horario_previsto_passagem) VALUES ?', 
        [routePointsData]
      );
      
      console.log('Resultado da inserção de pontos:', resultPontos);
      
      console.log({result, rota_id, pontos});
      res.status(201).json({ 
        rota_id, 
        nome, 
        codigo_rota, 
        descricao, 
        origem_descricao, 
        destino_descricao, 
        distancia_km, 
        tempo_viagem_estimado_minutos, 
        status_rota_id, 
        ativo, 
        pontos 
      });
    } catch (error) {
      console.error('Erro ao criar rota com pontos:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Código da rota já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar rota com pontos' });
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

  // Rota para atualizar uma rota com pontos
  router.put('/:id/with-stops', async (req, res) => {
    const { id } = req.params;
    const {
      nome, 
      codigo_rota, 
      descricao, 
      origem_descricao, 
      destino_descricao, 
      distancia_km, 
      tempo_viagem_estimado_minutos, 
      status_rota_id, 
      ativo,
      pontos
    } = req.body;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar se a rota existe
      const [routeExists] = await connection.execute('SELECT rota_id FROM Rotas WHERE rota_id = ?', [id]);
      if (routeExists.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Rota não encontrada' });
      }

      // Atualizar dados básicos da rota
      const updatedRouteData = {
        nome, codigo_rota, descricao, origem_descricao, destino_descricao, 
        distancia_km, tempo_viagem_estimado_minutos, status_rota_id, ativo
      };

      // Remover campos undefined
      Object.keys(updatedRouteData).forEach(key => 
        updatedRouteData[key] === undefined && delete updatedRouteData[key]
      );

      if (Object.keys(updatedRouteData).length > 0) {
        await connection.query('UPDATE Rotas SET ? WHERE rota_id = ?', [updatedRouteData, id]);
      }

      // Se pontos foram fornecidos, atualizar associações
      if (pontos && Array.isArray(pontos)) {
        // Remover todas as associações existentes
        await connection.execute('DELETE FROM PontosRota WHERE rota_id = ?', [id]);

        // Inserir novas associações se houver pontos
        if (pontos.length > 0) {
          // Validação dos horários em ordem cronológica
          const pontosComHorario = [];
          
          pontos.forEach((ponto, index) => {
            const horario = typeof ponto === 'object' ? ponto.horario_previsto_passagem : null;
            
            if (horario) {
              pontosComHorario.push({
                horario,
                ordem: typeof ponto === 'object' ? ponto.ordem : index + 1
              });
            }
          });

          // Verificar se horários estão em ordem cronológica
          if (pontosComHorario.length > 1) {
            for (let i = 1; i < pontosComHorario.length; i++) {
              if (pontosComHorario[i].horario <= pontosComHorario[i - 1].horario) {
                await connection.rollback();
                return res.status(400).json({ 
                  error: `Horário do ponto ${pontosComHorario[i].ordem} deve ser posterior ao ponto anterior` 
                });
              }
            }
          }

          // Preparar dados para inserção
          const routePointsData = pontos.map((ponto, index) => {
            const pontoId = typeof ponto === 'object' ? ponto.ponto_id : ponto;
            const ordem = typeof ponto === 'object' ? ponto.ordem : index + 1;
            const horario = typeof ponto === 'object' ? ponto.horario_previsto_passagem : null;
            
            return [id, pontoId, ordem, horario];
          });

          await connection.query(
            'INSERT INTO PontosRota (rota_id, ponto_id, ordem, horario_previsto_passagem) VALUES ?', 
            [routePointsData]
          );
        }
      }

      await connection.commit();

      // Buscar rota atualizada com pontos
      const [updatedRoute] = await connection.execute('SELECT * FROM Rotas WHERE rota_id = ?', [id]);
      
      // Buscar pontos da rota atualizada
      const stopQuery = `
        SELECT 
          pr.ponto_rota_id,
          pr.rota_id,
          pr.ponto_id,
          pr.ordem,
          pr.horario_previsto_passagem,
          pr.distancia_do_ponto_anterior_km as distancia_anterior,
          p.nome,
          p.latitude,
          p.longitude,
          p.logradouro,
          p.numero_endereco,
          p.bairro,
          p.cidade,
          p.uf,
          p.cep,
          p.referencia
        FROM PontosRota pr
        INNER JOIN Pontos p ON pr.ponto_id = p.ponto_id
        WHERE pr.rota_id = ? AND pr.ativo = TRUE AND p.ativo = TRUE
        ORDER BY pr.ordem
      `;
      
      const [stopRows] = await connection.execute(stopQuery, [id]);
      const routeWithStops = {
        ...updatedRoute[0],
        pontos: stopRows
      };

      res.json({
        message: 'Rota atualizada com sucesso',
        rota_id: id,
        data: routeWithStops
      });

    } catch (error) {
      await connection.rollback();
      console.error('Erro ao atualizar rota com pontos:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Código da rota já cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar rota com pontos' });
    } finally {
      connection.release();
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

  // ENDPOINTS PARA ONIBUS-ROTA (Associação de ônibus e motorista a rotas)

  // Teste da tabela OnibusRota
  router.get('/:id/test-assignments', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Testando tabela OnibusRota para rota_id:', id);
      
      // Teste 1: Verificar se a tabela existe
      const [testResult] = await pool.execute('SELECT COUNT(*) as count FROM OnibusRota WHERE rota_id = ?', [id]);
      console.log('Resultado do teste:', testResult);
      
      // Teste 2: Verificar estrutura da tabela
      const [tableStructure] = await pool.execute('DESCRIBE OnibusRota');
      console.log('Estrutura da tabela OnibusRota:', tableStructure);
      
      // Teste 3: Verificar dados existentes
      const [allData] = await pool.execute('SELECT * FROM OnibusRota LIMIT 5');
      console.log('Dados existentes:', allData);
      
      // Teste 4: Verificar se rota existe
      const [routeExists] = await pool.execute('SELECT rota_id FROM Rotas WHERE rota_id = ?', [id]);
      console.log('Rota existe:', routeExists);
      
      // Teste 5: Verificar se ônibus ID 5 existe
      const [busExists] = await pool.execute('SELECT onibus_id FROM Onibus WHERE onibus_id = 5 AND ativo = TRUE');
      console.log('Ônibus ID 5 existe:', busExists);
      
      // Teste 6: Verificar se motorista ID 1 existe
      const [driverExists] = await pool.execute('SELECT motorista_id FROM Motoristas WHERE motorista_id = 1 AND ativo = TRUE');
      console.log('Motorista ID 1 existe:', driverExists);
      
      res.json({ 
        message: 'Testes completados', 
        tableCount: testResult[0].count,
        tableStructure: tableStructure,
        existingData: allData,
        routeExists: routeExists.length > 0,
        busExists: busExists.length > 0,
        driverExists: driverExists.length > 0
      });
    } catch (error) {
      console.error('Erro no teste da tabela OnibusRota:', error);
      res.status(500).json({ error: 'Erro ao acessar tabela OnibusRota', details: error.message, stack: error.stack });
    }
  });

  // Teste de inserção simples
  router.post('/:id/test-insert', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Testando inserção na tabela OnibusRota para rota_id:', id);
      
      // Tentar inserir um registro de teste
      const testData = {
        rota_id: id,
        onibus_id: 5,
        motorista_id: 1,
        observacoes: 'Teste de inserção',
        ativo: true
      };
      
      console.log('Dados de teste para inserção:', testData);
      
      const [result] = await pool.query('INSERT INTO OnibusRota SET ?', testData);
      console.log('Resultado da inserção:', result);
      
      // Buscar o registro inserido
      const [inserted] = await pool.execute('SELECT * FROM OnibusRota WHERE onibus_rota_id = ?', [result.insertId]);
      console.log('Registro inserido:', inserted[0]);
      
      res.json({ 
        message: 'Inserção de teste bem-sucedida', 
        insertId: result.insertId,
        insertedRecord: inserted[0]
      });
    } catch (error) {
      console.error('Erro na inserção de teste:', error);
      res.status(500).json({ 
        error: 'Erro na inserção de teste', 
        details: error.message, 
        stack: error.stack,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage
      });
    }
  });

  // Buscar associações de uma rota
  router.get('/:id/assignments', async (req, res) => {
    try {
      const { id } = req.params;
      
      const [rows] = await pool.execute(
        `SELECT 
          OBR.onibus_rota_id,
          OBR.rota_id,
          OBR.onibus_id,
          OBR.motorista_id,
          OBR.observacoes,
          OBR.ativo,
          OBR.criacao,
          OBR.atualizacao,
          O.nome as onibus_nome,
          O.placa as onibus_placa,
          O.modelo as onibus_modelo,
          O.marca as onibus_marca,
          M.nome as motorista_nome,
          M.cnh_numero as motorista_cnh,
          M.telefone as motorista_telefone
        FROM OnibusRota OBR
        LEFT JOIN Onibus O ON OBR.onibus_id = O.onibus_id
        LEFT JOIN Motoristas M ON OBR.motorista_id = M.motorista_id
        WHERE OBR.rota_id = ? AND OBR.ativo = TRUE
        ORDER BY OBR.criacao DESC`,
        [id]
      );
      
      res.json({ data: rows });
    } catch (error) {
      console.error('Erro ao buscar associações da rota:', error);
      res.status(500).json({ error: 'Erro ao buscar associações da rota' });
    }
  });

  // Criar nova associação ônibus-motorista-rota
  router.post('/:id/assignments', async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        onibus_id, 
        motorista_id, 
        observacoes 
      } = req.body;

      console.log('Criando associação para rota_id:', id);
      console.log('Dados recebidos:', { onibus_id, motorista_id, observacoes });

      // Validações obrigatórias
      if (!onibus_id || !motorista_id) {
        return res.status(400).json({ 
          error: 'Ônibus e motorista são obrigatórios' 
        });
      }

      // Verificar se a rota existe
      console.log('Verificando se a rota existe...');
      const [routeCheck] = await pool.execute(
        'SELECT rota_id FROM Rotas WHERE rota_id = ?', 
        [id]
      );
      console.log('Resultado da verificação da rota:', routeCheck);
      if (routeCheck.length === 0) {
        return res.status(404).json({ error: 'Rota não encontrada' });
      }

      // Verificar se o ônibus existe e está ativo
      console.log('Verificando se o ônibus existe...');
      const [busCheck] = await pool.execute(
        'SELECT onibus_id FROM Onibus WHERE onibus_id = ? AND ativo = TRUE', 
        [onibus_id]
      );
      console.log('Resultado da verificação do ônibus:', busCheck);
      if (busCheck.length === 0) {
        return res.status(400).json({ error: 'Ônibus não encontrado ou inativo' });
      }

      // Verificar se o motorista existe e está ativo
      console.log('Verificando se o motorista existe...');
      const [driverCheck] = await pool.execute(
        'SELECT motorista_id FROM Motoristas WHERE motorista_id = ? AND ativo = TRUE', 
        [motorista_id]
      );
      console.log('Resultado da verificação do motorista:', driverCheck);
      if (driverCheck.length === 0) {
        return res.status(400).json({ error: 'Motorista não encontrado ou inativo' });
      }

      // Verificar se já existe uma associação ativa para esta rota com o mesmo ônibus ou motorista
      console.log('Verificando associações existentes...');
      const [existingAssignment] = await pool.execute(
        `SELECT onibus_rota_id FROM OnibusRota 
         WHERE rota_id = ? AND (onibus_id = ? OR motorista_id = ?) AND ativo = TRUE`,
        [id, onibus_id, motorista_id]
      );
      console.log('Associações existentes encontradas:', existingAssignment);
      
      if (existingAssignment.length > 0) {
        return res.status(409).json({ 
          error: 'Este ônibus ou motorista já está associado a esta rota' 
        });
      }

      // Criar a associação
      console.log('Criando a associação...');
      const assignmentData = {
        rota_id: id,
        onibus_id,
        motorista_id,
        observacoes: observacoes || null,
        ativo: true
      };
      console.log('Dados da associação a ser criada:', assignmentData);

      const [result] = await pool.query(
        'INSERT INTO OnibusRota SET ?', 
        assignmentData
      );
      console.log('Resultado da inserção:', result);

      // Buscar a associação criada com dados completos
      console.log('Buscando associação criada com ID:', result.insertId);
      const [newAssignment] = await pool.execute(
        `SELECT 
          OBR.onibus_rota_id,
          OBR.rota_id,
          OBR.onibus_id,
          OBR.motorista_id,
          OBR.observacoes,
          OBR.ativo,
          OBR.criacao,
          OBR.atualizacao,
          O.nome as onibus_nome,
          O.placa as onibus_placa,
          O.modelo as onibus_modelo,
          O.marca as onibus_marca,
          M.nome as motorista_nome,
          M.cnh_numero as motorista_cnh,
          M.telefone as motorista_telefone
        FROM OnibusRota OBR
        LEFT JOIN Onibus O ON OBR.onibus_id = O.onibus_id
        LEFT JOIN Motoristas M ON OBR.motorista_id = M.motorista_id
        WHERE OBR.onibus_rota_id = ?`,
        [result.insertId]
      );
      console.log('Associação criada:', newAssignment[0]);

      res.status(201).json(newAssignment[0]);
    } catch (error) {
      console.error('Erro detalhado ao criar associação:', error);
      console.error('Tipo do erro:', typeof error);
      console.error('Nome do erro:', error.name);
      console.error('Mensagem do erro:', error.message);
      console.error('Código do erro:', error.code);
      console.error('SQL State:', error.sqlState);
      console.error('SQL Message:', error.sqlMessage);
      console.error('Errno:', error.errno);
      console.error('Stack trace:', error.stack);
      console.error('Dados que causaram erro:', { rota_id: rota_id, onibus_id, motorista_id, observacoes });
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Já existe uma associação para este ônibus e rota' 
        });
      }
      
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          error: 'Tabela OnibusRota não encontrada. Execute as migrations.' 
        });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ 
          error: 'Referência inválida: rota, ônibus ou motorista não existe' 
        });
      }
      
      res.status(500).json({ 
        error: 'Erro ao criar associação', 
        details: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
        errno: error.errno
      });
    }
  });

  // Atualizar associação existente
  router.put('/:id/assignments/:assignmentId', async (req, res) => {
    try {
      const { id, assignmentId } = req.params;
      const { 
        onibus_id, 
        motorista_id, 
        observacoes,
        ativo 
      } = req.body;

      // Verificar se a associação existe
      const [assignmentCheck] = await pool.execute(
        'SELECT onibus_rota_id FROM OnibusRota WHERE onibus_rota_id = ? AND rota_id = ?',
        [assignmentId, id]
      );
      
      if (assignmentCheck.length === 0) {
        return res.status(404).json({ error: 'Associação não encontrada' });
      }

      const updatedData = {};
      
      // Validar e adicionar campos que foram fornecidos
      if (onibus_id !== undefined) {
        // Verificar se o ônibus existe e está ativo
        const [busCheck] = await pool.execute(
          'SELECT onibus_id FROM Onibus WHERE onibus_id = ? AND ativo = TRUE', 
          [onibus_id]
        );
        if (busCheck.length === 0) {
          return res.status(400).json({ error: 'Ônibus não encontrado ou inativo' });
        }
        updatedData.onibus_id = onibus_id;
      }

      if (motorista_id !== undefined) {
        // Verificar se o motorista existe e está ativo
        const [driverCheck] = await pool.execute(
          'SELECT motorista_id FROM Motoristas WHERE motorista_id = ? AND ativo = TRUE', 
          [motorista_id]
        );
        if (driverCheck.length === 0) {
          return res.status(400).json({ error: 'Motorista não encontrado ou inativo' });
        }
        updatedData.motorista_id = motorista_id;
      }

      if (observacoes !== undefined) updatedData.observacoes = observacoes;
      if (ativo !== undefined) updatedData.ativo = ativo;

      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
      }

      // Atualizar a associação
      await pool.query(
        'UPDATE OnibusRota SET ? WHERE onibus_rota_id = ?', 
        [updatedData, assignmentId]
      );

      // Buscar a associação atualizada com dados completos
      const [updatedAssignment] = await pool.execute(
        `SELECT 
          OBR.onibus_rota_id,
          OBR.rota_id,
          OBR.onibus_id,
          OBR.motorista_id,
          OBR.observacoes,
          OBR.ativo,
          OBR.criacao,
          OBR.atualizacao,
          O.nome as onibus_nome,
          O.placa as onibus_placa,
          O.modelo as onibus_modelo,
          O.marca as onibus_marca,
          M.nome as motorista_nome,
          M.cnh_numero as motorista_cnh,
          M.telefone as motorista_telefone
        FROM OnibusRota OBR
        LEFT JOIN Onibus O ON OBR.onibus_id = O.onibus_id
        LEFT JOIN Motoristas M ON OBR.motorista_id = M.motorista_id
        WHERE OBR.onibus_rota_id = ?`,
        [assignmentId]
      );

      res.json(updatedAssignment[0]);
    } catch (error) {
      console.error('Erro ao atualizar associação:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Já existe uma associação para este ônibus e rota' 
        });
      }
      res.status(500).json({ error: 'Erro ao atualizar associação' });
    }
  });

  // Excluir associação (soft delete)
  router.delete('/:id/assignments/:assignmentId', async (req, res) => {
    try {
      const { id, assignmentId } = req.params;
      
      const [result] = await pool.execute(
        'UPDATE OnibusRota SET ativo = FALSE WHERE onibus_rota_id = ? AND rota_id = ?',
        [assignmentId, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Associação não encontrada' });
      }
      
      res.json({ 
        message: 'Associação removida com sucesso', 
        onibus_rota_id: assignmentId 
      });
    } catch (error) {
      console.error('Erro ao remover associação:', error);
      res.status(500).json({ error: 'Erro ao remover associação' });
    }
  });

  return router;
};
