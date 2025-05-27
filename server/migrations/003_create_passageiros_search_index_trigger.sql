-- Down
-- Remove todos os triggers relacionados à tabela Passageiros, caso existam
DROP TRIGGER IF EXISTS after_passageiros_insert_add_to_search_index;
DROP TRIGGER IF EXISTS after_passageiros_update_update_search_index;
DROP TRIGGER IF EXISTS after_passageiros_delete_remove_from_search_index;

--Up
-- Triggers para manter a tabela searchIndex atualizada com dados de Passageiros

-- Trigger para INSERT: Adiciona um novo passageiro ao índice de busca
CREATE TRIGGER after_passageiros_insert_add_to_search_index
AFTER INSERT ON Passageiros
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Passageiros
    -- NEW.nome_completo e NEW.passageiro_id são os valores da nova linha
    -- 'Passageiro' é o tipo de item constante indicando que é um passageiro
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome_completo, 'Passageiro', NEW.passageiro_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome completo do passageiro muda
-- Executa após uma linha ser atualizada na tabela 'Passageiros'
CREATE TRIGGER after_passageiros_update_update_search_index
AFTER UPDATE ON Passageiros
FOR EACH ROW
BEGIN
    -- Verifica se o nome completo (o texto pesquisável) realmente mudou
    IF OLD.nome_completo <> NEW.nome_completo THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome_completo
        WHERE item_type = 'Passageiro' AND item_id = NEW.passageiro_id;
    END IF;
END;

-- Trigger para DELETE: Remove um passageiro do índice de busca quando ele é deletado
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela 'Passageiros'
CREATE TRIGGER after_passageiros_delete_remove_from_search_index
AFTER DELETE ON Passageiros
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente ao passageiro deletado
    -- OLD.passageiro_id refere-se ao passageiro_id da linha que foi deletada
    DELETE FROM searchIndex
    WHERE item_type = 'Passageiro' AND item_id = OLD.passageiro_id;
END;
