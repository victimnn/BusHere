CREATE TABLE inscricoes_notificacao_push (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_passageiro INT NOT NULL,
        endpoint TEXT NOT NULL,
        expirationTime DATETIME,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_passageiro) REFERENCES Passageiros(passageiro_id) ON DELETE CASCADE
);

-- Limpeza automática de inscrições antigas (EVENT)
CREATE EVENT IF NOT EXISTS cleanup_old_push_subs
ON SCHEDULE EVERY 1 DAY
DO
    DELETE FROM inscricoes_notificacao_push WHERE created_at < NOW() - INTERVAL 30 DAY;