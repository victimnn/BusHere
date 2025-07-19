-- Down
DROP TABLE IF EXISTS StatusContrato;

-- Up
-- Tabela para status de contrato
CREATE TABLE StatusContrato (
    status_contrato_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Ativo, Inativo, Pendente Assinatura, Cancelado',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

INSERT INTO StatusContrato (nome, descricao, ativo) VALUES
('Ativo', 'Contrato ativo e em vigor', TRUE),
('Inativo', 'Contrato inativo ou suspenso', TRUE),
('Pendente Assinatura', 'Contrato aguardando assinatura do passageiro', TRUE),
('Cancelado', 'Contrato cancelado pelo passageiro ou pela empresa', TRUE);