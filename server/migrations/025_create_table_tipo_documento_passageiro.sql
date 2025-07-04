-- Down
DROP TABLE IF EXISTS TipoDocumentoPassageiro;

-- Up
-- Tabela para tipos de documentos de passageiros
CREATE TABLE TipoDocumentoPassageiro (
    tipo_documento_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: RG, CPF, Comprovante de Residência, Comprovante de Matrícula',
    obrigatorio BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_obrigatorio (obrigatorio),
    INDEX idx_ativo (ativo)
);

INSERT INTO TipoDocumentoPassageiro (nome, obrigatorio, descricao, ativo) VALUES
('RG', TRUE, 'Registro Geral - Documento de identidade brasileiro', TRUE),
('CPF', TRUE, 'Cadastro de Pessoa Física - Documento fiscal brasileiro', TRUE),
('Comprovante de Residência', FALSE, 'Documento que comprova o endereço do passageiro', TRUE),
('Comprovante de Matrícula', FALSE, 'Documento que comprova a matrícula em instituição de ensino', TRUE);