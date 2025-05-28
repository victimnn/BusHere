-- Down
DROP TABLE IF EXISTS Passageiros;

-- Up
CREATE TABLE Passageiros (
    passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(11),
    data_nascimento DATE,
    logradouro VARCHAR(255) NOT NULL,
    numero_endereco VARCHAR(20) NOT NULL, -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(20) do DER
    complemento_endereco VARCHAR(100), -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(100) do DER
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL, -- Ajustado de VARCHAR(255) do exemplo Users para VARCHAR(100) do DER
    uf CHAR(2) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    tipo_passageiro_id INT,
    rota_id INT, -- Referente a id_rota_passageiro no DER
    status_pagamento_id INT,
    notificacoes_json JSON DEFAULT '{}',
    configuracoes_json JSON DEFAULT '{}',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_passageiros_cpf (cpf), -- It's often good practice to index UNIQUE columns too
    INDEX idx_passageiros_email (email),
    INDEX idx_passageiros_tipo (tipo_passageiro_id),
    INDEX idx_passageiros_ativo (ativo)

    -- Definição das chaves estrangeiras
    -- Estas tabelas (Tipos_Passageiro, Rotas, Status_Pagamento) devem existir.
    -- Os nomes das colunas referenciadas (tipo_passageiro_id, rota_id, status_pagamento_id)
    -- são exemplos e devem corresponder às chaves primárias das respectivas tabelas.

    -- FOREIGN KEY (tipo_passageiro_id) REFERENCES Tipos_Passageiro(tipo_passageiro_id),
    -- FOREIGN KEY (rota_id) REFERENCES Rotas(rota_id),
    -- FOREIGN KEY (status_pagamento_id) REFERENCES Status_Pagamento(status_pagamento_id)

    -- Comentário: Descomente e ajuste as FOREIGN KEY constraints acima
    -- quando as tabelas Tipos_Passageiro, Rotas, e Status_Pagamento forem criadas
    -- e os nomes exatos das suas chaves primárias estiverem definidos.
    -- Exemplo, se a tabela Tipo_Passageiro tiver ID_tipo_passageiro como PK:
    -- FOREIGN KEY (tipo_passageiro_id) REFERENCES Tipo_Passageiro(ID_tipo_passageiro)
);

-- Nota sobre Chaves Estrangeiras:
-- No script acima, as definições de FOREIGN KEY estão comentadas.
-- Você precisará descomentá-las e ajustá-las para os nomes corretos das suas tabelas
-- e colunas de chave primária referenciadas (ex: Tipos_Passageiro, Rotas, Status_Pagamento)
-- após a criação dessas tabelas.
-- Por exemplo, se a tabela Rota tiver uma PK chamada ID_rota, a FK seria:
-- FOREIGN KEY (rota_id) REFERENCES Rota(ID_rota)
-- Adapte conforme a sua estrutura final.