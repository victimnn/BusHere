-- Down
DROP TABLE IF EXISTS LogLocalizacaoOnibus;

-- Up
-- Tabela para log de localização dos veículos
CREATE TABLE LogLocalizacaoOnibus (
    log_localizacao_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    onibus_id INT NOT NULL,
    timestamp_gps DATETIME NOT NULL COMMENT 'Data e hora da medição do GPS',
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    velocidade DECIMAL(5,2) COMMENT 'Velocidade em km/h, se disponível',
    timestamp_recebimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Quando o sistema recebeu este dado',
    FOREIGN KEY (onibus_id) REFERENCES Onibus(onibus_id) ON DELETE CASCADE


) COMMENT 'Log de localizações recebidas do sistema de rastreamento GPS [cite: 2, 33]';
