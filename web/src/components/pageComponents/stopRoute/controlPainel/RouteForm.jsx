import React from 'react';

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
    className = "input-group-lg"
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
                    className={`form-select ${className.includes('lg') ? 'form-select-lg' : ''} is-valid`}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                >
                    {options?.map(option => (
                        <option key={option.status_rota_id} value={option.status_rota_id}>
                            {option.nome}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className={`form-control ${className.includes('lg') ? 'form-control-lg' : ''} ${value ? 'is-valid' : ''}`}
                    id={id}
                    value={value}
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
    </div>
);

function RouteForm({ formData, handleInputChange, statusOptions, instanceId }) {
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
                placeholder="Ex: Terminal Centro"
                maxLength={255}
                required
            />

            <FormField
                label="Descrição do Destino"
                icon="bi bi-geo-alt-fill"
                id={`destino_descricao-${instanceId}`}
                value={formData.destino_descricao}
                onChange={(value) => handleInputChange('destino_descricao', value)}
                placeholder="Ex: Terminal Bairro"
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
                options={statusOptions}
                required
            />
        </div>
    );
}

export default RouteForm;
