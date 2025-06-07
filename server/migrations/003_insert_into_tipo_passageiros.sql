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
