import React, { useState, useEffect } from 'react';
import { useFormattedBusOptions, useFormattedDriverOptions } from '../../../../hooks/useFormOptions';

const FormField = ({ 
    label, 
    icon, 
    id, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    maxLength, 
    required = false,
    readOnly = false,
    options = null,
    step,
    min,
    className = "input-group-lg",
    rows,
    error = null
}) => (
    <div className="mb-4">
        <label htmlFor={id} className="form-label fw-semibold">
            <i className={`${icon} me-2 text-primary`}></i>
            {label}
            {required && <span className="text-danger ms-1">*</span>}
        </label>
        <div className={`input-group ${className}`}>
            <span className="input-group-text bg-light">
                <i className={icon}></i>
            </span>
            {type === 'select' ? (
                <select
                    className={`form-select ${className.includes('lg') ? 'form-select-lg' : ''} ${
                        error ? 'is-invalid' : (value ? 'is-valid' : '')
                    }`}
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
                >
                    <option value="">{placeholder}</option>
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    className={`form-control ${className.includes('lg') ? 'form-control-lg' : ''} ${
                        error ? 'is-invalid' : (value ? 'is-valid' : '')
                    }`}
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows || 3}
                    readOnly={readOnly}
                />
            ) : (
                <input
                    type={type}
                    className={`form-control ${className.includes('lg') ? 'form-control-lg' : ''} ${
                        error ? 'is-invalid' : (value ? 'is-valid' : '')
                    }`}
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(type === 'number' ? 
                        (step ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0) : 
                        e.target.value
                    )}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    step={step}
                    min={min}
                    readOnly={readOnly}
                />
            )}
        </div>
        {error && (
            <div className="invalid-feedback d-block">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
            </div>
        )}
    </div>
);

function RouteForm({ formData, handleInputChange, statusOptions, instanceId }) {
    // Usar hooks customizados para carregar opções filtradas
    const { options: busOptions, loading: loadingBuses } = useFormattedBusOptions();
    const { options: driverOptions, loading: loadingDrivers } = useFormattedDriverOptions();
    
    // Estados para gerenciar erros de validação
    const [errors, setErrors] = useState({});
    
    // Função para validar os campos
    const validateFields = () => {
        const newErrors = {};
        
        // Se ônibus foi selecionado, motorista é obrigatório
        if (formData.onibus_id && !formData.motorista_id) {
            newErrors.motorista_id = 'Motorista é obrigatório quando um ônibus é selecionado';
        }
        
        // Se motorista foi selecionado, ônibus é obrigatório
        if (formData.motorista_id && !formData.onibus_id) {
            newErrors.onibus_id = 'Ônibus é obrigatório quando um motorista é selecionado';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Validar sempre que os valores mudarem
    useEffect(() => {
        validateFields();
    }, [formData.onibus_id, formData.motorista_id]);

    return (
        <div className="mb-4">
            <FormField
                label="Nome da Rota"
                icon="bi bi-text-left"
                id={`nome-${instanceId}`}
                value={formData.nome}
                onChange={(value) => handleInputChange('nome', value)}
                placeholder="Ex: Linha Centro - Bairro"
                maxLength={255}
                required
            />
            
            <FormField
                label="Código da Rota"
                icon="bi bi-hash"
                id={`codigo_rota-${instanceId}`}
                value={formData.codigo_rota}
                onChange={(value) => handleInputChange('codigo_rota', value)}
                placeholder="Ex: R001"
                maxLength={20}
                required
            />

            <FormField
                label="Descrição da Origem"
                icon="bi bi-geo-alt"
                id={`origem_descricao-${instanceId}`}
                value={formData.origem_descricao}
                onChange={(value) => handleInputChange('origem_descricao', value)}
                placeholder="Será preenchido automaticamente com o primeiro ponto"
                maxLength={255}
                required
            />

            <FormField
                label="Descrição do Destino"
                icon="bi bi-geo-alt-fill"
                id={`destino_descricao-${instanceId}`}
                value={formData.destino_descricao}
                onChange={(value) => handleInputChange('destino_descricao', value)}
                placeholder="Será preenchido automaticamente com o último ponto"
                maxLength={255}
                required
            />

            <div className="row mb-4">
                <div className="col-6">
                    <FormField
                        label="Distância (km)"
                        icon="bi bi-speedometer"
                        id={`distancia_km-${instanceId}`}
                        type="number"
                        value={formData.distancia_km}
                        onChange={(value) => handleInputChange('distancia_km', value)}
                        step="0.01"
                        min="0"
                        readOnly
                        className=""
                    />
                </div>
                <div className="col-6">
                    <FormField
                        label="Tempo (min)"
                        icon="bi bi-clock"
                        id={`tempo_viagem_estimado_minutos-${instanceId}`}
                        type="number"
                        value={formData.tempo_viagem_estimado_minutos}
                        onChange={(value) => handleInputChange('tempo_viagem_estimado_minutos', value)}
                        min="0"
                        readOnly
                        className=""
                    />
                </div>
            </div>

            <FormField
                label="Status da Rota"
                icon="bi bi-check2-circle"
                id={`status_rota_id-${instanceId}`}
                type="select"
                value={formData.status_rota_id}
                onChange={(value) => handleInputChange('status_rota_id', value)}
                options={statusOptions?.map(status => ({
                    value: status.status_rota_id,
                    label: status.nome
                })) || []}
                placeholder="Selecione o status"
                required
            />

            {/* Seção de Associação Ônibus-Motorista */}
            <div className="card mt-4">
                <div className="card-header bg-light">
                    <h6 className="mb-0 text-primary">
                        <i className="bi bi-truck me-2"></i>
                        Associação Ônibus e Motorista
                    </h6>
                </div>
                <div className="card-body">
                    <FormField
                        label="Ônibus"
                        icon="bi bi-bus-front"
                        id={`onibus_id-${instanceId}`}
                        type="select"
                        value={formData.onibus_id}
                        onChange={(value) => handleInputChange('onibus_id', value)}
                        options={busOptions}
                        placeholder={loadingBuses ? "Carregando ônibus..." : "Selecione um ônibus"}
                        required={formData.motorista_id ? true : false}
                        error={errors.onibus_id}
                    />

                    <FormField
                        label="Motorista"
                        icon="bi bi-person-badge"
                        id={`motorista_id-${instanceId}`}
                        type="select"
                        value={formData.motorista_id}
                        onChange={(value) => handleInputChange('motorista_id', value)}
                        options={driverOptions}
                        placeholder={loadingDrivers ? "Carregando motoristas..." : "Selecione um motorista"}
                        required={formData.onibus_id ? true : false}
                        error={errors.motorista_id}
                    />

                    <FormField
                        label="Observações da Associação"
                        icon="bi bi-chat-text"
                        id={`observacoes_assignment-${instanceId}`}
                        type="textarea"
                        value={formData.observacoes_assignment}
                        onChange={(value) => handleInputChange('observacoes_assignment', value)}
                        placeholder="Observações sobre a associação do ônibus e motorista com esta rota"
                        maxLength={500}
                        rows={3}
                        required={false}
                    />

                    {(errors.onibus_id || errors.motorista_id) && (
                        <div className="alert alert-warning mt-2">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Para uma associação completa, selecione tanto o ônibus quanto o motorista.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RouteForm;
