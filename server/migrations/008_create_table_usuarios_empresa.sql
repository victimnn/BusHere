-- Down
DROP TABLE IF EXISTS UsuariosEmpresa;

-- Up
-- Tabela para armazenar os usuários da empresa (plataforma web)
CREATE TABLE UsuariosEmpresa (
    usuario_empresa_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL COMMENT 'Nome completo do usuário',
    login_usuario VARCHAR(100) UNIQUE NOT NULL COMMENT 'Login de acesso',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email do usuário',
    senha_hash VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
    telefone VARCHAR(15),
    data_ultimo_login TIMESTAMP NULL,
    ip_ultimo_login VARCHAR(45) NULL,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_usuario_empresa_login (login_usuario),
    INDEX idx_usuario_empresa_email (email)
);

INSERT INTO UsuariosEmpresa (nome, login_usuario, email, senha_hash, telefone)
VALUES ('Administrador', 'admin', 'admin@admin.com', '$2b$10$kBr60Aku0AOarw0M4g1fmet96mxvEUYeKEH3s/5sBvDVrh8V1rr.W', '40028992')