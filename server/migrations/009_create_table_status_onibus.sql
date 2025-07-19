-- Down
DROP TABLE IF EXISTS StatusOnibus;

-- Up
-- Tabela para status de ônibus
CREATE TABLE StatusOnibus (
    status_onibus_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Em Operação, Em Manutenção, Inativo',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    -- Índice para otimização de consultas
    INDEX idx_nome (nome)
);

INSERT INTO StatusOnibus (nome, descricao) VALUES
('Em Operação', 'Ônibus que está em operação normal'),
('Em Manutenção', 'Ônibus que está passando por manutenção'),
('Inativo', 'Ônibus que não está em operação');