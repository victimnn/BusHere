-- Down
DROP TABLE IF EXISTS StatusConvite;

-- Up
-- Tabela para status de convites
CREATE TABLE StatusConvite (
    status_convite_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Pendente, Aceito, Expirado, Cancelado',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

INSERT INTO StatusConvite (nome, descricao, ativo) VALUES
('Pendente', 'Convite aguardando ação do passageiro', TRUE),
('Aceito', 'Convite aceito pelo passageiro', TRUE),
('Expirado', 'Convite expirado e não mais válido', TRUE),
('Cancelado', 'Convite cancelado pelo emissor ou pelo passageiro', TRUE);