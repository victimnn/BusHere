-- Down
DROP TABLE IF EXISTS Pontos;

-- Up
-- Tabela para pontos de parada
CREATE TABLE Pontos (
    ponto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_ponto VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    logradouro VARCHAR(255),
    numero_endereco VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep VARCHAR(9),
    referencia TEXT COMMENT 'Ponto de referência ou descrição adicional',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_ponto_nome (nome_ponto),
    INDEX idx_ponto_localizacao (latitude, longitude)
);