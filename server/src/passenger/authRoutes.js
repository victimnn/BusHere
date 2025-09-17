const express = require('express');
const { validateCPF, generateToken64, extractToken } = require("../helpers");
const { transformPassengerData, validatePassengerData } = require("../middleware/transformPassengerData");

// Importa o bcrypt para fazer o hash da senha
const bcrypt = require('bcrypt');
const saltRounds = 10; // quantos calculos de hash serão feitos
const bcryptSalt = bcrypt.genSaltSync(saltRounds);

// Constantes
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

module.exports = (pool) => {
  const router = express.Router();
  
  router.get('/', (req, res) => {
    res.json({ message: "Rota de Autorização de passageiros" });
  });

  router.post("/register", async (req,res) => {
    const requiredFields = ["nome_completo","cpf","email","password","logradouro","numero_endereco","bairro","cidade","uf","cep"];

    // Verifica se todos os campos obrigatórios estão presentes
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios ausentes",
        missingFields: missingFields
      });
    }

    // Valida o CPF
    if (!validateCPF(req.body.cpf)) {
      return res.status(400).json({ 
        success: false,
        error: "CPF inválido" 
      });
    }

    // Valida email
    if (!req.body.email || !/\S+@\S+\.\S+/.test(req.body.email)) {
      return res.status(400).json({ 
        success: false,
        error: "Email inválido" 
      });
    }

    // Valida a senha
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: "Senha deve ter pelo menos 6 caracteres" 
      });
    }

    // Verifica se o CPF e email já estão cadastrados
    try {
      const [existingUsers] = await pool.query("SELECT * FROM Passageiros WHERE cpf = ? OR email = ?", [req.body.cpf, req.body.email]);
      if (existingUsers.length > 0) {
        const existing = existingUsers[0];
        if (existing.cpf === req.body.cpf) {
          return res.status(400).json({ 
            success: false,
            error: "CPF já cadastrado" 
          });
        }
        if (existing.email === req.body.email) {
          return res.status(400).json({ 
            success: false,
            error: "Email já cadastrado" 
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        error: "Erro ao verificar usuário existente" 
      });
    }

    const body = req.body;
    const user = {
      passageiro_id: null, // será gerado automaticamente pelo banco
      nome_completo: body.nome_completo,
      cpf: body.cpf,
      email: body.email.toLowerCase(),
      senha_hash: bcrypt.hashSync(body.password, bcryptSalt),
      telefone: body.telefone ?? null,
      data_nascimento: body.data_nascimento ?? null,
      pcd: body.pcd ?? false,

      logradouro: body.logradouro,
      numero_endereco: body.numero_endereco,
      complemento_endereco: body.complemento_endereco ?? null,
      bairro: body.bairro,
      cidade: body.cidade,
      uf: body.uf,
      cep: body.cep,

      tipo_passageiro_id: body.tipo_passageiro_id ?? 1,

      rota_id: body.rota_id ?? null,
      ponto_id: body.ponto_id ?? null,

      notificacoes_json: body.notificacoes_json ?? "{}",
      configuracoes_json: body.configuracoes_json ?? "{}",
      data_criacao: null, // será gerado automaticamente pelo banco
      data_atualizacao: null, // será gerado automaticamente pelo banco
      ativo: body.ativo ?? true
    };

    // Insere o novo usuário no banco de dados
    try {
      const [result] = await pool.query("INSERT INTO Passageiros SET ?", user);
      
      // Preparar resposta sem dados sensíveis
      const userResponse = { ...user };
      delete userResponse.senha_hash;
      userResponse.passageiro_id = result.insertId;
      
      return res.status(201).json({ 
        success: true,
        message: "Usuário cadastrado com sucesso", 
        data: {
          userId: result.insertId,
          user: userResponse
        }
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        error: "Erro ao cadastrar usuário no banco de dados" 
      });
    }
  });

  router.post("/login", async (req,res) => {
    requiredFields = ["email", "password"];

    if (!req.body || requiredFields.some(field => !req.body[field])) {
      res.status(400).json({ 
        success: false,
        error: "Campos obrigatórios ausentes" 
      });
      return;
    }

    const { email, password } = req.body;

    try {
      const [users] = await pool.query("SELECT * FROM Passageiros WHERE email = ?", [email]);
      if (users.length === 0) {
        res.status(401).json({ 
          success: false,
          error: "Email ou senha inválidos" 
        });
        return;
      }

      const user = users[0];
      if (!bcrypt.compareSync(password, user.senha_hash)) {
        res.status(401).json({ 
          success: false,
          error: "Email ou senha inválidos" 
        });
        return;
      }

      const token = generateToken64();
      const user_id = user.passageiro_id;
      const expiration_timestamp = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
      const [tokenInsertResults] = await pool.query("INSERT INTO TokensPassageiro (passageiro_id, token, expiration_timestamp) VALUES (?, ?, ?)", [user_id, token, expiration_timestamp]);
      
      // Prepara o objeto user para a resposta (remove o hash da senha)
      const userResponse = { ...user };
      delete userResponse.senha_hash;
      userResponse.token = token;
      userResponse.token_expiration = expiration_timestamp;

      res.status(200).json({ 
        success: true,
        message: "Login realizado com sucesso", 
        user: userResponse, 
        token: token,
        data: {
          user: userResponse,
          token: token
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Erro ao realizar login" 
      });
    }
  });

  router.post('/logout', extractToken, async (req, res) => {
    const token = req.token;

    try {
      await pool.query("DELETE FROM TokensPassageiro WHERE token = ?", [token]);
      res.status(200).json({ 
        success: true,
        message: "Logout realizado com sucesso" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Erro ao realizar logout" 
      });
    }
  });

  router.get("/me", extractToken, async (req, res) => {
    const token = req.token;

    try {
      const [users] = await pool.query("SELECT * FROM Passageiros WHERE passageiro_id = (SELECT passageiro_id FROM TokensPassageiro WHERE token = ?)", [token]);
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: "Usuário não encontrado" 
        });
      }

      const user = users[0];
      delete user.senha_hash; // Remove o hash da senha antes de retornar
      res.status(200).json({ 
        success: true,
        user 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Erro ao obter informações do usuário: " + error.message 
      });
    }
  });

  router.post("/change-password", extractToken, async (req, res) => {
    const token = req.token;
    const requiredFields = ["old_password","new_password"];

    if (!req.body || requiredFields.some(field => !req.body[field])) {
      res.status(400).json({ 
        success: false,
        error: "Campos obrigatórios ausentes" 
      });
      return;
    }

    const { old_password, new_password } = req.body;

    try {
      const [users] = await pool.query("SELECT * FROM Passageiros WHERE passageiro_id = (SELECT passageiro_id FROM TokensPassageiro WHERE token = ?)", [token]);
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: "Usuário não encontrado" 
        });
      }

      const user = users[0];
      if (!bcrypt.compareSync(old_password, user.senha_hash)) {
        return res.status(401).json({ 
          success: false,
          error: "Senha antiga inválida" 
        });
      }

      const newPasswordHash = bcrypt.hashSync(new_password, 10);
      await pool.query("UPDATE Passageiros SET senha_hash = ? WHERE passageiro_id = ?", [newPasswordHash, user.passageiro_id]);
      res.status(200).json({ 
        success: true,
        message: "Senha alterada com sucesso" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Erro ao alterar senha: " + error.message 
      });
    }
  });

  return router;
};