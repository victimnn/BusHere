-- Down
DROP TABLE IF EXISTS TipoResponsabilidade;

-- Up
CREATE TABLE TipoResponsabilidade (
    tipo_responsabilidade_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,

    INDEX idx_tipo_responsabilidade_ativo (ativo)
);


INSERT INTO TipoResponsabilidade (nome, descricao) 

VALUES 
    (
        'Mãe', 
        'Responsável legal por um passageiro menor de idade, como pai, mãe ou tutor legal. Necessário comprovar a relação através de documentos legais.' 
    ),
    
    (
        'Pai', 
        'Responsável legal por um passageiro menor de idade, como pai, mãe ou tutor legal. Necessário comprovar a relação através de documentos legais.' 
    ),

    (
        'Tutor Legal', 
        'Responsável legal por um passageiro menor de idade, como pai, mãe ou tutor legal. Necessário comprovar a relação através de documentos legais.' 
    );
