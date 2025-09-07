-- Up
-- Triggers para manter a tabela searchIndex atualizada com dados dos Veiculos

-- Trigger para INSERT: Adiciona um novo veículo ao índice de busca
CREATE TRIGGER after_veiculo_insert_add_to_search_index
AFTER INSERT ON Veiculos
FOR EACH ROW
BEGIN
    -- NEW é a nova linha adicionada à tabela Veiculos
    -- NEW.nome e NEW.veiculo_id são os valores da nova linha
    -- 'Veiculo' é o tipo de item constante indicando que é um veículo
    INSERT INTO searchIndex (search_text, item_type, item_id)
    VALUES (NEW.nome, 'Veiculo', NEW.veiculo_id);
END;

-- Trigger para UPDATE: Atualiza o índice de busca quando o nome do veículo muda
-- Executa após uma linha ser atualizada na tabela Veiculos
CREATE TRIGGER after_veiculo_update_update_search_index
AFTER UPDATE ON Veiculos
FOR EACH ROW
BEGIN
    -- Verifica se o nome (o texto pesquisável) realmente mudou
    IF OLD.nome <> NEW.nome THEN
        -- Encontra a entrada correspondente em searchIndex e atualiza seu search_text
        UPDATE searchIndex
        SET search_text = NEW.nome
        WHERE item_type = 'Veiculo' AND item_id = NEW.veiculo_id;
    END IF;
END;

-- Trigger para DELETE: Remove um veículo do índice de busca quando ele é deletado
-- Isso garante que o índice de busca não contenha entradas para itens inexistentes
-- Executa após uma linha ser deletada da tabela Veiculos
CREATE TRIGGER after_veiculo_delete_remove_from_search_index
AFTER DELETE ON Veiculos
FOR EACH ROW
BEGIN
    -- Remove a entrada de searchIndex correspondente ao veículo deletado
    -- OLD.veiculo_id refere-se a veiculo_id da linha que foi deletada
    DELETE FROM searchIndex
    WHERE item_type = 'Veiculo' AND item_id = OLD.veiculo_id;
END;
