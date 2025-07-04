-- Down
DROP TABLE IF EXISTS Contratos;

-- Up
-- Tabela para contratos dos passageiros
CREATE TABLE Contratos (
    contrato_id INT AUTO_INCREMENT PRIMARY KEY,
    passageiro_id INT NOT NULL COMMENT 'Chave estrangeira para Passageiro',
    numero_contrato VARCHAR(50) UNIQUE COMMENT 'Número de identificação do contrato',
    data_inicio DATE,
    data_fim DATE,
    data_assinatura DATE,
    dia_vencimento_mensalidade INT COMMENT 'Dia do mês para vencimento da fatura',
    termos_condicoes TEXT COMMENT 'Armazena o texto do contrato ou link para modelo',
    valor_mensal DECIMAL(10,2),
    status_contrato_id INT COMMENT 'Chave estrangeira para StatusContrato',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (passageiro_id) REFERENCES Passageiros(passageiro_id),
    FOREIGN KEY (status_contrato_id) REFERENCES StatusContrato(status_contrato_id),

    INDEX idx_passageiro_id (passageiro_id),
    INDEX idx_status_contrato_id (status_contrato_id)
);