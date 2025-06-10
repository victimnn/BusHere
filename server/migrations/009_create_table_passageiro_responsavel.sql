-- Down
DROP TABLE IF EXISTS PassageiroResponsaveis;

-- Up
CREATE TABLE PassageiroResponsaveis (
    passageiro_menor_id INT,
    passageiro_responsavel_id INT,
    tipo_responsabilidade_id INT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (passageiro_menor_id, passageiro_responsavel_id),
    FOREIGN KEY (passageiro_menor_id) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE,
    FOREIGN KEY (passageiro_responsavel_id) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_responsabilidade_id) REFERENCES TipoResponsabilidade(tipo_responsabilidade_id) ON DELETE CASCADE,

    INDEX idx_passageiro_responsavel (passageiro_responsavel_id)
);