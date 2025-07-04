-- Down
DROP TABLE IF EXISTS DetalhesContrato;

-- Up
-- Tabela para detalhes da assinatura digital de contratos
CREATE TABLE DetalhesContrato (
    detalhe_contrato_id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT NOT NULL UNIQUE COMMENT 'FK para Contrato, garantindo um detalhe por contrato',
    provedor_assinatura VARCHAR(100) COMMENT 'Ex: ClickSign, DocuSign [cite: 32]',
    documento_externo_id VARCHAR(255) COMMENT 'ID do documento no sistema do provedor',
    url_visualizacao_assinatura VARCHAR(512) COMMENT 'URL para o passageiro assinar/visualizar',
    status_assinatura_provedor VARCHAR(50) COMMENT 'Status retornado pelo provedor',
    data_envio_para_assinatura TIMESTAMP NULL,
    data_ultima_atualizacao_status TIMESTAMP NULL,
    caminho_documento_assinado VARCHAR(512) COMMENT 'Caminho ou URL do documento final assinado',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES Contratos(contrato_id),

    INDEX idx_contrato_id (contrato_id),
    INDEX idx_provedor_assinatura (provedor_assinatura),
    INDEX idx_status_assinatura_provedor (status_assinatura_provedor)
);