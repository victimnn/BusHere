-- Down
DROP TABLE IF EXISTS StatusMotorista;

-- Up
-- Tabela para status de motoristas
CREATE TABLE StatusMotorista (
    status_motorista_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Ativo, Férias, Afastado, Inativo',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    -- Índice para otimização de consultas
    INDEX idx_nome (nome)
);