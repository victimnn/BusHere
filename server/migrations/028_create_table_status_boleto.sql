-- Down
DROP TABLE IF EXISTS StatusBoleto;

-- Up
-- Tabela para status de boletos/faturas
CREATE TABLE StatusBoleto (
    status_boleto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

INSERT INTO StatusBoleto (nome, descricao, ativo) VALUES
('Gerado', 'Boleto gerado e disponível para pagamento', TRUE),
('Enviado', 'Boleto enviado ao passageiro por e-mail ou outro meio', TRUE),
('Pago', 'Boleto pago pelo passageiro', TRUE),
('Vencido', 'Boleto vencido e não pago até a data de vencimento', TRUE),
('Cancelado', 'Boleto cancelado pela empresa ou pelo passageiro', TRUE);
