-- Up
CREATE TABLE TokensPassageiro (
    token_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada token
    passageiro_id INT NOT NULL, -- ID do usuário associado ao token
    token VARCHAR(255) NOT NULL, -- O token gerado para autenticação
    creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora de criação do token
    expiration_timestamp TIMESTAMP NOT NULL DEFAULT '1970-01-01 00:00:01', -- Data e hora de expiração do token

    -- Chave estrangeira referenciando a tabela Passageiro
    FOREIGN KEY (passageiro_id) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE,

    -- Índice para buscas mais rápidas
    INDEX idx_passageiros_id (passageiro_id)
);