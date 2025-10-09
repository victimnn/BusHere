-- Down
DROP TABLE IF EXISTS ConvitesPassageiro;

-- Up
-- Tabela para convites de cadastro
CREATE TABLE ConvitesPassageiro (
    convite_passageiro_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_convite VARCHAR(100) UNIQUE NOT NULL COMMENT 'Código único do convite',
    email_convidado VARCHAR(255) COMMENT 'Email para onde o convite foi enviado/destinado',
    passageiro_cadastrado_id INT NULL COMMENT 'Passageiro que usou este convite',
    usuario_emissor_id INT NOT NULL COMMENT 'Usuário da empresa que gerou o convite',
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    data_aceite TIMESTAMP NULL,
    metodo_envio VARCHAR(50) COMMENT 'Ex: link direto, email',
    status_convite_id INT NOT NULL,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (passageiro_cadastrado_id) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_emissor_id) REFERENCES UsuariosEmpresa(usuario_empresa_id),
    FOREIGN KEY (status_convite_id) REFERENCES StatusConvite(status_convite_id),

    -- Constraints para validação de datas
    CONSTRAINT chk_data_expiracao CHECK (data_expiracao > data_envio),
    CONSTRAINT chk_data_aceite CHECK (data_aceite IS NULL OR (data_aceite >= data_envio AND data_aceite <= data_expiracao)),

    -- Índices para otimizar consultas
    INDEX idx_codigo_convite (codigo_convite),
    INDEX idx_email_convidado (email_convidado),
    INDEX idx_passageiro_cadastrado_id (passageiro_cadastrado_id),
    INDEX idx_usuario_emissor_id (usuario_emissor_id),
    INDEX idx_status_convite_id (status_convite_id),
    INDEX idx_ativo (ativo)
);