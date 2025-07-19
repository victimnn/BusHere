-- Down
DROP TABLE IF EXISTS DocumentosPassageiro;

-- Up
-- Tabela para documentos dos passageiros
CREATE TABLE DocumentosPassageiro (
    documento_passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    passageiro_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    caminho_arquivo VARCHAR(512) NOT NULL COMMENT 'Caminho/URL do arquivo armazenado',
    nome_arquivo_original VARCHAR(255),
    extensao_arquivo VARCHAR(10),
    tamanho_arquivo_bytes INT,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validade_documento DATE COMMENT 'Data de validade do documento, se aplicável',
    status_validacao_documento_id INT,
    usuario_analise_id INT COMMENT 'Usuário da empresa que analisou o documento',
    data_analise TIMESTAMP NULL,
    motivo_rejeicao TEXT COMMENT 'Se o status for reprovado',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (passageiro_id) REFERENCES Passageiros(passageiro_id),
    FOREIGN KEY (tipo_documento_id) REFERENCES TipoDocumentoPassageiro(tipo_documento_id),
    FOREIGN KEY (status_validacao_documento_id) REFERENCES StatusValidacaoDocumento(status_validacao_documento_id),
    FOREIGN KEY (usuario_analise_id) REFERENCES UsuariosEmpresa(usuario_empresa_id),

    INDEX idx_passageiro_id (passageiro_id),
    INDEX idx_tipo_documento_id (tipo_documento_id),
    INDEX idx_status_validacao_documento_id (status_validacao_documento_id),
    INDEX idx_usuario_analise_id (usuario_analise_id),
    INDEX idx_ativo (ativo)
);