-- Down
-- Esta migration contém apenas INSERTs, então o down seria DELETE
DELETE FROM Passageiros WHERE cpf IN ('12345678901', '23456789012', '34567890123', '45678901234', '56789012345');
DELETE FROM Pontos WHERE nome IN ('Terminal Central', 'Ponto Barão Geraldo', 'Ponto Taquaral', 'Ponto Shopping Dom Pedro', 'Ponto Vila Industrial');

-- Up
-- Inserts para tabelas que possuem triggers de search index
-- Mantendo a ordem: primeiro Pontos (migration 007), depois Passageiros (migration 019)

-- 5 exemplos de inserção na tabela Pontos
INSERT INTO Pontos (nome, latitude, longitude, logradouro, numero_endereco, bairro, cidade, uf, cep, referencia)
VALUES
    ('Terminal Central', -22.9068, -47.0626, 'Av. Andrade Neves', '200', 'Centro', 'Campinas', 'SP', '13013-161', 'Terminal de ônibus central da cidade'),
    ('Ponto Barão Geraldo', -22.8286, -47.1067, 'Av. Santa Isabel', '1000', 'Barão Geraldo', 'Campinas', 'SP', '13084-012', 'Próximo à Unicamp'),
    ('Ponto Taquaral', -22.8672, -47.0545, 'Av. Heitor Penteado', '1500', 'Taquaral', 'Campinas', 'SP', '13076-000', 'Em frente à Lagoa do Taquaral'),
    ('Ponto Shopping Dom Pedro', -22.8526, -47.0646, 'Av. Guilherme Campos', '500', 'Jardim Santa Genebra', 'Campinas', 'SP', '13087-901', 'Entrada principal do shopping'),
    ('Ponto Vila Industrial', -22.9001, -47.0562, 'Rua Dr. Salles Oliveira', '300', 'Vila Industrial', 'Campinas', 'SP', '13035-270', 'Próximo ao Hospital Mário Gatti');

INSERT INTO Passageiros (nome_completo, cpf, email, senha_hash, telefone, data_nascimento, logradouro, numero_endereco, bairro, cidade, uf, cep, tipo_passageiro_id) 
VALUES
    ('Rubens Castaldelli Carlos', '12345678901', 'joao.silva@email.com', 'hash123', '11987654321', '1990-05-15', 'Rua das Flores', '123', 'Centro', 'Serra Negra', 'SP', '13010001', 1),
    ('Giuliano Catelli', '23456789012', 'maria.oliveira@email.com', 'hash456', '11976543210', '1985-08-22', 'Av. Brasil', '456', 'Jardins', 'Amparo', 'SP', '13020002', 1),
    ('Emerson Baião', '34567890123', 'pedro.costa@empresa.com', 'hash789', '11965432109', '1992-12-10', 'Rua do Comércio', '789', 'Centro', 'Amparo', 'SP', '13030003', 2),
    ('Laine Zanin', '45678901234', 'ana.ferreira@email.com', 'hash101', '11954321098', '1988-03-18', 'Rua das Palmeiras', '321', 'Taquaral', 'Amparo', 'SP', '13040004', 1),
    ('Sergião', '56789012345', 'carlos.alves@empresa.com', 'hash202', '11943210987', '1995-07-25', 'Av. das Nações', '654', 'Barão Geraldo', 'Campinas', 'SP', '13050005', 2);

-- Inserir dados de exemplo para motoristas
INSERT INTO Motoristas (nome, cpf, cnh_numero, cnh_categoria, cnh_validade, telefone, email, data_admissao, status_motorista_id) 
VALUES
    ('José Antonio Silva', '12345678901', '12345678901', 'D', '2026-12-31', '11987654321', 'jose.silva@empresa.com', '2020-01-15', 1),
    ('Maria Santos Lima', '23456789012', '23456789012', 'AD', '2025-08-15', '11976543210', 'maria.lima@empresa.com', '2019-03-10', 1),
    ('Carlos Eduardo Souza', '34567890123', '34567890123', 'D', '2027-05-20', '11965432109', 'carlos.souza@empresa.com', '2021-06-01', 1),
    ('Ana Paula Costa', '45678901234', '45678901234', 'AE', '2024-11-30', '11954321098', 'ana.costa@empresa.com', '2018-09-12', 2),
    ('Roberto Ferreira Santos', '56789012345', '56789012345', 'D', '2026-03-25', '11943210987', 'roberto.santos@empresa.com', '2022-02-28', 1);