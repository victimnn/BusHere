-- Down
DROP TABLE IF EXISTS Motoristas;

-- Up
-- Tabela para motoristas
CREATE TABLE Motoristas (
    motorista_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cnh_numero VARCHAR(20) UNIQUE NOT NULL,
    cnh_categoria VARCHAR(5) NOT NULL,
    cnh_validade DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    data_admissao DATE,
    status_motorista_id INT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (status_motorista_id) REFERENCES StatusMotorista(status_motorista_id),

    -- Índices para otimização de consultas
    INDEX idx_cpf (cpf),
    INDEX idx_cnh_numero (cnh_numero),
    INDEX idx_nome (nome)

);