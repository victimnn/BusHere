-- Down
DROP TABLE IF EXISTS Passageiros;

-- Up
CREATE TABLE Passageiros (
    passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(11),
    data_nascimento DATE,
    pcd BOOLEAN DEFAULT FALSE, -- Pessoa com Deficiência
    logradouro VARCHAR(255) NOT NULL,
    numero_endereco VARCHAR(20) NOT NULL, -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(20) do DER
    complemento_endereco VARCHAR(100), -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(100) do DER
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL, -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(100) do DER
    uf CHAR(2) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    tipo_passageiro_id INT DEFAULT 1, -- Referente a tipo_passageiro_id no DER, assumindo que 1 é o padrão
    rota_id INT, -- Referente a id_rota_passageiro
    status_pagamento_id INT,
    notificacoes_json JSON DEFAULT '{}',
    configuracoes_json JSON DEFAULT '{}',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (tipo_passageiro_id) REFERENCES TipoPassageiro(tipo_passageiro_id),
 -- FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id), -- Supondo que exista uma tabela Rotas

    INDEX idx_passageiros_cpf (cpf), -- It's often good practice to index UNIQUE columns too
    INDEX idx_passageiros_email (email),
    INDEX idx_passageiros_tipo (tipo_passageiro_id),
    INDEX idx_passageiros_ativo (ativo)
);

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