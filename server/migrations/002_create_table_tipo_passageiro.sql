-- Down
DROP TABLE IF EXISTS TipoPassageiro;

-- Up

CREATE TABLE TipoPassageiro (
    tipo_passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_tipo_passsageiro_ativo (ativo)
);