import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormField } from '../common';

/**
 * Componente da Etapa 2 do registro - Dados de endereço
 * Segue padrões de formulários identificados no projeto
 */
const RegisterStep2 = memo(({ 
  formData, 
  fieldErrors, 
  onInputChange, 
  onBlur, 
  onCEPChange, 
  loading, 
  BRAZILIAN_STATES 
}) => {
  return (
    <div className="mb-3">
      <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
        ENDEREÇO
      </h6>
      
      <FormField
        id="register-cep"
        label="CEP"
        type="text"
        value={formData.cep}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\D/g, '');
          const formattedValue = rawValue.replace(/(\d{5})(\d)/, '$1-$2');
          onInputChange('cep', formattedValue);
          
          // Buscar CEP quando tiver 8 dígitos (sem formatação)
          if (rawValue.length === 8) {
            onCEPChange(formattedValue);
          }
        }}
        onBlur={() => onBlur('cep')}
        required
        placeholder="00000-000"
        disabled={loading}
        inputClassName="form-control-lg"
        error={fieldErrors.cep}
        inputProps={{ maxLength: 9 }}
        helpText="Digite para buscar automaticamente"
      />

      <FormField
        id="register-logradouro"
        label="Logradouro"
        type="text"
        value={formData.logradouro}
        onChange={(e) => onInputChange('logradouro', e.target.value)}
        onBlur={() => onBlur('logradouro')}
        required
        placeholder="Rua, Avenida, etc."
        disabled={loading}
        inputClassName="form-control-lg"
        error={fieldErrors.logradouro}
      />

      <div className="row gx-2">
        <div className="col-7">
          <FormField
            id="register-numero"
            label="Número"
            type="text"
            value={formData.numero}
            onChange={(e) => onInputChange('numero', e.target.value)}
            onBlur={() => onBlur('numero')}
            required
            placeholder="123"
            disabled={loading}
            inputClassName="form-control-lg"
            error={fieldErrors.numero}
          />
        </div>
        <div className="col-5">
          <FormField
            id="register-complemento"
            label="Compl."
            type="text"
            value={formData.complemento}
            onChange={(e) => onInputChange('complemento', e.target.value)}
            placeholder="Apt, etc."
            disabled={loading}
            inputClassName="form-control-lg"
          />
        </div>
      </div>

      <FormField
        id="register-bairro"
        label="Bairro"
        type="text"
        value={formData.bairro}
        onChange={(e) => onInputChange('bairro', e.target.value)}
        onBlur={() => onBlur('bairro')}
        required
        placeholder="Nome do bairro"
        disabled={loading}
        inputClassName="form-control-lg"
        error={fieldErrors.bairro}
      />

      <div className="row gx-2">
        <div className="col-8">
          <FormField
            id="register-cidade"
            label="Cidade"
            type="text"
            value={formData.cidade}
            onChange={(e) => onInputChange('cidade', e.target.value)}
            onBlur={() => onBlur('cidade')}
            required
            placeholder="Nome da cidade"
            disabled={loading}
            inputClassName="form-control-lg"
            error={fieldErrors.cidade}
          />
        </div>
        <div className="col-4">
          <div className="mb-3">
            <label htmlFor="register-uf" className="form-label font-family-segundaria">
              UF <span className="text-danger ms-1">*</span>
            </label>
            <select
              id="register-uf"
              className={`form-select form-control-lg ${fieldErrors.uf ? 'is-invalid' : ''}`}
              value={formData.uf}
              onChange={(e) => onInputChange('uf', e.target.value)}
              onBlur={() => onBlur('uf')}
              required
              disabled={loading}
            >
              <option value="">UF</option>
              {BRAZILIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.value}
                </option>
              ))}
            </select>
            {fieldErrors.uf && (
              <div className="invalid-feedback d-block">
                <i className="bi bi-exclamation-circle me-1"></i>
                {fieldErrors.uf}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

RegisterStep2.displayName = 'RegisterStep2';

RegisterStep2.propTypes = {
  formData: PropTypes.shape({
    cep: PropTypes.string.isRequired,
    logradouro: PropTypes.string.isRequired,
    numero: PropTypes.string.isRequired,
    complemento: PropTypes.string.isRequired,
    bairro: PropTypes.string.isRequired,
    cidade: PropTypes.string.isRequired,
    uf: PropTypes.string.isRequired
  }).isRequired,
  fieldErrors: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCEPChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  BRAZILIAN_STATES: PropTypes.array.isRequired
};

export default RegisterStep2;