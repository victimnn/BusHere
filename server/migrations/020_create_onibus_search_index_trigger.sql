-- Up
-- Triggers para manter a tabela searchIndex atualizada com dados dos Onibus

-- Trigger para INSERT: Adiciona um novo onibus ao índice de busca
CREATE TRIGGER after_onibus_insert_add_to_search_index
AFTER INSERT ON Onibus
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Onibus
    -- NEW.nome e NEW.onibus_id são os valores da nova linha
    -- 'Onibus' é o tipo de item constante indicando que é uma onibus
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome, 'Onibus', NEW.onibus_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome da onibus muda
-- Executa após uma linha ser atualizada na tabela  Onibus'
CREATE TRIGGER after_onibus_update_update_search_index
AFTER UPDATE ON Onibus
FOR EACH ROW
BEGIN
    -- Verifica se o nome (o texto pesquisável) realmente mudou
    IF OLD.nome <> NEW.nome THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome
        WHERE item_type = 'Onibus' AND item_id = NEW.onibus_id;
    END IF;
END;

-- Trigger para DELETE: Remove uma onibus do índice de busca quando ela é deletada
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela  Onibus'
CREATE TRIGGER after_onibus_delete_remove_from_search_index
AFTER DELETE ON Onibus
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente a onibus deletada
    -- OLD.onibus_id refere-se a onibus_id da linha que foi deletada
    DELETE FROM searchIndex
    WHERE item_type = 'Onibus' AND item_id = OLD.onibus_id;
END;
