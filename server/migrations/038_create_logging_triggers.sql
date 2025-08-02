-- Down
-- Remove todos os triggers de logging
DROP TRIGGER IF EXISTS after_pontos_insert_log;
DROP TRIGGER IF EXISTS after_pontos_update_log;
DROP TRIGGER IF EXISTS after_pontos_delete_log;
DROP TRIGGER IF EXISTS after_motoristas_insert_log;
DROP TRIGGER IF EXISTS after_motoristas_update_log;
DROP TRIGGER IF EXISTS after_motoristas_delete_log;
DROP TRIGGER IF EXISTS after_rotas_insert_log;
DROP TRIGGER IF EXISTS after_rotas_update_log;
DROP TRIGGER IF EXISTS after_rotas_delete_log;
DROP TRIGGER IF EXISTS after_onibus_insert_log;
DROP TRIGGER IF EXISTS after_onibus_update_log;
DROP TRIGGER IF EXISTS after_onibus_delete_log;
DROP TRIGGER IF EXISTS after_usuarios_empresa_insert_log;
DROP TRIGGER IF EXISTS after_usuarios_empresa_update_log;
DROP TRIGGER IF EXISTS after_usuarios_empresa_delete_log;
DROP TRIGGER IF EXISTS after_passageiros_insert_log;
DROP TRIGGER IF EXISTS after_passageiros_update_log;
DROP TRIGGER IF EXISTS after_passageiros_delete_log;

-- Up
-- triggers para logging de alterações em tabelas
-- Pontos
CREATE TRIGGER after_pontos_insert_log
AFTER INSERT ON Pontos
FOR EACH ROW
BEGIN    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Pontos', 
        NEW.ponto_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'ponto_id', NEW.ponto_id,
            'nome', NEW.nome,
            'latitude', NEW.latitude,
            'longitude', NEW.longitude,
            'logradouro', NEW.logradouro,
            'numero_endereco', NEW.numero_endereco,
            'bairro', NEW.bairro,
            'cidade', NEW.cidade,
            'uf', NEW.uf,
            'cep', NEW.cep,
            'referencia', NEW.referencia,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ), 
        1
    );
END;

CREATE TRIGGER after_pontos_update_log
AFTER UPDATE ON Pontos
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Pontos', 
        OLD.ponto_id,
        'UPDATE', 
        JSON_OBJECT(
            'ponto_id', OLD.ponto_id,
            'nome', OLD.nome,
            'latitude', OLD.latitude,
            'longitude', OLD.longitude,
            'logradouro', OLD.logradouro,
            'numero_endereco', OLD.numero_endereco,
            'bairro', OLD.bairro,
            'cidade', OLD.cidade,
            'uf', OLD.uf,
            'cep', OLD.cep,
            'referencia', OLD.referencia,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        JSON_OBJECT(
            'ponto_id', NEW.ponto_id,
            'nome', NEW.nome,
            'latitude', NEW.latitude,
            'longitude', NEW.longitude,
            'logradouro', NEW.logradouro,
            'numero_endereco', NEW.numero_endereco,
            'bairro', NEW.bairro,
            'cidade', NEW.cidade,
            'uf', NEW.uf,
            'cep', NEW.cep,
            'referencia', NEW.referencia,
            'ativo', NEW.ativo,            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao
        ),
        1
    );
END;

CREATE TRIGGER after_pontos_delete_log
AFTER DELETE ON Pontos
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Pontos', 
        OLD.ponto_id,
        'DELETE', 
        JSON_OBJECT(
            'ponto_id', OLD.ponto_id,
            'nome', OLD.nome,
            'latitude', OLD.latitude,
            'longitude', OLD.longitude,
            'logradouro', OLD.logradouro,
            'numero_endereco', OLD.numero_endereco,
            'bairro', OLD.bairro,
            'cidade', OLD.cidade,
            'uf', OLD.uf,
            'cep', OLD.cep,
            'referencia', OLD.referencia,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao        ),
        NULL,
        1
    );
