const express = require('express');
const { validateCPF, generateToken64, extractToken } = require("./helpers");

// Importa o bcrypt para fazer o hash da senha
const bcrypt = require('bcrypt');
const saltRounds = 10; // quantos calculos de hash serão feitos
const bcryptSalt = bcrypt.genSaltSync(saltRounds);

// Constantes
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ message: "Rota de Autorização" });
  });
  // Rota de registro de usuário
  // O usuário deve fornecer os seguintes campos:
  // nome, email, password
  // Ele retorna:
  // user_id, token, user
  router.post('/register', async (req, res) => {
    // Define os campos obrigatórios, incluindo 'password' (a senha em texto puro)
    const requiredFields = ['nome', 'email', 'password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatorio faltando: ${field}`, request: req.body });
      }
    }

    // Cria o objeto user com os dados, exceto a senha em texto puro
    const { nome, email, password } = req.body;
    const user = {
      nome,
      email
    };    // Adiciona o hash da senha - AGORA a variável 'password' (do req.body) tem garantia de existir
    const senha_hash = bcrypt.hashSync(password, bcryptSalt); // Usa a variável 'password' diretamente
    user.senha_hash = senha_hash; // Atribui o hash ao objeto user

    try {
      const [results] = await pool.query('INSERT INTO UsuariosEmpresa SET ?', user);

      // TODO: implementar tratamento de erro mais especifico
      // Adicionar tratamento para erros de duplicidade (email)
      // if (results.affectedRows === 0) { ... } // Verificar se a inserção realmente ocorreu      // Cria um token para o usuario e coloca no BD      const token = generateToken64();
      const user_id = results.insertId;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME); // 1 hora

      const [tokenInsertResults] = await pool.query('INSERT INTO TokensEmpresaLogin (usuario_empresa_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp]);

      // TODO: Considerar remover o usuário recém-criado se a inserção do token falhar
      // if (tokenInsertResults.affectedRows === 0) { ... } // Verificar se a inserção do token ocorreu

      // Busca os dados do usuário recém-criado para retornar na resposta (sem o password_hash)
      const [userFetchResults] = await pool.query('SELECT usuario_empresa_id, nome, email FROM UsuariosEmpresa WHERE usuario_empresa_id = ?', [user_id]);

      if (userFetchResults.length === 0) {
          // Não deveria acontecer se a inserção foi bem sucedida, mas é uma boa prática verificar
        return res.status(500).json({ error: 'Informações não encontradas após criação' });
      }
      const createdUser = userFetchResults[0];

      res.json({
        message: "Usuario registrado com sucesso",
        token: token,
        user_id: user_id,
        user: createdUser // Retorna os dados do usuário buscados sem o hash
      });

    } catch (error) {
      console.error('Error in register route:', error);
      // Adicionar tratamento para erros de duplicidade (email)
      if (error.code === 'ER_DUP_ENTRY') {
        let field = 'unknown';
        if (error.message.includes('email')) field = 'email';
        return res.status(409).json({ error: `${field} Já registrado` }); // 409 Conflict
      }
      return res.status(500).json({ error: 'Erro inserindo Usuario ou Token' });
    }
  });
  // Rota de login
  // O usuário deve fornecer os seguintes campos:
  // email, password
  // Ele retorna:
  // user_id, token, user
  router.post('/login', async (req, res) => {
    const requiredFields = ['email', 'password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatorio faltando: ${field}`, request: req.body });
      }
    }
    const { email, password } = req.body;

    try {
      // Busca o usuário pelo email
      const [userResults] = await pool.query('SELECT * FROM UsuariosEmpresa WHERE email = ?', [email]);

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'Usuario não encontrado' });
      }
      const user = userResults[0];      console.log("debig",user, email, password);
      // Verifica se a senha está correta
      if (!bcrypt.compareSync(password, user.senha_hash)) {
        return res.status(401).json({ error: 'Senha invalida' });
      }      // Cria um token para o usuario e coloca no BD
      const token = generateToken64();
      const user_id = user.usuario_empresa_id;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
      const [tokenInsertResults] = await pool.query('INSERT INTO TokensEmpresaLogin (usuario_empresa_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp]);

      // Prepara o objeto user para a resposta (remove o hash da senha)
      const userResponse = { ...user };
      delete userResponse.senha_hash;

      res.json({
        message: "Usuario logado com sucesso",
        token: token,
        user_id: user.usuario_empresa_id,
        user: userResponse
      });

    } catch (error) {
      console.error('Erro na rota de Login', error);
      res.status(500).json({ error: 'Um erro interno aconteceu' });
    }
  });

  // Rota de logout
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // message
  // O token é deletado do banco de dados
  router.post('/logout', extractToken, async (req, res) => {
    const token = req.token;    try{
      const [tokenResults] = await pool.query('DELETE FROM TokensEmpresaLogin WHERE token = ?', [token]);

      if (tokenResults.affectedRows === 0) {
        return res.status(401).json({ error: 'Token not found' });
      }
      res.json({ message: 'Usuario Deslogado' });
    } catch (error) {
      console.error('Erro na rota de Log-out', error);
      return res.status(500).json({ error: "Um erro interno aconteceu" });
    }
  });
  // Rota de verificação do usuario (ver se o token é valido)
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // user 
  router.get("/me", extractToken, async (req, res) => {
    const token = req.token;

    try {      // Verifica se o token existe no banco de dados
      const [tokenResults] = await pool.query('SELECT * FROM TokensEmpresaLogin WHERE token = ?', [token]);

      if (tokenResults.length === 0) {
        return res.status(404).json({ error: 'Token não encontrado ou expirado' });
      }      // Se o token existe, pega o user_id e busca o usuario no banco de dados
      const user_id = tokenResults[0].usuario_empresa_id;
      const [userResults] = await pool.query('SELECT * FROM UsuariosEmpresa WHERE usuario_empresa_id = ?', [user_id]);

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User associated with token not found' });
      }      const user = userResults[0];
      delete user.senha_hash; // Remove o hash da senha do objeto antes de enviar para o cliente

      res.json({ 
        success: true,
        user: user
      }); // retorna o usuario

    } catch (error) {
      console.error('Error in /me route:', error);
      res.status(500).json({ error: "Um erro interno aconteceu" });
    }
  });
  // Rota de mudança de senha
  // O usuário deve fornecer o token no cabeçalho Authorization
  // E os seguintes campos:
  // old_password, new_password
  // Ele retorna:
  // message
  router.post("/change-password", extractToken, async (req, res) => {
    const token = req.token;
    const requiredFields = ['old_password', 'new_password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Campo obrigatorio faltando: ${field}`, request: req.body });
      }
    }

    const { old_password, new_password } = req.body;    try { 
      // Verifica se o token existe no banco de dados
      const [tokenResults] = await pool.query('SELECT * FROM TokensEmpresaLogin WHERE token = ?', [token]);      if (tokenResults.length === 0) {
        return res.status(404).json({ error: 'Token não encontrado ou expirado' });
      }
      const { usuario_empresa_id } = tokenResults[0]; 

      // Verifica se o usuario existe usando o user_id CORRETO
      const [userResults] = await pool.query("SELECT * FROM UsuariosEmpresa WHERE usuario_empresa_id = ?", [usuario_empresa_id]);

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User associated with token not found' });
      }
      const user = userResults[0];

      // Verifica se a senha antiga está correta
      if (!bcrypt.compareSync(old_password, user.senha_hash)) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Faz o hash da nova senha
      const new_senha_hash = bcrypt.hashSync(new_password, bcryptSalt);

      // Atualiza a senha no banco de dados
      const [updateResults] = await pool.query("UPDATE UsuariosEmpresa SET senha_hash = ? WHERE usuario_empresa_id = ?", [new_senha_hash, usuario_empresa_id]);

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario não encontrado for update' });
      }

      // Se tudo deu certo, retorna a mensagem de sucesso
      res.json({ message: 'Password changed successfully' });

    } catch (error) {
      console.error('Error in change password route:', error);
      res.status(500).json({ error: "Um erro interno aconteceu" });
    }
  });


  router.get('/:id', (req, res) => {

  });

  return router;
}
