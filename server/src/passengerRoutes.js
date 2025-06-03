// Implementação das rotas de passageiros
const express = require('express');

// Exportando as rotas com o pool de conexões
module.exports = (pool) => {
    const router = express.Router();

    /**
     * @route GET /passengers
     * @desc Obtém uma lista de passageiros com paginação e filtros opcionais
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.get('/', async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);
            
            let query = 'SELECT passageiro_id, nome_completo, cpf, email, telefone FROM Passageiros';
            let countQuery = 'SELECT COUNT(*) as total FROM Passageiros';
            let params = [];
            let countParams = [];
            
            if (search) {
                query += ' WHERE nome_completo LIKE ? OR cpf LIKE ? OR email LIKE ? OR telefone LIKE ?';
                countQuery += ' WHERE nome_completo LIKE ? OR cpf LIKE ? OR email LIKE ? OR telefone LIKE ?';
                
                const searchPattern = `%${search}%`;
                params = [searchPattern, searchPattern, searchPattern, searchPattern];
                countParams = [searchPattern, searchPattern, searchPattern, searchPattern];
            }
            
            query += ' ORDER BY passageiro_id LIMIT ? OFFSET ?';
            params.push(parseInt(limit), offset);
            
            const [rows] = await pool.execute(query, params);
            const [countRows] = await pool.execute(countQuery, countParams);
            
            const totalPassengers = countRows[0].total;
            const totalPages = Math.ceil(totalPassengers / limit);
            
            res.json({
                data: rows,
                total: totalPassengers,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages
            });
        } catch (error) {
            console.error('Erro ao buscar passageiros:', error);
            res.status(500).json({ 
                error: 'Erro ao buscar passageiros',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    /**
     * @route GET /passengers/:id
     * @desc Obtém detalhes de um passageiro específico
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            
            const [rows] = await pool.execute(
                `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, 
                logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
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

    /**
     * @route POST /passengers
     * @desc Cria um novo passageiro
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.post('/', async (req, res) => {
        try {
            const { 
                nome_completo, 
                cpf, 
                email, 
                senha_hash, 
                telefone, 
                data_nascimento, 
                logradouro,
                numero_endereco,
                complemento_endereco,
                bairro,
                cidade,
                uf,
                cep,
                tipo_passageiro_id,
                rota_id,
                status_pagamento_id,
                notificacoes_json,
                configuracoes_json,
                ativo
            } = req.body;
            
            // Validação básica
            if (!nome_completo || !cpf || !email || !senha_hash) {
                return res.status(400).json({ error: 'Nome completo, CPF, e-mail e senha são obrigatórios' });
            }
            
            // Verificar se o CPF ou e-mail já estão cadastrados
            const [existingRows] = await pool.execute(
                'SELECT passageiro_id FROM Passageiros WHERE cpf = ? OR email = ?',
                [cpf, email]
            );
            
            if (existingRows.length > 0) {
                return res.status(400).json({ error: 'CPF ou e-mail já cadastrados' });
            }
            
            const [result] = await pool.execute(
                `INSERT INTO Passageiros 
                (nome_completo, cpf, email, senha_hash, telefone, data_nascimento, 
                logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
                tipo_passageiro_id, rota_id, status_pagamento_id, 
                notificacoes_json, configuracoes_json, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome_completo, cpf, email, senha_hash, telefone || null, data_nascimento || null,
                    logradouro, numero_endereco, complemento_endereco || null, bairro, cidade, uf, cep,
                    tipo_passageiro_id || null, rota_id || null, status_pagamento_id || null,
                    notificacoes_json || '{}', configuracoes_json || '{}', ativo !== undefined ? ativo : true
                ]
            );
            
            const [newPassenger] = await pool.execute(
                `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, 
                logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
                tipo_passageiro_id, rota_id, status_pagamento_id, data_criacao, data_atualizacao, ativo
                FROM Passageiros WHERE passageiro_id = ?`,
                [result.insertId]
            );
            
            res.status(201).json(newPassenger[0]);
        } catch (error) {
            console.error('Erro ao criar passageiro:', error);
            res.status(500).json({ error: 'Erro ao criar passageiro' });
        }
    });

    /**
     * @route PUT /passengers/:id
     * @desc Atualiza um passageiro existente
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nome_completo, 
                cpf, 
                email, 
                senha_hash, 
                telefone, 
                data_nascimento, 
                logradouro,
                numero_endereco,
                complemento_endereco,
                bairro,
                cidade,
                uf,
                cep,
                tipo_passageiro_id,
                rota_id,
                status_pagamento_id,
                notificacoes_json,
                configuracoes_json,
                ativo
            } = req.body;
            
            // Validação básica
            if (!nome_completo || !cpf || !email) {
                return res.status(400).json({ error: 'Nome completo, CPF e e-mail são obrigatórios' });
            }
            
            // Verificar se o passageiro existe
            const [existingRows] = await pool.execute(
                'SELECT passageiro_id FROM Passageiros WHERE passageiro_id = ?',
                [id]
            );
            
            if (existingRows.length === 0) {
                return res.status(404).json({ error: 'Passageiro não encontrado' });
            }
            
            // Verificar se o CPF ou email já está em uso por outro passageiro
            const [existingCpfEmailRows] = await pool.execute(
                'SELECT passageiro_id FROM Passageiros WHERE (cpf = ? OR email = ?) AND passageiro_id != ?',
                [cpf, email, id]
            );
            
            if (existingCpfEmailRows.length > 0) {
                return res.status(400).json({ error: 'CPF ou e-mail já está sendo usado por outro passageiro' });
            }
            
            // Construir a consulta SQL update de forma dinâmica
            // Para incluir apenas os campos que foram fornecidos
            let updateFields = [];
            let updateParams = [];

            // Adicionar campos condicionalmente
            if (nome_completo) {
                updateFields.push('nome_completo = ?');
                updateParams.push(nome_completo);
            }
            if (cpf) {
                updateFields.push('cpf = ?');
                updateParams.push(cpf);
            }
            if (email) {
                updateFields.push('email = ?');
                updateParams.push(email);
            }
            if (senha_hash) {
                updateFields.push('senha_hash = ?');
                updateParams.push(senha_hash);
            }
            if (telefone !== undefined) {
                updateFields.push('telefone = ?');
                updateParams.push(telefone);
            }
            if (data_nascimento !== undefined) {
                updateFields.push('data_nascimento = ?');
                updateParams.push(data_nascimento);
            }
            if (logradouro) {
                updateFields.push('logradouro = ?');
                updateParams.push(logradouro);
            }
            if (numero_endereco) {
                updateFields.push('numero_endereco = ?');
                updateParams.push(numero_endereco);
            }
            if (complemento_endereco !== undefined) {
                updateFields.push('complemento_endereco = ?');
                updateParams.push(complemento_endereco);
            }
            if (bairro) {
                updateFields.push('bairro = ?');
                updateParams.push(bairro);
            }
            if (cidade) {
                updateFields.push('cidade = ?');
                updateParams.push(cidade);
            }
            if (uf) {
                updateFields.push('uf = ?');
                updateParams.push(uf);
            }
            if (cep) {
                updateFields.push('cep = ?');
                updateParams.push(cep);
            }
            if (tipo_passageiro_id !== undefined) {
                updateFields.push('tipo_passageiro_id = ?');
                updateParams.push(tipo_passageiro_id);
            }
            if (rota_id !== undefined) {
                updateFields.push('rota_id = ?');
                updateParams.push(rota_id);
            }
            if (status_pagamento_id !== undefined) {
                updateFields.push('status_pagamento_id = ?');
                updateParams.push(status_pagamento_id);
            }
            if (notificacoes_json) {
                updateFields.push('notificacoes_json = ?');
                updateParams.push(notificacoes_json);
            }
            if (configuracoes_json) {
                updateFields.push('configuracoes_json = ?');
                updateParams.push(configuracoes_json);
            }
            if (ativo !== undefined) {
                updateFields.push('ativo = ?');
                updateParams.push(ativo);
            }

            // Adicionar o ID do passageiro como último parâmetro
            updateParams.push(id);

            // Executar a atualização apenas se houver campos para atualizar
            if (updateFields.length > 0) {
                await pool.execute(
                    `UPDATE Passageiros SET ${updateFields.join(', ')} WHERE passageiro_id = ?`,
                    updateParams
                );
            }
            
            // Retornar o passageiro atualizado
            const [updatedRows] = await pool.execute(
                `SELECT passageiro_id, nome_completo, cpf, email, telefone, data_nascimento, 
                logradouro, numero_endereco, complemento_endereco, bairro, cidade, uf, cep,
                tipo_passageiro_id, rota_id, status_pagamento_id, data_criacao, data_atualizacao, ativo
                FROM Passageiros WHERE passageiro_id = ?`,
                [id]
            );
            
            res.json(updatedRows[0]);
        } catch (error) {
            console.error('Erro ao atualizar passageiro:', error);
            res.status(500).json({ error: 'Erro ao atualizar passageiro' });
        }
    });

    /**
     * @route DELETE /passengers/:id
     * @desc Exclui um passageiro
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar se o passageiro existe
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

    /**
     * @route GET /passengers/search
     * @desc Pesquisa de passageiros usando FULLTEXT search através da tabela searchIndex
     * @access Public (temporário, idealmente deveria ser Private com autenticação)
     */
    router.get('/search', async (req, res) => {
        try {
            const { query } = req.query;
            
            if (!query || query.trim() === '') {
                return res.status(400).json({ error: 'Termo de busca é obrigatório' });
            }
            
            // Usando a tabela searchIndex com FULLTEXT search
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
}