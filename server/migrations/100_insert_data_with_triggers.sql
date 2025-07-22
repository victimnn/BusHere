-- Down
-- Esta migration contém apenas INSERTs, então o down seria DELETE
DELETE FROM Passageiros WHERE cpf IN ('24116480061', '17551394036', '01093540010');
DELETE FROM Pontos WHERE nome IN ('Terminal Central', 'Ponto Barão Geraldo', 'Ponto Taquaral', 'Ponto Shopping Dom Pedro', 'Ponto Vila Industrial');

-- Up
-- Inserts para tabelas que possuem triggers de search index
-- Mantendo a ordem: primeiro Pontos (migration 007), depois Passageiros (migration 019)

-- 5 exemplos de inserção na tabela Pontos
INSERT INTO Pontos (nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia)
VALUES
  ('Terminal Central', -22.9068, -47.0626, 'Av. Andrade Neves', '200', 'Centro', 'Campinas', 'SP', '13013-161', 'Terminal de ônibus central da cidade'),
  ('Ponto Barão Geraldo', -22.8286, -47.1067, 'Av. Santa Isabel', '1000', 'Barão Geraldo', 'Campinas', 'SP', '13084-012', 'Próximo à Unicamp'),
  ('Ponto Taquaral', -22.8672, -47.0545, 'Av. Heitor Penteado', '1500', 'Taquaral', 'Campinas', 'SP', '13076-000', 'Em frente à Lagoa do Taquaral'),
  ('Ponto Shopping Dom Pedro', -22.8526, -47.0646, 'Av. Guilherme Campos', '500', 'Jardim Santa Genebra', 'Campinas', 'SP', '13087-901', 'Entrada principal do shopping'),
  ('Ponto Vila Industrial', -22.9001, -47.0562, 'Rua Dr. Salles Oliveira', '300', 'Vila Industrial', 'Campinas', 'SP', '13035-270', 'Próximo ao Hospital Mário Gatti');

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
    uf,    cep
    -- tipo_passageiro_id, rota_id, notificacoes_json, configuracoes_json podem usar DEFAULT
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
