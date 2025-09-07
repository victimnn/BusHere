-- Down
DROP TABLE IF EXISTS TipoVeiculo;

-- Up
-- Tabela para tipos de veículos
CREATE TABLE TipoVeiculo (
    tipo_veiculo_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: Ônibus, Micro-ônibus, Van, Caminhão',
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    -- Índice para otimização de consultas
    INDEX idx_nome (nome)
);

INSERT INTO TipoVeiculo (nome, descricao) VALUES
('Ônibus', 'Veículo de transporte coletivo com capacidade para 40+ passageiros'),
('Micro-ônibus', 'Veículo de transporte coletivo com capacidade para 15-30 passageiros'),
('Van', 'Veículo de transporte coletivo com capacidade para 8-15 passageiros');