END;

-- Motoristas
CREATE TRIGGER after_motoristas_insert_log
AFTER INSERT ON Motoristas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Motoristas', 
        NEW.motorista_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'motorista_id', NEW.motorista_id,
            'nome', NEW.nome,
            'cpf', NEW.cpf,
            'cnh_numero', NEW.cnh_numero,
            'cnh_categoria', NEW.cnh_categoria,
            'cnh_validade', NEW.cnh_validade,
            'telefone', NEW.telefone,
            'email', NEW.email,
            'data_admissao', NEW.data_admissao,
            'status_motorista_id', NEW.status_motorista_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ), 
        1
    );
END;

CREATE TRIGGER after_motoristas_update_log
AFTER UPDATE ON Motoristas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Motoristas', 
        NEW.motorista_id,
        'UPDATE', 
        JSON_OBJECT(
            'motorista_id', OLD.motorista_id,
            'nome', OLD.nome,
            'cpf', OLD.cpf,
            'cnh_numero', OLD.cnh_numero,
            'cnh_categoria', OLD.cnh_categoria,
            'cnh_validade', OLD.cnh_validade,
            'telefone', OLD.telefone,
            'email', OLD.email,
            'data_admissao', OLD.data_admissao,
            'status_motorista_id', OLD.status_motorista_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        JSON_OBJECT(
            'motorista_id', NEW.motorista_id,
            'nome', NEW.nome,
            'cpf', NEW.cpf,
            'cnh_numero', NEW.cnh_numero,
            'cnh_categoria', NEW.cnh_categoria,
            'cnh_validade', NEW.cnh_validade,
            'telefone', NEW.telefone,
            'email', NEW.email,            'data_admissao', NEW.data_admissao,
            'status_motorista_id', NEW.status_motorista_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao
        ),
        NEW.motorista_id
    );
END;

CREATE TRIGGER after_motoristas_delete_log
AFTER DELETE ON Motoristas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Motoristas', 
        OLD.motorista_id,
        'DELETE', 
        JSON_OBJECT(
            'motorista_id', OLD.motorista_id,
            'nome', OLD.nome,
            'cpf', OLD.cpf,
            'cnh_numero', OLD.cnh_numero,
            'cnh_categoria', OLD.cnh_categoria,
            'cnh_validade', OLD.cnh_validade,
            'telefone', OLD.telefone,
            'email', OLD.email,
            'data_admissao', OLD.data_admissao,
            'status_motorista_id', OLD.status_motorista_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        NULL,
        OLD.motorista_id
    );
END;

-- Rotas
CREATE TRIGGER after_rotas_insert_log
AFTER INSERT ON Rotas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Rotas', 
        NEW.rota_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'rota_id', NEW.rota_id,
            'codigo_rota', NEW.codigo_rota,
            'nome', NEW.nome,
            'descricao', NEW.descricao,
            'origem_descricao', NEW.origem_descricao,
            'destino_descricao', NEW.destino_descricao,
            'distancia_km', NEW.distancia_km,
            'tempo_viagem_estimado_minutos', NEW.tempo_viagem_estimado_minutos,
            'status_rota_id', NEW.status_rota_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ), 
        1 -- Usuario genérico para tabelas sem usuario_id
    );
END;

CREATE TRIGGER after_rotas_update_log
AFTER UPDATE ON Rotas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Rotas', 
        NEW.rota_id,
        'UPDATE', 
        JSON_OBJECT(
            'rota_id', OLD.rota_id,
            'codigo_rota', OLD.codigo_rota,
            'nome', OLD.nome,
            'descricao', OLD.descricao,
            'origem_descricao', OLD.origem_descricao,
            'destino_descricao', OLD.destino_descricao,
            'distancia_km', OLD.distancia_km,
            'tempo_viagem_estimado_minutos', OLD.tempo_viagem_estimado_minutos,
            'status_rota_id', OLD.status_rota_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        JSON_OBJECT(
            'rota_id', NEW.rota_id,
            'codigo_rota', NEW.codigo_rota,
            'nome', NEW.nome,
            'descricao', NEW.descricao,
            'origem_descricao', NEW.origem_descricao,
            'destino_descricao', NEW.destino_descricao,
            'distancia_km', NEW.distancia_km,
            'tempo_viagem_estimado_minutos', NEW.tempo_viagem_estimado_minutos,
            'status_rota_id', NEW.status_rota_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ),
        1
    );
