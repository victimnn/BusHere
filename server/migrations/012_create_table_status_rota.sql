-- Down
DROP TABLE IF EXISTS StatusRota;

-- Up
-- Tabela para status de rotas
CREATE TABLE StatusRota (
    status_rota_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Ativa, Inativa, Em Planejamento',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_status_rota_nome (nome)
);