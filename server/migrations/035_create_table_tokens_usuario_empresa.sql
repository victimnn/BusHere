-- Up
CREATE TABLE TokensEmpresaLogin (
    token_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada token
    usuario_empresa_id INT NOT NULL, -- ID do usuário associado ao token
    token VARCHAR(255) NOT NULL, -- O token gerado para autenticação
    creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora de criação do token
    expiration_timestamp TIMESTAMP NOT NULL DEFAULT '1970-01-01 00:00:01', -- Data e hora de expiração do token

    -- Chave estrangeira referenciando a tabela Passageiro
    FOREIGN KEY (usuario_empresa_id) REFERENCES UsuariosEmpresa(usuario_empresa_id) ON DELETE CASCADE,

    -- Índice para buscas mais rápidas
    INDEX idx_usuario_empresa_id (usuario_empresa_id),
    INDEX idx_token (token),
    INDEX idx_expiration_timestamp (expiration_timestamp)

);