END;

CREATE TRIGGER after_rotas_delete_log
AFTER DELETE ON Rotas
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Rotas', 
        OLD.rota_id,
        'DELETE', 
        JSON_OBJECT(
            'rota_id', OLD.rota_id,
            'codigo_rota', OLD.codigo_rota,
            'nome', OLD.nome,
            'descricao', OLD.descricao,
            'origem_descricao', OLD.origem_descricao,
            'destino_descricao', OLD.destino_descricao,
            'distancia_km', OLD.distancia_km,
            'tempo_viagem_estimado_minutos', OLD.tempo_viagem_estimado_minutos,
            'status_rota_id', OLD.status_rota_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao        ),
        NULL,
        1
    );
END;

-- Onibus
CREATE TRIGGER after_onibus_insert_log
AFTER INSERT ON Onibus
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Onibus', 
        NEW.onibus_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'onibus_id', NEW.onibus_id,
            'nome', NEW.nome,
            'placa', NEW.placa,
            'modelo', NEW.modelo,
            'marca', NEW.marca,
            'ano_fabricacao', NEW.ano_fabricacao,
            'capacidade', NEW.capacidade,
            'quilometragem', NEW.quilometragem,
            'data_ultima_manutencao', NEW.data_ultima_manutencao,
            'data_proxima_manutencao', NEW.data_proxima_manutencao,
            'status_onibus_id', NEW.status_onibus_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ), 
        1
    );
END;

CREATE TRIGGER after_onibus_update_log
AFTER UPDATE ON Onibus
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Onibus', 
        NEW.onibus_id,
        'UPDATE', 
        JSON_OBJECT(
            'onibus_id', OLD.onibus_id,
            'nome', OLD.nome,
            'placa', OLD.placa,
            'modelo', OLD.modelo,
            'marca', OLD.marca,
            'ano_fabricacao', OLD.ano_fabricacao,
            'capacidade', OLD.capacidade,
            'quilometragem', OLD.quilometragem,
            'data_ultima_manutencao', OLD.data_ultima_manutencao,
            'data_proxima_manutencao', OLD.data_proxima_manutencao,
            'status_onibus_id', OLD.status_onibus_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        JSON_OBJECT(
            'onibus_id', NEW.onibus_id,
            'nome', NEW.nome,
            'placa', NEW.placa,
            'modelo', NEW.modelo,
            'marca', NEW.marca,
            'ano_fabricacao', NEW.ano_fabricacao,
            'capacidade', NEW.capacidade,
            'quilometragem', NEW.quilometragem,
            'data_ultima_manutencao', NEW.data_ultima_manutencao,
            'data_proxima_manutencao', NEW.data_proxima_manutencao,
            'status_onibus_id', NEW.status_onibus_id,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao        ),
        1
    );
END;

CREATE TRIGGER after_onibus_delete_log
AFTER DELETE ON Onibus
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Onibus', 
        OLD.onibus_id,
        'DELETE', 
        JSON_OBJECT(
            'onibus_id', OLD.onibus_id,
            'nome', OLD.nome,
            'placa', OLD.placa,
            'modelo', OLD.modelo,
            'marca', OLD.marca,
            'ano_fabricacao', OLD.ano_fabricacao,
            'capacidade', OLD.capacidade,
            'quilometragem', OLD.quilometragem,
            'data_ultima_manutencao', OLD.data_ultima_manutencao,
            'data_proxima_manutencao', OLD.data_proxima_manutencao,
            'status_onibus_id', OLD.status_onibus_id,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao        ),
        NULL,
        1
    );
