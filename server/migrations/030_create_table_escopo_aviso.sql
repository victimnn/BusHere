-- Down
DROP TABLE IF EXISTS EscoposAviso;

-- Up
-- Tabela para escopo de avisos
CREATE TABLE EscoposAviso (
    escopo_aviso_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_escopo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome_escopo (nome_escopo),
    INDEX idx_ativo (ativo)
);

INSERT INTO EscoposAviso (nome_escopo, descricao, ativo) VALUES
('Geral', 'Avisos que se aplicam a todos os usuários da plataforma', TRUE),
('Por Rota', 'Avisos específicos para uma rota de transporte', TRUE),
('Por Tipo de Passageiro', 'Avisos direcionados a um tipo específico de passageiro', TRUE),
('Passageiro Específico', 'Avisos direcionados a um passageiro específico', TRUE);