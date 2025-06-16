-- Inserindo dados de exemplo na tabela Passageiros
INSERT INTO Passageiros (
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
    notificacoes_json,
    configuracoes_json
) VALUES (
    'Victor Gabriel Prado Ramos',
    '24116480061',
    'victor.ramos@bushere.com',
    'hashed_password_abc123',
    '19999990001',
    '2008-06-19',
    'Rua das Palmeiras',
    '123',
    'Apto 10A',
    'Centro',
    'Jaguariúna',
    'SP',
    '13900000',
    '{"email_enabled": true, "sms_enabled": true, "push_enabled": false}',
    '{"theme": "dark", "language": "pt-BR", "font_size": "medium"}'
);

INSERT INTO Passageiros (
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
    notificacoes_json,
    configuracoes_json
) VALUES (
    'Leticia Aparecida Moraes Fructoso',
    '17551394036',
    'llett.moraes@euteamo.com',
    'hashed_password_xyz456',
    '19988880002',
    '1985-11-20',
    'Avenida Brasil',
    '789',
    NULL, -- Complemento opcional
    'Jardim das Flores',
    'Jaguariúna',
    'SP',
    '13910000',
    '{"email_enabled": true, "sms_enabled": false, "push_enabled": true}',
    '{"theme": "light", "language": "pt-BR", "font_size": "small"}'
);

INSERT INTO Passageiros (
    nome_completo,
    cpf,
    email,
    senha_hash,
    telefone,
    data_nascimento,
    logradouro,
    numero_endereco,
    bairro,
    cidade,
    uf,
    cep
    -- tipo_passageiro_id, rota_id, status_pagamento_id, notificacoes_json, configuracoes_json podem usar DEFAULT
) VALUES (
    'Rubens Castaldelli Carlos',
    '01093540010',
    'rubao@palmeiras.com',
    'hashed_password_123xyz',
    '19977770003',
    '2000-01-30',
    'Praça da Sé',
    'S/N', -- Sem número
    'Centro Histórico',
    'Pedreira',
    'SP',
    '13920000'
);