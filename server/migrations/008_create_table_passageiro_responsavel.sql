DROP TABLE IF EXISTS PassageiroResponsavel;
-- Up
CREATE TABLE PassageiroResponsavel (
    passageiro_menor_id INT COMMENT 'FK para o Passageiro que é menor de idade',
    passageiro_responsavel_id INT COMMENT 'FK para o Passageiro que é o responsável',
    tipo_responsabilidade_id INT COMMENT 'Ex: Pai, Mãe, Tutor Legal',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (passageiro_menor_id, passageiro_responsavel_id),
    FOREIGN KEY (passageiro_menor_id) REFERENCES Passageiro(passageiro_id) ON DELETE CASCADE,
    FOREIGN KEY (passageiro_responsavel_id) REFERENCES Passageiro(passageiro_id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_responsabilidade_id) REFERENCES TipoResponsabilidade(tipo_responsabilidade_id) ON DELETE CASCADE,

    INDEX idx_passageiro_menor (passageiro_menor_id),
    INDEX idx_passageiro_responsavel (passageiro_responsavel_id)
);