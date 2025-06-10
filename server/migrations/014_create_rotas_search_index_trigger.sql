-- Up
-- Triggers para manter a tabela searchIndex atualizada com dados de Rotas

-- Trigger para INSERT: Adiciona uma nova rota ao índice de busca
CREATE TRIGGER after_rotas_insert_add_to_search_index
AFTER INSERT ON Rotas
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Rotas
    -- NEW.nome_rota e NEW.rota_id são os valores da nova linha
    -- 'Rota' é o tipo de item constante indicando que é uma rota
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome_rota, 'Rota', NEW.rota_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome da rota muda
-- Executa após uma linha ser atualizada na tabela  Rota'
CREATE TRIGGER after_rotas_update_update_search_index
AFTER UPDATE ON Rotas
FOR EACH ROW
BEGIN
    -- Verifica se o nome (o texto pesquisável) realmente mudou
    IF OLD.nome_rota <> NEW.nome_rota THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome_rota
        WHERE item_type = 'Rota' AND item_id = NEW.rota_id;
    END IF;
END;

-- Trigger para DELETE: Remove uma rota do índice de busca quando ela é deletada
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela  Rotas'
CREATE TRIGGER after_rotas_delete_remove_from_search_index
AFTER DELETE ON Rotas
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente a rota deletada
    -- OLD.rota_id refere-se a rota_id da linha que foi deletada
    DELETE FROM searchIndex
    WHERE item_type = 'Rota' AND item_id = OLD.rota_id;
END;
