// Middleware para transformar dados do frontend para o formato esperado pelo backend
const { validateCPF } = require("../helpers");

// Função para remover formatação de strings (CPF, telefone, CEP)
const removeFormatting = (str) => {
  if (!str) return str;
  return str.toString().replace(/\D/g, '');
};

// Função para validar CEP
const validateCEP = (cep) => {
  if (!cep) return false;
  const cleanCEP = removeFormatting(cep);
  return cleanCEP.length === 8 && /^\d{8}$/.test(cleanCEP);
};

// Função para validar email
const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Middleware principal de transformação
const transformPassengerData = (req, res, next) => {
  try {
    const body = req.body;
    
    // Se os dados já estão no formato do backend, pula a transformação
    if (body.nome_completo && !body.name) {
      return next();
    }

    // Criar novo objeto com campos transformados
    const transformedBody = {};

    // Mapeamento de campos básicos
    if (body.name) {
      transformedBody.nome_completo = body.name.trim();
    }
    
    if (body.cpf) {
      const cleanCPF = removeFormatting(body.cpf);
      transformedBody.cpf = cleanCPF;
    }
    
    if (body.email) {
      transformedBody.email = body.email.trim().toLowerCase();
    }
    
    if (body.password) {
      transformedBody.password = body.password;
    }
    
    if (body.phone) {
      const cleanPhone = removeFormatting(body.phone);
      transformedBody.telefone = cleanPhone;
    }
    
    if (body.birth_date) {
      transformedBody.data_nascimento = body.birth_date;
    }

    // Campos opcionais
    if (body.pcd !== undefined) {
      transformedBody.pcd = Boolean(body.pcd);
    }

    // Transformação do endereço (objeto aninhado → campos planos)
    if (body.address && typeof body.address === 'object') {
      const address = body.address;
      
      if (address.street) {
        transformedBody.logradouro = address.street.trim();
      }
      
      if (address.number) {
        transformedBody.numero_endereco = address.number.toString().trim();
      }
      
      if (address.complement) {
        transformedBody.complemento_endereco = address.complement.trim() || null;
      }
      
      if (address.neighborhood) {
        transformedBody.bairro = address.neighborhood.trim();
      }
      
      if (address.city) {
        transformedBody.cidade = address.city.trim();
      }
      
      if (address.state) {
        transformedBody.uf = address.state.toString().toUpperCase();
      }
      
      if (address.zip) {
        const cleanZip = removeFormatting(address.zip);
        transformedBody.cep = cleanZip;
      }
    }

    // Manter campos originais e adicionar os transformados
    req.body = {
      ...body,
      ...transformedBody
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de transformação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor na transformação de dados'
    });
  }
};

// Middleware de validação robusta
const validatePassengerData = (req, res, next) => {
  try {
    const body = req.body;
    const errors = [];

    // Validações obrigatórias
    if (!body.nome_completo || body.nome_completo.trim().length < 2) {
      errors.push('Nome completo é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!body.cpf) {
      errors.push('CPF é obrigatório');
    } else if (!validateCPF(body.cpf)) {
      errors.push('CPF inválido');
    }

    if (!body.email) {
      errors.push('E-mail é obrigatório');
    } else if (!validateEmail(body.email)) {
      errors.push('E-mail inválido');
    }

    if (!body.password) {
      errors.push('Senha é obrigatória');
    } else if (body.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!body.telefone) {
      errors.push('Telefone é obrigatório');
    } else {
      const cleanPhone = removeFormatting(body.telefone);
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        errors.push('Telefone deve ter 10 ou 11 dígitos');
      }
    }

    // Validações de endereço
    if (!body.logradouro || body.logradouro.trim().length < 3) {
      errors.push('Logradouro é obrigatório e deve ter pelo menos 3 caracteres');
    }

    if (!body.numero_endereco || body.numero_endereco.trim().length === 0) {
      errors.push('Número do endereço é obrigatório');
    }

    if (!body.bairro || body.bairro.trim().length < 2) {
      errors.push('Bairro é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!body.cidade || body.cidade.trim().length < 2) {
      errors.push('Cidade é obrigatória e deve ter pelo menos 2 caracteres');
    }

    if (!body.uf || body.uf.length !== 2) {
      errors.push('Estado (UF) é obrigatório e deve ter 2 caracteres');
    }

    if (!body.cep) {
      errors.push('CEP é obrigatório');
    } else if (!validateCEP(body.cep)) {
      errors.push('CEP inválido');
    }

    // Se há erros, retornar resposta padronizada
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de validação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor na validação de dados'
    });
  }
};

module.exports = {
  transformPassengerData,
  validatePassengerData,
  removeFormatting,
  validateCEP,
  validateEmail
};