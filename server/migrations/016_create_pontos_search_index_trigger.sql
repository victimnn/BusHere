-- Up
-- Triggers para manter a tabela searchIndex atualizada com dados de Pontos

-- Trigger para INSERT: Adiciona uma nova Ponto ao índice de busca
CREATE TRIGGER after_pontos_insert_add_to_search_index
AFTER INSERT ON Pontos
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Pontos
    -- NEW.nome e NEW.ponto_id são os valores da nova linha
    -- 'Ponto' é o tipo de item constante indicando que é uma Ponto
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome, 'Ponto', NEW.ponto_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome da Ponto muda
-- Executa após uma linha ser atualizada na tabela  Ponto'
CREATE TRIGGER after_pontos_update_update_search_index
AFTER UPDATE ON Pontos
FOR EACH ROW
BEGIN
    -- Verifica se o nome (o texto pesquisável) realmente mudou
    IF OLD.nome <> NEW.nome THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome
        WHERE item_type = 'Ponto' AND item_id = NEW.ponto_id;
    END IF;
END;

-- Trigger para DELETE: Remove uma Ponto do índice de busca quando ela é deletada
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela  Pontos'
CREATE TRIGGER after_pontos_delete_remove_from_search_index
AFTER DELETE ON Pontos
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente a Ponto deletada
    -- OLD.ponto_id refere-se a ponto_id da linha que foi deletada
    DELETE FROM searchIndex
    WHERE item_type = 'Ponto' AND item_id = OLD.ponto_id;
END;
