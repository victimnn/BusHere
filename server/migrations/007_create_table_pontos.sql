-- Down
DROP TABLE IF EXISTS Pontos;

-- Up
-- Tabela para pontos de parada
CREATE TABLE Pontos (
    ponto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    logradouro VARCHAR(255),
    numero_endereco VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep VARCHAR(9),
    referencia TEXT COMMENT 'Ponto de referência ou descrição adicional',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_nome (nome),
    INDEX idx_ponto_localizacao (latitude, longitude)
);

-- 5 exemplos de inserção na tabela Pontos
INSERT INTO Pontos (nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia)
VALUES
  ('Terminal Central', -22.9068, -47.0626, 'Av. Andrade Neves', '200', 'Centro', 'Campinas', 'SP', '13013-161', 'Terminal de ônibus central da cidade'),
  ('Ponto Barão Geraldo', -22.8286, -47.1067, 'Av. Santa Isabel', '1000', 'Barão Geraldo', 'Campinas', 'SP', '13084-012', 'Próximo à Unicamp'),
  ('Ponto Taquaral', -22.8672, -47.0545, 'Av. Heitor Penteado', '1500', 'Taquaral', 'Campinas', 'SP', '13076-000', 'Em frente à Lagoa do Taquaral'),
  ('Ponto Shopping Dom Pedro', -22.8526, -47.0646, 'Av. Guilherme Campos', '500', 'Jardim Santa Genebra', 'Campinas', 'SP', '13087-901', 'Entrada principal do shopping'),
  ('Ponto Vila Industrial', -22.9001, -47.0562, 'Rua Dr. Salles Oliveira', '300', 'Vila Industrial', 'Campinas', 'SP', '13035-270', 'Próximo ao Hospital Mário Gatti');
