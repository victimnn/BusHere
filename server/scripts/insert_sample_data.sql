-- Inserir dados de exemplo para ônibus
INSERT INTO Onibus (nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, status_onibus_id) VALUES
('Ônibus 001', 'ABC-1234', 'Urbano', 'Mercedes', 2020, 50, 15000, 1),
('Ônibus 002', 'DEF-5678', 'Rodoviário', 'Volvo', 2019, 45, 25000, 1),
('Ônibus 003', 'GHI-9012', 'Micro', 'Iveco', 2021, 25, 8000, 2),
('Ônibus 004', 'JKL-3456', 'Urbano', 'Scania', 2018, 55, 35000, 1),
('Ônibus 005', 'MNO-7890', 'Executivo', 'Mercedes', 2022, 40, 5000, 3);

-- Inserir dados de exemplo para rotas
INSERT INTO Rotas (codigo_rota, nome, descricao, origem_descricao, destino_descricao, distancia_km, tempo_viagem_estimado_minutos, status_rota_id) VALUES
('R001', 'Rota Centro-Barão', 'Liga o centro da cidade ao bairro Barão Geraldo', 'Terminal Central', 'Barão Geraldo', 15.5, 45, 1),
('R002', 'Rota Taquaral-Unicamp', 'Conecta o Taquaral à Universidade', 'Taquaral', 'Unicamp', 12.3, 35, 1),
('R003', 'Rota Circular Centro', 'Rota circular no centro da cidade', 'Terminal Central', 'Terminal Central', 8.2, 25, 1),
('R004', 'Rota Campinas-Jaguariúna', 'Rota intermunicipal', 'Campinas', 'Jaguariúna', 25.8, 60, 2),
('R005', 'Rota Nova', 'Rota em fase de planejamento', 'A definir', 'A definir', 0, 0, 3);

-- Inserir dados de exemplo para passageiros
INSERT INTO Passageiros (nome_completo, cpf, email, senha_hash, telefone, data_nascimento, logradouro, numero_endereco, bairro, cidade, uf, cep, tipo_passageiro_id) VALUES
('João Silva Santos', '12345678901', 'joao.silva@email.com', 'hash123', '11987654321', '1990-05-15', 'Rua das Flores', '123', 'Centro', 'Campinas', 'SP', '13010001', 1),
('Maria Oliveira Lima', '23456789012', 'maria.oliveira@email.com', 'hash456', '11976543210', '1985-08-22', 'Av. Brasil', '456', 'Jardins', 'Campinas', 'SP', '13020002', 1),
('Pedro Costa Souza', '34567890123', 'pedro.costa@empresa.com', 'hash789', '11965432109', '1992-12-10', 'Rua do Comércio', '789', 'Centro', 'Campinas', 'SP', '13030003', 2),
('Ana Paula Ferreira', '45678901234', 'ana.ferreira@email.com', 'hash101', '11954321098', '1988-03-18', 'Rua das Palmeiras', '321', 'Taquaral', 'Campinas', 'SP', '13040004', 1),
('Carlos Eduardo Alves', '56789012345', 'carlos.alves@empresa.com', 'hash202', '11943210987', '1995-07-25', 'Av. das Nações', '654', 'Barão Geraldo', 'Campinas', 'SP', '13050005', 2);
