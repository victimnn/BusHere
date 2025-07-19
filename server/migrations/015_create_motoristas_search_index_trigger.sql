-- Up
-- Triggers para manter a tabela searchIndex atualizada com dados de Motoristas

-- Trigger para INSERT: Adiciona um novo motorista ao índice de busca
CREATE TRIGGER after_motoristas_insert_add_to_search_index
AFTER INSERT ON Motoristas
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Motoristas
    -- NEW.nome e NEW.motorista_id são os valores da nova linha
    -- 'Motorista' é o tipo de item constante indicando que é um Motorista
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome, 'Motorista', NEW.motorista_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome do motorista muda
-- Executa após uma linha ser atualizada na tabela  'Motoristas'
CREATE TRIGGER after_motoristas_update_update_search_index
AFTER UPDATE ON Motoristas
FOR EACH ROW
BEGIN
    -- Verifica se o nome (o texto pesquisável) realmente mudou
    IF OLD.nome <> NEW.nome THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome
        WHERE item_type = 'Motorista' AND item_id = NEW.motorista_id;
    END IF;
END;

-- Trigger para DELETE: Remove um motorista do índice de busca quando ele é deletado
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela  'Motoristas'
CREATE TRIGGER after_motoristas_delete_remove_from_search_index
AFTER DELETE ON Motoristas
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente ao notorista deletado
    -- OLD.motorista_id refere-se a motorista_id da linha que foi deletado
    DELETE FROM searchIndex
    WHERE item_type = 'Motorista' AND item_id = OLD.motorista_id;
END;
