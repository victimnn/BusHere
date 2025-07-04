-- Down
DROP TABLE IF EXISTS OnibusRota;

-- Up
-- Tabela para alocação de ônibus e motorista a uma rota (programação/escala)
CREATE TABLE OnibusRota (
    onibus_rota_id INT AUTO_INCREMENT PRIMARY KEY,
    rota_id INT NOT NULL,
    onibus_id INT NOT NULL,
    motorista_id INT NOT NULL,
    data_programada DATE NOT NULL,
    horario_inicio_operacao TIME,
    horario_fim_operacao TIME,
    observacoes TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id),
    FOREIGN KEY (onibus_id) REFERENCES Onibus(onibus_id),
    FOREIGN KEY (motorista_id) REFERENCES Motoristas(motorista_id),
    UNIQUE (rota_id, onibus_id, data_programada, horario_inicio_operacao), -- Evitar duplicação na mesma data/horário

    INDEX idx_rota_id (rota_id),
    INDEX idx_onibus_id (onibus_id),
    INDEX idx_motorista_id (motorista_id)
);