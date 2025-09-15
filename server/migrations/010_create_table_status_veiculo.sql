-- Down
DROP TABLE IF EXISTS StatusVeiculo;

-- Up
-- Tabela para status de veículos
CREATE TABLE StatusVeiculo (
    status_veiculo_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Em Operação, Em Manutenção, Inativo',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    -- Índice para otimização de consultas
    INDEX idx_nome (nome)
);

INSERT INTO StatusVeiculo (nome, descricao) VALUES
('Em Operação', 'Veículo que está em operação normal'),
('Em Manutenção', 'Veículo que está passando por manutenção'),
('Inativo', 'Veículo que não está em operação');