END;

-- UsuariosEmpresa
-- Nota: senha_hash não é incluída nos logs por motivos de segurança
CREATE TRIGGER after_usuarios_empresa_insert_log
AFTER INSERT ON UsuariosEmpresa
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'UsuariosEmpresa', 
        NEW.usuario_empresa_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'usuario_empresa_id', NEW.usuario_empresa_id,
            'nome', NEW.nome,
            'login_usuario', NEW.login_usuario,
            'email', NEW.email,
            'telefone', NEW.telefone,
            'data_ultimo_login', NEW.data_ultimo_login,
            'ip_ultimo_login', NEW.ip_ultimo_login,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao
        ), 
        NEW.usuario_empresa_id
    );
END;

CREATE TRIGGER after_usuarios_empresa_update_log
AFTER UPDATE ON UsuariosEmpresa
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'UsuariosEmpresa', 
        NEW.usuario_empresa_id,
        'UPDATE', 
        JSON_OBJECT(
            'usuario_empresa_id', OLD.usuario_empresa_id,
            'nome', OLD.nome,
            'login_usuario', OLD.login_usuario,
            'email', OLD.email,
            'telefone', OLD.telefone,
            'data_ultimo_login', OLD.data_ultimo_login,
            'ip_ultimo_login', OLD.ip_ultimo_login,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        JSON_OBJECT(
            'usuario_empresa_id', NEW.usuario_empresa_id,
            'nome', NEW.nome,
            'login_usuario', NEW.login_usuario,
            'email', NEW.email,
            'telefone', NEW.telefone,
            'data_ultimo_login', NEW.data_ultimo_login,
            'ip_ultimo_login', NEW.ip_ultimo_login,
            'ativo', NEW.ativo,
            'criacao', NEW.criacao,
            'atualizacao', NEW.atualizacao
        ),
        NEW.usuario_empresa_id
    );
END;

CREATE TRIGGER after_usuarios_empresa_delete_log
AFTER DELETE ON UsuariosEmpresa
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'UsuariosEmpresa', 
        OLD.usuario_empresa_id,
        'DELETE', 
        JSON_OBJECT(
            'usuario_empresa_id', OLD.usuario_empresa_id,
            'nome', OLD.nome,
            'login_usuario', OLD.login_usuario,
            'email', OLD.email,
            'telefone', OLD.telefone,
            'data_ultimo_login', OLD.data_ultimo_login,
            'ip_ultimo_login', OLD.ip_ultimo_login,
            'ativo', OLD.ativo,
            'criacao', OLD.criacao,
            'atualizacao', OLD.atualizacao
        ),
        NULL,
        OLD.usuario_empresa_id
    );
END;

-- Passageiros
-- Nota: senha_hash não é incluída nos logs por motivos de segurança
CREATE TRIGGER after_passageiros_insert_log
AFTER INSERT ON Passageiros
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Passageiros', 
        NEW.passageiro_id,
        'INSERT', 
        NULL, 
        JSON_OBJECT(
            'passageiro_id', NEW.passageiro_id,
            'nome_completo', NEW.nome_completo,
            'cpf', NEW.cpf,
            'email', NEW.email,
            'telefone', NEW.telefone,
            'data_nascimento', NEW.data_nascimento,
            'pcd', NEW.pcd,
            'logradouro', NEW.logradouro,
            'numero_endereco', NEW.numero_endereco,
            'complemento_endereco', NEW.complemento_endereco,
            'bairro', NEW.bairro,
            'cidade', NEW.cidade,
            'uf', NEW.uf,
            'cep', NEW.cep,
            'tipo_passageiro_id', NEW.tipo_passageiro_id,
            'rota_id', NEW.rota_id,
            'ponto_id', NEW.ponto_id,
            'notificacoes_json', NEW.notificacoes_json,
            'configuracoes_json', NEW.configuracoes_json,
            'data_criacao', NEW.data_criacao,
            'data_atualizacao', NEW.data_atualizacao,
            'ativo', NEW.ativo
        ),        1
    );
