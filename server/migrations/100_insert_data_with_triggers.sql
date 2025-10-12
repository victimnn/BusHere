-- Down
-- Esta migration contém apenas INSERTs, então o down seria DELETE
DELETE FROM Passageiros WHERE cpf IN ('12345678901', '23456789012', '34567890123', '45678901234', '56789012345');
DELETE FROM Pontos WHERE nome IN ('Terminal Central', 'Ponto Barão Geraldo', 'Ponto Taquaral', 'Ponto Shopping Dom Pedro', 'Ponto Vila Industrial');

-- Up
-- Inserts para tabelas que possuem triggers de search index
-- Mantendo a ordem: primeiro Pontos (migration 007), depois Passageiros (migration 019)

-- 3 exemplos de inserção na tabela Veiculos
INSERT INTO Veiculos (nome, placa, modelo, marca, ano_fabricacao, capacidade, quilometragem, data_ultima_manutencao, data_proxima_manutencao, tipo_veiculo_id, status_veiculo_id)
VALUES
    ('Micro-ônibus 722', 'OVD6954', 'Sprinter', 'Volkswagen', 2018, 26, 324430.64, '2025-05-11', '2026-01-25', 2, 1),
    ('Van 472', 'FVI1M30', 'Sprinter', 'Ford', 2010, 13, 329220.91, '2025-06-13', '2026-01-22', 3, 2),
    ('Micro-ônibus 430', 'CWZ4362', 'CityClass', 'Mercedes-Benz', 2016, 22, 391450.11, '2024-12-24', '2025-10-22', 2, 3);

-- 5 exemplos de inserção na tabela Pontos
INSERT INTO Pontos (nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia)
VALUES
    ('UPA', -22.68914562, -46.98844598, 'Rua Antônio Pinto Catão', '1222', 'Jardim Planalto', 'Jaguariúna', 'SP', '13820-000', 'Ao lado do UPA'),
    ('Ponto Roseira', -22.69764820, -47.01604455, 'Rua Jaboticabeira', '123', 'Roseira de cima', 'Jaguariúna', 'SP', '13917-480', 'Ponto de ônibus da roseira de cima'),
    ('Ponto Kleber Lanches', -22.67832020, -46.97441025, 'Rua Maranhão', '3009', 'Imperial', 'Jaguariúna', 'SP', '13911-292', 'Em frente ao mercado karina'),
    ('Ponto Ki-Delicia', -22.68361624, -46.98219595, 'Rua Alexandre Marion', '346', 'Doze de Setembro', 'Jaguariúna', 'SP', NULL, 'Em frente a Creche ao lado da padaria ki-delicia'),
    ('ETEC João Belarmino', -22.70600582, -46.76519494, 'Rua Sete de Setembro', '299', 'Centro', 'Amparo', 'SP', '13903-125', 'Escola ETEC João Belarmino');

-- Inserir dados de exemplo para motoristas
INSERT INTO Motoristas (nome, cpf, cnh_numero, cnh_categoria, cnh_validade, telefone, email, data_admissao, status_motorista_id) 
VALUES
    ('José Antonio Silva', '12345678901', '12345678901', 'D', '2026-12-31', '11987654321', 'jose.silva@empresa.com', '2020-01-15', 1),
    ('Maria Santos Lima', '23456789012', '23456789012', 'AD', '2025-08-15', '11976543210', 'maria.lima@empresa.com', '2019-03-10', 1),
    ('Carlos Eduardo Souza', '34567890123', '34567890123', 'D', '2027-05-20', '11965432109', 'carlos.souza@empresa.com', '2021-06-01', 1),
    ('Ana Paula Costa', '45678901234', '45678901234', 'AE', '2024-11-30', '11954321098', 'ana.costa@empresa.com', '2018-09-12', 2),
    ('Roberto Ferreira Santos', '56789012345', '56789012345', 'D', '2026-03-25', '11943210987', 'roberto.santos@empresa.com', '2022-02-28', 1);