-- Down
DROP TABLE IF EXISTS Veiculos;

-- Up
-- Tabela para veículos
CREATE TABLE Veiculos (
    veiculo_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE COMMENT 'Código interno ou apelido do veículo',
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(100),
    marca VARCHAR(100),
    ano_fabricacao INT,
    capacidade INT,
    quilometragem DECIMAL(10,2),
    data_ultima_manutencao DATE,
    data_proxima_manutencao DATE,
    tipo_veiculo_id INT,
    status_veiculo_id INT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tipo_veiculo_id) REFERENCES TipoVeiculo(tipo_veiculo_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (status_veiculo_id) REFERENCES StatusVeiculo(status_veiculo_id) ON DELETE SET NULL ON UPDATE CASCADE,

    -- Índices para otimização de consultas
    INDEX idx_placa (placa),
    INDEX idx_nome (nome)
);