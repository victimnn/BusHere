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
  router.post('/register', (req, res) => {
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

    pool.query('INSERT INTO Users SET ?', user, (error, results) => {
      if (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ error: 'Error inserting user' });
        // TODO: implementar tratamento de erro mais especifico
      }

      // Cria um token para o usuario e coloca no BD
      const token = generateToken64();
      const user_id = results.insertId;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME); // 1 hora
      pool.query('INSERT INTO TokensLogin (user_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp], (error, results) => {
        if (error) {
          console.error('Error inserting token:', error);
          return res.status(500).json({ error: 'Error inserting token' });
        }
      });

      res.json({ 
        message: "User registered successfully", 
        token: token,
        user_id: results.insertId, 
        user: user 
      });
    });


  });

  // Rota de login
  // O usuário deve fornecer os seguintes campos:
  // email, password
  // Ele retorna:
  // user_id, token, user
  router.post('/login', (req, res) => {

    const requiredFields = ['email', 'password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}`, request: req.body });
      }
    }

    const { email, password } = req.body;
    const user = {
      email,
      password
    };

    // Adiciona o hash da senha
    user.password_hash = bcrypt.hashSync(user.password, bcryptSalt);

    pool.query('SELECT * FROM Users WHERE email = ?', [user.email], (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Error fetching user' });
      };
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = results[0];

      // Verifica se a senha está correta
      // O bcrypt.compareSync compara a senha em texto claro com o hash, é essencial pois
      // o hash é gerado de forma diferente a cada vez
      if (!bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Cria um token para o usuario e coloca no BD
      const token = generateToken64();
      const user_id = user.user_id;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME); 
      pool.query('INSERT INTO TokensLogin (user_id, token, expiration_timestamp) VALUES (?, ?, ?)', [user_id, token, expiration_timestamp], (error, results) => {
        if (error) {
          console.error('Error inserting token:', error);
          return res.status(500).json({ error: 'Error inserting token' });
        }
        res.json({ 
          message: "User logged in successfully", 
          token: token,
          user_id: user.user_id, 
          user: user 
        });
      });
    });
  });

  // Rota de logout
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // message
  // O token é deletado do banco de dados
  router.post('/logout', extractToken, (req, res) => {
    const token = req.token

    if (!token){
      return res.status(401).json({ error: 'Token not provided' });
    }

    pool.query('DELETE FROM TokensLogin WHERE token = ?', [token], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error deleting token' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Token not found' });
      }
      res.json({ message: 'User logged out successfully' });
    });
  });

  // Rota de verificação do usuario (ver se o token é valido)
  // O usuário deve fornecer o token no cabeçalho Authorization
  // Ele retorna:
  // user 
  router.get("/me", extractToken, (req, res) => {
    const token = req.token;

    if (!token){
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Verifica se o token existe no banco de dados
    pool.query('SELECT * FROM TokensLogin WHERE token = ?', [token], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching token' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Token not found' });
      }

      // Se o token existe, pega o user_id e busca o usuario no banco de dados
      const user_id = results[0].user_id;
      pool.query('SELECT * FROM Users WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error fetching user' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = results[0];
        delete user.password_hash; // Remove o hash da senha do objeto antes de enviar para o cliente

        res.json(user); // retorna o usuario
      });
    });
  });

  // Rota de mudança de senha
  // O usuário deve fornecer o token no cabeçalho Authorization
  // E os seguintes campos:
  // old_password, new_password
  // Ele retorna:
  // message
  router.post("/change-password", extractToken, (req, res) => {
    const token = req.token;
    const requiredFields = ['old_password', 'new_password'];

    // Passa por cada um dos campos obrigatórios e verifica se existe ANTES de qualquer operação com eles
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}`, request: req.body });
      }
    }

    const { old_password, new_password } = req.body;

    if (!token){
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Verifica se o token existe no banco de dados
    pool.query('SELECT * FROM TokensLogin WHERE token = ?', [token], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching token' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Token not found' });
      }
      const { user_id } = results[0];

      // Verifica se o usuario existe
      pool.query("SELECT * FROM Users WHERE user_id = ?", [user_id], (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error fetching user' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = results[0];

        // Verifica se a senha antiga está correta
        if (!bcrypt.compareSync(old_password, user.password_hash)) {
          return res.status(401).json({ error: 'Wrong old password' });
        }

        // Faz o hash da nova senha
        const new_password_hash = bcrypt.hashSync(new_password, bcryptSalt);

        // Atualiza a senha no banco de dados
        pool.query("UPDATE Users SET password_hash = ? WHERE user_id = ?", [new_password_hash, user_id], (error, results) => {
          if (error) {
            return res.status(500).json({ error: 'Error updating password' });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.json({ message: 'Password changed successfully' });
        });
      });
    });

  });


  router.get('/:id', (req, res) => {

  });

  return router;
}
