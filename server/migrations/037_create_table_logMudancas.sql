-- Down
DROP TABLE IF EXISTS LogMudancas;

-- Up
CREATE TABLE LogMudancas (
  mudanca_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada mudança
  usuario_id INT NOT NULL, -- ID do usuário que fez a mudança
  tabela VARCHAR(255) NOT NULL, -- Nome da tabela onde a mudança ocorreu
  operacao VARCHAR(50) NOT NULL, -- Tipo de operação (INSERT, UPDATE, DELETE)
  dados_antigos TEXT, -- Dados antigos antes da mudança (JSON)
  dados_novos TEXT, -- Dados novos após a mudança (JSON)
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora da mudança
  -- Chave estrangeira
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,

  -- Indices para buscas mais rápidas
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_tabela (tabela),
  INDEX idx_operacao (operacao),
  INDEX idx_timestamp (timestamp)
);