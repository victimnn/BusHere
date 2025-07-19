-- Down
DROP TABLE IF EXISTS PontosRota;

-- Up
-- Tabela associativa para pontos em uma rota (sequência)
CREATE TABLE PontosRota (
    ponto_rota_id INT AUTO_INCREMENT PRIMARY KEY,
    rota_id INT NOT NULL,
    ponto_id INT NOT NULL,
    ordem INT NOT NULL COMMENT 'Ordem do ponto na rota para sequenciamento',
    horario_previsto_passagem TIME COMMENT 'Horário previsto de passagem no ponto (pode variar por dia/viagem)',
    distancia_do_ponto_anterior_km DECIMAL(8,2),
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id) ON DELETE CASCADE,
    FOREIGN KEY (ponto_id) REFERENCES Pontos(ponto_id) ON DELETE CASCADE,
    UNIQUE (rota_id, ponto_id),
    UNIQUE (rota_id, ordem),

    INDEX idx_rota_id (rota_id),
    INDEX idx_ponto_id (ponto_id),
    INDEX idx_ordem (ordem),
    INDEX idx_horario_previsto_passagem (horario_previsto_passagem)
);