END;

CREATE TRIGGER after_passageiros_update_log
AFTER UPDATE ON Passageiros
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Passageiros', 
        NEW.passageiro_id,
        'UPDATE', 
        JSON_OBJECT(
            'passageiro_id', OLD.passageiro_id,
            'nome_completo', OLD.nome_completo,
            'cpf', OLD.cpf,
            'email', OLD.email,
            'telefone', OLD.telefone,
            'data_nascimento', OLD.data_nascimento,
            'pcd', OLD.pcd,
            'logradouro', OLD.logradouro,
            'numero_endereco', OLD.numero_endereco,
            'complemento_endereco', OLD.complemento_endereco,
            'bairro', OLD.bairro,
            'cidade', OLD.cidade,
            'uf', OLD.uf,
            'cep', OLD.cep,
            'tipo_passageiro_id', OLD.tipo_passageiro_id,
            'rota_id', OLD.rota_id,
            'ponto_id', OLD.ponto_id,
            'notificacoes_json', OLD.notificacoes_json,
            'configuracoes_json', OLD.configuracoes_json,
            'data_criacao', OLD.data_criacao,
            'data_atualizacao', OLD.data_atualizacao,
            'ativo', OLD.ativo
        ),
        JSON_OBJECT(
            'passageiro_id', NEW.passageiro_id,
            'nome_completo', NEW.nome_completo,
            'cpf', NEW.cpf,
            'email', NEW.email,
            'telefone', NEW.telefone,
            'data_nascimento', NEW.data_nascimento,
            'pcd', NEW.pcd,
            'logradouro', NEW.logradouro,
            'numero_endereco', NEW.numero_endereco,
            'complemento_endereco', NEW.complemento_endereco,
            'bairro', NEW.bairro,
            'cidade', NEW.cidade,
            'uf', NEW.uf,
            'cep', NEW.cep,
            'tipo_passageiro_id', NEW.tipo_passageiro_id,
            'rota_id', NEW.rota_id,
            'ponto_id', NEW.ponto_id,
            'notificacoes_json', NEW.notificacoes_json,
            'configuracoes_json', NEW.configuracoes_json,
            'data_criacao', NEW.data_criacao,
            'data_atualizacao', NEW.data_atualizacao,
            'ativo', NEW.ativo        ),
        1
    );
END;

CREATE TRIGGER after_passageiros_delete_log
AFTER DELETE ON Passageiros
FOR EACH ROW
BEGIN
    INSERT INTO LogMudancas (tabela, registro_id, operacao, dados_antigos, dados_novos, usuario_id)
    VALUES (
        'Passageiros', 
        OLD.passageiro_id,
        'DELETE', 
        JSON_OBJECT(
            'passageiro_id', OLD.passageiro_id,
            'nome_completo', OLD.nome_completo,
            'cpf', OLD.cpf,
            'email', OLD.email,
            'telefone', OLD.telefone,
            'data_nascimento', OLD.data_nascimento,
            'pcd', OLD.pcd,
            'logradouro', OLD.logradouro,
            'numero_endereco', OLD.numero_endereco,
            'complemento_endereco', OLD.complemento_endereco,
            'bairro', OLD.bairro,
            'cidade', OLD.cidade,
            'uf', OLD.uf,
            'cep', OLD.cep,
            'tipo_passageiro_id', OLD.tipo_passageiro_id,
            'rota_id', OLD.rota_id,
            'ponto_id', OLD.ponto_id,
            'notificacoes_json', OLD.notificacoes_json,
            'configuracoes_json', OLD.configuracoes_json,
            'data_criacao', OLD.data_criacao,
            'data_atualizacao', OLD.data_atualizacao,
            'ativo', OLD.ativo        ),
        NULL,
        1
    );
END;

