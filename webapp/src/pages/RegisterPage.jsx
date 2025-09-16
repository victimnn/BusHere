import React from 'react';
import { 
  RegisterHeader,
  RegisterStep1,
  RegisterStep2,
  RegisterNavigation,
  RegisterFooter,
  AuthErrorAlert
} from '../components/common';
import AuthSuccessAlert from '../components/auth/AuthSuccessAlert';
import RegistrationStatusAlert from '../components/auth/RegistrationStatusAlert';
import RegistrationSuccessModal from '../components/auth/RegistrationSuccessModal';
import { useRegister } from '../hooks';

function RegisterPage() {
  const {
    currentStep,
    loading,
    error,
    success,
    registrationStatus,
    showSuccessModal,
    formData,
    fieldErrors,
    isStep1Valid,
    isStep2Valid,
    handleInputChange,
    handleBlur,
    fetchAddressByCEP,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    goBack,
    clearError,
    clearFeedback,
    BRAZILIAN_STATES
  } = useRegister();

  const getStepTitle = () => {
    if (currentStep === 1) {
      return (
        <>Crie sua conta para usar o <span className="text-success">BusHere!</span></>
      );
    }
    return (

      <>Quase lá! Complete seu <span className="text-success">endereço</span></>
    );
  };

  const getStepSubtitle = () => {
    return currentStep === 1 
      ? "Preencha seus dados para continuar"
      : "Finalize seu cadastro com o endereço";
  };

  return (
    <div className="register-container min-vh-100">
      <div className="register-card w-100">
        <div className="px-3 py-4 px-md-4 py-md-5">
          {/* Header Mobile-First */}
          <RegisterHeader
            currentStep={currentStep}
            title={getStepTitle()}
            subtitle={getStepSubtitle()}
            onBack={goBack}
            onPrevStep={handlePrevStep}
            loading={loading}
          />
          {/* Alert de erro mobile-friendly */}
          <AuthErrorAlert 
            error={error} 
            onClose={clearError}
          />

          {/* Alert de sucesso */}
          <AuthSuccessAlert 
            message={success} 
            onClose={clearFeedback}
            autoClose={false}
          />

          {/* Status do registro com feedback visual */}
          <RegistrationStatusAlert
            status={registrationStatus}
            onClose={clearFeedback}
            showProgress={true}
          />

          {/* Formulário Mobile-First */}
          {currentStep === 1 ? (
            <RegisterStep1
              formData={formData}
              fieldErrors={fieldErrors}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              loading={loading}
            />
          ) : (
            <RegisterStep2
              formData={formData}
              fieldErrors={fieldErrors}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              onCEPChange={fetchAddressByCEP}
              loading={loading}
              BRAZILIAN_STATES={BRAZILIAN_STATES}
            />
          )}

          {/* Navegação entre etapas */}
          <RegisterNavigation
            currentStep={currentStep}
            isStep1Valid={isStep1Valid}
            isStep2Valid={isStep2Valid}
            loading={loading}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onSubmit={handleSubmit}
          />

          {/* Footer mobile-friendly */}
          <RegisterFooter currentStep={currentStep} />
        </div>
      </div>

      {/* Modal de sucesso com celebração */}
      <RegistrationSuccessModal
        isVisible={showSuccessModal}
        onClose={clearFeedback}
        userName={formData.nome}
      />
    </div>
  );
}

export default RegisterPage;