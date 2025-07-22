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
    ponto_id INT, -- Referente a id_ponto_passageiro
    notificacoes_json JSON DEFAULT '{}',
    configuracoes_json JSON DEFAULT '{}',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (tipo_passageiro_id) REFERENCES TipoPassageiro(tipo_passageiro_id),
    FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id),
    FOREIGN KEY (ponto_id) REFERENCES Pontos(ponto_id),

    INDEX idx_passageiros_cpf (cpf), -- It's often good practice to index UNIQUE columns too
    INDEX idx_passageiros_email (email),
    INDEX idx_passageiros_tipo (tipo_passageiro_id),
    INDEX idx_passageiros_ativo (ativo)
);