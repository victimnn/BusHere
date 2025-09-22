import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormField, PasswordField } from '../common';

/**
 * Componente da Etapa 1 do registro - Dados pessoais
 * Segue padrões de formulários identificados no projeto
 */
const RegisterStep1 = memo(({ 
  formData, 
  fieldErrors, 
  onInputChange, 
  onBlur, 
  loading 
}) => {
  return (
    <>
      {/* Dados de login */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
          DADOS DE ACESSO
        </h6>
        
        <FormField
          id="register-email"
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          required
          placeholder="seu@email.com"
          autoComplete="email"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.email}
        />

        <PasswordField
          id="register-password"
          label="Senha"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          onBlur={() => onBlur('password')}
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.password}
          helpText="Deve conter: maiúscula, minúscula e número"
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirmar senha"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          onBlur={() => onBlur('confirmPassword')}
          placeholder="Digite a senha novamente"
          required
          autoComplete="new-password"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.confirmPassword}
        />
      </div>

      {/* Dados pessoais */}
      <div className="mb-3">
        <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
          DADOS PESSOAIS
        </h6>
        
        <FormField
          id="register-nome"
          label="Nome completo"
          type="text"
          value={formData.nome}
          onChange={(e) => onInputChange('nome', e.target.value)}
          onBlur={() => onBlur('nome')}
          required
          placeholder="Seu nome completo"
          autoComplete="name"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.nome}
        />

        <div className="row gx-2">
          <div className="col-7">
            <FormField
              id="register-cpf"
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={(e) => onInputChange('cpf', e.target.value)}
              onBlur={() => onBlur('cpf')}
              required
              placeholder="000.000.000-00"
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.cpf}
              inputProps={{ maxLength: 14 }}
            />
          </div>
          <div className="col-5">
            <FormField
              id="register-data-nascimento"
              label="Nascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => onInputChange('dataNascimento', e.target.value)}
              onBlur={() => onBlur('dataNascimento')}
              required
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.dataNascimento}
              inputProps={{ 
                max: new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0],
                min: new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]
              }}
            />
          </div>
        </div>

        <FormField
          id="register-telefone"
          label="Telefone"
          type="tel"
          value={formData.telefone}
          onChange={(e) => onInputChange('telefone', e.target.value)}
          onBlur={() => onBlur('telefone')}
          required
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.telefone}
          inputProps={{ maxLength: 15 }}
        />
      </div>
    </>
  );
});

RegisterStep1.displayName = 'RegisterStep1';

RegisterStep1.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    cpf: PropTypes.string.isRequired,
    telefone: PropTypes.string.isRequired,
    dataNascimento: PropTypes.string.isRequired
  }).isRequired,
  fieldErrors: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default RegisterStep1;