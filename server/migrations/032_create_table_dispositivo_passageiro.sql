-- Down
DROP TABLE IF EXISTS DispositivosPassageiro;

-- Up
-- Tabela para armazenar dispositivos dos passageiros para notificações push
CREATE TABLE DispositivosPassageiro (
    dispositivo_id INT AUTO_INCREMENT PRIMARY KEY,
    passageiro_id INT NOT NULL,
    token_dispositivo VARCHAR(500) NOT NULL UNIQUE COMMENT 'Token FCM, APNS, etc.',
    plataforma ENUM('Android', 'iOS', 'WebPush') COMMENT 'Plataforma do dispositivo',
    nome_dispositivo VARCHAR(100) COMMENT 'Ex: Meu Samsung S20, iPhone de Maria',
    ultima_vez_ativo TIMESTAMP,
    notificacoes_habilitadas BOOLEAN DEFAULT TRUE,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE, -- Para desativar tokens inválidos
    FOREIGN KEY (passageiro_id) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE
);