-- Down
DROP TABLE IF EXISTS Rotas;

-- Up
-- Tabela para rotas
CREATE TABLE Rotas (
    rota_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_rota VARCHAR(20) UNIQUE COMMENT 'Código identificador da rota',
    nome VARCHAR(255) NOT NULL COMMENT 'Nome descritivo da rota',
    descricao TEXT,
    origem_descricao VARCHAR(255) COMMENT 'Descrição da origem',
    destino_descricao VARCHAR(255) COMMENT 'Descrição do destino',
    distancia_km DECIMAL(10,2) COMMENT 'Distância estimada da rota em km',
    tempo_viagem_estimado_minutos INT COMMENT 'Tempo estimado de viagem em minutos',
    status_rota_id INT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (status_rota_id) REFERENCES StatusRota(status_rota_id),

    INDEX idx_rota_codigo (codigo_rota),
    INDEX idx_rota_nome (nome)
);