-- Down
DROP TABLE IF EXISTS TipoPassageiro;

-- Up

CREATE TABLE TipoPassageiro (
    tipo_passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_tipo_passageiro_ativo (ativo)
);

-- Inserindo dados de exemplo na tabela Passageiros
INSERT INTO TipoPassageiro (nome, descricao) 

VALUES 
 -- 1. Inserção para Alunos
    (
        'Estudante', 
        'Categoria para estudantes de instituições de ensino reconhecidas (fundamental, médio, técnico ou superior). Geralmente requer a apresentação de carteirinha de estudante válida.'
    ),    -- 2. Inserção para Funcionários de Empresa (Vale-Transporte)
    (
        'Corporativo', 
        'Passageiro cujo transporte é subsidiado ou pago por uma empresa conveniada, geralmente através do benefício de Vale-Transporte. A elegibilidade é definida pelo empregador.'
    );
