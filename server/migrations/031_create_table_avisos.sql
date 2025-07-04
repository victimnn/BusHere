-- Down
DROP TABLE IF EXISTS Avisos;

-- Up
-- Tabela para avisos e notificações
CREATE TABLE Avisos (
    aviso_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NULL,
    usuario_criador_id INT COMMENT 'Usuário da empresa que criou o aviso',
    escopo_aviso_id INT,
    rota_alvo_id INT NULL COMMENT 'Se o escopo for por rota',
    tipo_passageiro_alvo_id INT NULL COMMENT 'Se o escopo for por tipo de passageiro',
    passageiro_alvo_id INT NULL COMMENT 'Se o escopo for para um passageiro específico',
    prioridade ENUM('BAIXA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',

    -- flags para canais de envio (push, email, sms)
    enviar_push BOOLEAN DEFAULT TRUE,
    enviar_email BOOLEAN DEFAULT FALSE,
    enviar_sms BOOLEAN DEFAULT FALSE,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_criador_id) REFERENCES UsuariosEmpresa(usuario_empresa_id),
    FOREIGN KEY (escopo_aviso_id) REFERENCES EscoposAviso(escopo_aviso_id),
    FOREIGN KEY (rota_alvo_id) REFERENCES Rotas(rota_id),
    FOREIGN KEY (tipo_passageiro_alvo_id) REFERENCES TipoPassageiro(tipo_passageiro_id),
    FOREIGN KEY (passageiro_alvo_id) REFERENCES Passageiros(passageiro_id),

    INDEX idx_usuario_criador_id (usuario_criador_id),
    INDEX idx_escopo_aviso_id (escopo_aviso_id),
    INDEX idx_rota_alvo_id (rota_alvo_id),
    INDEX idx_tipo_passageiro_alvo_id (tipo_passageiro_alvo_id),
    INDEX idx_passageiro_alvo_id (passageiro_alvo_id),
    INDEX idx_prioridade (prioridade),
    INDEX idx_ativo (ativo)
);