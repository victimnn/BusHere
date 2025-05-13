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
    res.json({ message: "Auth route" });
  });

  // Rota de registro de usuário
  // O usuário deve fornecer os seguintes campos:
  // full_name, cpf, email, password_hash, address_street, address_number, address_complement, address_city, cep
  // Ele retorna:
  // user_id, token, user
  router.post('/register', async (req, res) => {
    // Define os campos obrigatórios, incluindo 'password' (a senha em texto puro)
    const requiredFields = ['full_name', 'cpf', 'email', 'password', 'address_street', 'address_number', 'address_city', 'cep'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}`, request: req.body });
      }
    }


    // Cria o objeto user com os dados, exceto a senha em texto puro
    const { full_name, cpf, email, password, address_street, address_number, address_complement, address_city, cep } = req.body;
    const user = {
      full_name,
      cpf,
      email,
      address_street,
      address_number,
      address_complement,
      address_city,
      cep
    };

    // Adiciona o hash da senha - AGORA a variável 'password' (do req.body) tem garantia de existir
    const password_hash = bcrypt.hashSync(password, bcryptSalt); // Usa a variável 'password' diretamente
    user.password_hash = password_hash; // Atribui o hash ao objeto user

    // Verifica se o CPF é do tamanho certo e se é valido (usando a formula do CPF)
    if (!validateCPF(user.cpf)) {
      //return res.status(400).json({ error: 'Invalid CPF' });
    }

    try {
      const [results] = await pool.query('INSERT INTO Users SET ?', user);

      // TODO: implementar tratamento de erro mais especifico
      // Adicionar tratamento para erros de duplicidade (email, cpf)
      // if (results.affectedRows === 0) { ... } // Verificar se a inserção realmente ocorreu

      // Cria um token para o usuario e coloca no BD
      const token = generateToken64();
      const user_id = results.insertId;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME); // 1 hora

      const [tokenInsertResults] = await pool.query('INSERT INTO TokensLogin (user_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp]);

      // TODO: Considerar remover o usuário recém-criado se a inserção do token falhar
      // if (tokenInsertResults.affectedRows === 0) { ... } // Verificar se a inserção do token ocorreu

      // Busca os dados do usuário recém-criado para retornar na resposta (sem o password_hash)
      const [userFetchResults] = await pool.query('SELECT user_id, full_name, cpf, email, address_street, address_number, address_complement, address_city, cep FROM Users WHERE user_id = ?', [user_id]);

      if (userFetchResults.length === 0) {
          // Não deveria acontecer se a inserção foi bem sucedida, mas é uma boa prática verificar
        return res.status(500).json({ error: 'User data not found after creation' });
      }
      const createdUser = userFetchResults[0];

      res.json({
        message: "User registered successfully",
        token: token,
        user_id: user_id,
        user: createdUser // Retorna os dados do usuário buscados sem o hash
      });

    } catch (error) {
      console.error('Error in register route:', error);
        // Adicionar tratamento para erros de duplicidade (email, cpf)
        if (error.code === 'ER_DUP_ENTRY') {
          let field = 'unknown';
          if (error.message.includes('cpf')) field = 'CPF';
          else if (error.message.includes('email')) field = 'email';
          return res.status(409).json({ error: `${field} already registered` }); // 409 Conflict
        }
      return res.status(500).json({ error: 'Error inserting user or token' });
    }
  });

  // Rota de login
  // O usuário deve fornecer os seguintes campos:
  // email, password
  // Ele retorna:
  // user_id, token, user
  // Rota de login
  // O usuário deve fornecer os seguintes campos:
  // email, password
  // Ele retorna:
  // user_id, token, user
  // Refatorado para usar async/await
  router.post('/login', async (req, res) => { // Marca a função como assíncrona

    const requiredFields = ['email', 'password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}`, request: req.body });
      }
    }

    const { email, password } = req.body;
    // Removida a criação do objeto user com password_hash aqui

    try { // Usa try...catch para lidar com erros assíncronos

      // Removido o hash da senha aqui, pois o login compara a senha em texto puro com o hash armazenado

      // Busca o usuário pelo email
      const [userResults] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]); // Usa await

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User not found' }); // Ou 'Invalid credentials' por segurança
      }
      const user = userResults[0];

      // Verifica se a senha está correta
      // O bcrypt.compareSync compara a senha em texto claro com o hash, é essencial pois
      // o hash é gerado de forma diferente a cada vez
      if (!bcrypt.compareSync(password, user.password_hash)) { // Usa a senha em texto puro e o hash do DB
        return res.status(401).json({ error: 'Invalid password' }); // Ou 'Invalid credentials' por segurança
      }

      // Cria um token para o usuario e coloca no BD
      const token = generateToken64();
      const user_id = user.user_id;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
      const [tokenInsertResults] = await pool.query('INSERT INTO TokensLogin (user_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp]); // Usa await

      // Prepara o objeto user para a resposta (remove o hash da senha)
      const userResponse = { ...user }; // Cria uma cópia
      delete userResponse.password_hash;

      res.json({
        message: "User logged in successfully",
        token: token,
        user_id: user.user_id,
        user: userResponse // Retorna o objeto sem o hash
      });

    } catch (error) {
      console.error('Error in login route:', error); // Log do erro
      res.status(500).json({ error: 'An internal server error occurred' }); // Retorna erro genérico
    }
  });


  // Rota de logout
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // message
  // O token é deletado do banco de dados
  router.post('/logout', extractToken, async (req, res) => {
    const token = req.token;

    try{
      const [tokenResults] = await pool.query('DELETE FROM TokensLogin WHERE token = ?', [token]);

      if (tokenResults.affectedRows === 0) {
        return res.status(401).json({ error: 'Token not found' });
      }
      res.json({ message: 'User logged out successfully' });
    } catch (error) {
      console.error('Error in logout route:', error); // Log do erro
      return res.status(500).json({ error: 'An internal server error occurred' }); // Retorna erro genérico
    }
  });

  // Rota de verificação do usuario (ver se o token é valido)
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // user 
  router.get("/me", extractToken, async (req, res) => { // Marca a função como assíncrona
    const token = req.token;

    try { 
      // Verifica se o token existe no banco de dados
      const [tokenResults] = await pool.query('SELECT * FROM TokensLogin WHERE token = ?', [token]);

      if (tokenResults.length === 0) {
        return res.status(404).json({ error: 'Token not found or expired' }); // Mensagem mais informativa
      }

      // Se o token existe, pega o user_id e busca o usuario no banco de dados
      const user_id = tokenResults[0].user_id;
      const [userResults] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [user_id]);

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User associated with token not found' });
      }
      const user = userResults[0];
      delete user.password_hash; // Remove o hash da senha do objeto antes de enviar para o cliente

      res.json(user); // retorna o usuario

    } catch (error) {
      console.error('Error in /me route:', error); // Log do erro para debug
      res.status(500).json({ error: 'An internal server error occurred' }); // Retorna um erro genérico
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
        return res.status(400).json({ error: `Missing required field: ${field}`, request: req.body });
      }
    }

    const { old_password, new_password } = req.body;
    try { 
      // Usa try...catch para lidar com erros assíncronos (como erros de DB)
      // Verifica se o token existe no banco de dados
      const [tokenResults] = await pool.query('SELECT * FROM TokensLogin WHERE token = ?', [token]);

      if (tokenResults.length === 0) {
        return res.status(404).json({ error: 'Token not found or expired' });
      }
      const { user_id } = tokenResults[0]; 

      // Verifica se o usuario existe usando o user_id CORRETO
      const [userResults] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);

      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User associated with token not found' });
      }
      const user = userResults[0]; // Pega o objeto do usuário

      // Verifica se a senha antiga está correta
      // bcrypt.compareSync é síncrono, então não precisa de await
      if (!bcrypt.compareSync(old_password, user.password_hash)) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Faz o hash da nova senha (síncrono)
      const new_password_hash = bcrypt.hashSync(new_password, bcryptSalt);

      // Atualiza a senha no banco de dados
      const [updateResults] = await pool.query("UPDATE Users SET password_hash = ? WHERE user_id = ?", [new_password_hash, user_id]);

      if (updateResults.affectedRows === 0) {
        // Isso não deveria acontecer se o user_id foi encontrado na busca anterior,
        // mas é uma verificação de segurança.
        return res.status(404).json({ error: 'User not found for update' });
      }

      // Se tudo deu certo, retorna a mensagem de sucesso
      res.json({ message: 'Password changed successfully' });

    } catch (error) {
      // Captura qualquer erro que ocorra nas operações assíncronas (consultas ao DB)
      console.error('Error in change password route:', error); // Log do erro para debug
      res.status(500).json({ error: 'An internal server error occurred' }); // Retorna um erro genérico para o cliente
    }
  });


  router.get('/:id', (req, res) => {

  });

  return router;
}
