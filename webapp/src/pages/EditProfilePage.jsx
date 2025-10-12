import React from 'react';
import { useEditProfile } from '../hooks';
import { globalKeyframes } from '../styles/animations';
import {
  EditProfileHeader,
  FormInputGroup,
  FormSection,
  FormSelectGroup,
  ToggleSwitch,
  SuccessModal,
  AlertMessage,
  FormActionButtons,
  PasswordInputGroup
} from '../components';

function EditProfilePage() {
  const {
    loading,
    error,
    success,
    showSuccessModal,
    isLoadingCep,
    formData,
    fieldErrors,
    isFormValid,
    handleInputChange,
    handleBlur,
    fetchAddressByCEP,
    handleSubmit,
    handleCancel,
    clearError,
    clearFeedback,
    BRAZILIAN_STATES
  } = useEditProfile();

  const handleCEPBlur = () => {
    handleBlur('cep');
    if (formData.cep && formData.cep.length >= 8) {
      fetchAddressByCEP(formData.cep);
    }
  };

  return (
    <div className="account-page edit-profile-page p-0">
      <EditProfileHeader onBack={handleCancel} loading={loading} />

      <div className="container-fluid px-3">
        {/* Alertas */}
        {error && (
          <AlertMessage
            type="danger"
            message={error}
            onClose={clearError}
          />
        )}

        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={clearFeedback}
          />
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Seção: Dados Pessoais */}
          <FormSection
            title="Dados Pessoais"
            icon="person-fill"
            iconGradient="linear-gradient(135deg, var(--bs-primary) 0%, #0E8F3A 100%)"
          >
            <FormInputGroup
              id="nome"
              label="Nome Completo"
              icon="person"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              onBlur={() => handleBlur('nome')}
              placeholder="Seu nome completo"
              required
              disabled={loading}
              error={fieldErrors.nome}
            />

            <FormInputGroup
              id="email"
              label="E-mail"
              icon="envelope"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="seu@email.com"
              required
              disabled={loading}
              error={fieldErrors.email}
            />

            <FormInputGroup
              id="telefone"
              label="Telefone"
              icon="telephone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              onBlur={() => handleBlur('telefone')}
              placeholder="(00) 00000-0000"
              required
              disabled={loading}
              error={fieldErrors.telefone}
            />

            <div className="col-12">
              <ToggleSwitch
                id="pcd"
                label="Pessoa com Deficiência"
                description="Marque se você é PCD"
                icon="universal-access"
                iconGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                checked={formData.pcd}
                onChange={(value) => handleInputChange('pcd', value)}
                disabled={loading}
              />
            </div>
          </FormSection>

          {/* Seção: Alterar Senha */}
          <FormSection
            title="Alterar Senha"
            icon="key-fill"
            iconGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            description="Deixe em branco para manter a senha atual"
          >
            <PasswordInputGroup
              id="password"
              label="Nova Senha"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
              error={fieldErrors.password}
              helpText="Mínimo 8 caracteres com letras maiúsculas, minúsculas e números"
            />

            {formData.password && (
              <PasswordInputGroup
                id="confirmPassword"
                label="Confirmar Nova Senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirme a nova senha"
                disabled={loading}
                error={fieldErrors.confirmPassword}
              />
            )}
          </FormSection>

          {/* Seção: Endereço */}
          <FormSection
            title="Endereço"
            icon="geo-alt-fill"
            iconGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          >
            <FormInputGroup
              id="cep"
              label="CEP"
              icon="mailbox"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              onBlur={handleCEPBlur}
              placeholder="00000-000"
              required
              disabled={loading}
              maxLength="9"
              error={fieldErrors.cep}
              helpText="O endereço será preenchido automaticamente"
              isLoading={isLoadingCep}
            />

            <FormInputGroup
              id="logradouro"
              label="Logradouro"
              icon="signpost"
              value={formData.logradouro}
              onChange={(e) => handleInputChange('logradouro', e.target.value)}
              onBlur={() => handleBlur('logradouro')}
              placeholder="Rua, Avenida, etc."
              required
              disabled={loading}
              error={fieldErrors.logradouro}
            />

            <FormInputGroup
              id="numero"
              label="Número"
              icon="hash"
              value={formData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
              onBlur={() => handleBlur('numero')}
              placeholder="123"
              required
              disabled={loading}
              error={fieldErrors.numero}
              colSize="col-5"
            />

            <FormInputGroup
              id="complemento"
              label="Complemento"
              icon="building"
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              onBlur={() => handleBlur('complemento')}
              placeholder="Apto, Bloco"
              disabled={loading}
              colSize="col-7"
            />

            <FormInputGroup
              id="bairro"
              label="Bairro"
              icon="map"
              value={formData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              onBlur={() => handleBlur('bairro')}
              placeholder="Nome do bairro"
              required
              disabled={loading}
              error={fieldErrors.bairro}
            />

            <FormInputGroup
              id="cidade"
              label="Cidade"
              icon="geo-alt"
              value={formData.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              onBlur={() => handleBlur('cidade')}
              placeholder="Cidade"
              required
              disabled={loading}
              error={fieldErrors.cidade}
              colSize="col-7"
            />

            <FormSelectGroup
              id="uf"
              label="UF"
              icon="flag"
              value={formData.uf}
              onChange={(e) => handleInputChange('uf', e.target.value)}
              onBlur={() => handleBlur('uf')}
              options={BRAZILIAN_STATES}
              placeholder="UF"
              required
              disabled={loading}
              error={fieldErrors.uf}
              colSize="col-5"
            />
          </FormSection>

          {/* Botões de Ação */}
          <div className="row g-3 mb-3">
            <div className="col-12">
              <div className="d-grid gap-2">
                <FormActionButtons
                  type="submit"
                  label="Salvar Alterações"
                  icon="bi-check-circle-fill"
                  loading={loading}
                  disabled={!isFormValid}
                  loadingText="Salvando alterações..."
                  variant="primary"
                />
                
                <FormActionButtons
                  type="button"
                  onClick={handleCancel}
                  label="Cancelar"
                  icon="bi-x-circle"
                  disabled={loading}
                  variant="danger"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="security-footer">
          <small>
            <i className="bi bi-shield-lock me-1"></i>
            Suas informações estão protegidas e seguras
          </small>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <SuccessModal
        show={showSuccessModal}
        title="Perfil Atualizado!"
        message="Suas informações foram salvas com sucesso."
        subtitle="Redirecionando em instantes..."
      />

      {/* Animações CSS */}
      <style>{globalKeyframes}</style>
    </div>
  );
}

export default EditProfilePage;
