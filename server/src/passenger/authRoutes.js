const express = require('express');
const { validateCPF, generateToken64, extractToken } = require("../helpers");

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
    const requiredFields = ["name","cpf","email","password","address"];
    const addressRequiredFields = ["street","number","complement","neighborhood","city","state","zip"];

    // Verifica se todos os campos obrigatórios estão presentes
    const missingFields = requiredFields.filter(field => !req.body[field]);
    const missingAddressFields = addressRequiredFields.filter(field => !req.body.address || !req.body.address[field]);

    if (missingFields.length > 0 || missingAddressFields.length > 0) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes",
        missingFields: missingFields,
        missingAddressFields: missingAddressFields
      });
    }

    // Valida o CPF
    if (!validateCPF(req.body.cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    // Valida email
    if (!req.body.email || !/\S+@\S+\.\S+/.test(req.body.email)) { //Depois colocar o @shared/validators
      return res.status(400).json({ error: "Email inválido" });
    }

    // Valida a senha
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    // Verifica se o CPF ou email já estão cadastrados
    try{
      const [existingUser] = await pool.query("SELECT * FROM Passageiros WHERE cpf = ? OR email = ?", [req.body.cpf, req.body.email]);
      if (existingUser) {
        return res.status(400).json({ error: "CPF ou email já cadastrados" });
      }
    } catch {
      return res.status(500).json({ error: "Erro ao verificar usuário existente" });
    }

    const body = req.body;
    const user = {
      passageiro_id: null, // será gerado automaticamente pelo banco
      nome_completo: body.name,
      cpf: body.cpf,
      email: body.email,
      senha_hash: bcrypt.hashSync(body.password, bcryptSalt),
      telefone: body.phone ?? null,
      data_nascimento: body.birthdate ?? null,
      pcd: body.pcd ?? false,

      logradouro: body.address.street,
      numero_endereco: body.address.number,
      complemento_endereco: body.address.complement ?? null,
      bairro: body.address.neighborhood,
      cidade: body.address.city,
      uf: body.address.state,
      cep: body.address.zip,

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
      await pool.query("INSERT INTO Passageiros SET ?", user);
      return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch {
      return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
  });
  return router;
};