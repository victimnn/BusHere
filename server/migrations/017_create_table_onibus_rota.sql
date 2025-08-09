-- Down
DROP TABLE IF EXISTS OnibusRota;

-- Up
-- Tabela para alocação de ônibus e motorista a uma rota (programação/escala)
CREATE TABLE OnibusRota (
    onibus_rota_id INT AUTO_INCREMENT PRIMARY KEY,
    rota_id INT NOT NULL,
    onibus_id INT NOT NULL,
    motorista_id INT NOT NULL,
    observacoes TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id) ON DELETE CASCADE,
    FOREIGN KEY (onibus_id) REFERENCES Onibus(onibus_id) ON DELETE CASCADE,
    FOREIGN KEY (motorista_id) REFERENCES Motoristas(motorista_id) ON DELETE CASCADE,

    INDEX idx_rota_id (rota_id),
    INDEX idx_onibus_id (onibus_id),
    INDEX idx_motorista_id (motorista_id)
);