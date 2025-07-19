-- Down
DROP TABLE IF EXISTS StatusValidacaoDocumento;

-- Up
-- Tabela para status de validação de documentos
CREATE TABLE StatusValidacaoDocumento (
    status_validacao_documento_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

INSERT INTO StatusValidacaoDocumento (nome, descricao, ativo) VALUES
('Pendente Análise', 'Documento aguardando análise pela equipe de validação', TRUE),
('Aprovado', 'Documento validado e aprovado', TRUE),
('Reprovado', 'Documento reprovado por inconsistências ou falta de informações', TRUE);