-- Down
DROP TABLE IF EXISTS Boletos;

-- Up
-- Tabela para boletos/faturas
CREATE TABLE Boletos (
    boleto_id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT NOT NULL,
    passageiro_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_emissao DATE DEFAULT (CURRENT_DATE),
    data_pagamento DATE,
    linha_digitavel VARCHAR(255) UNIQUE,
    codigo_barras VARCHAR(255) UNIQUE,
    url_boleto VARCHAR(512),
    mes_referencia INT,
    ano_referencia INT,
    status_boleto_id INT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (contrato_id) REFERENCES Contratos(contrato_id),
    FOREIGN KEY (passageiro_id) REFERENCES Passageiros(passageiro_id),
    FOREIGN KEY (status_boleto_id) REFERENCES StatusBoleto(status_boleto_id),

    INDEX idx_contrato_id (contrato_id),
    INDEX idx_passageiro_id (passageiro_id),
    INDEX idx_status_boleto_id (status_boleto_id),
    INDEX idx_ativo (ativo)
);