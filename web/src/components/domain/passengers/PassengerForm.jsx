import React from 'react';
import PropTypes from 'prop-types';
import GenericForm from '../../common/forms/GenericForm';
import { passengerFormConfig, passengerEditFormConfig } from '../../common/form/formConfigs';

/**
 * Componente de formulário para criação e edição de passageiros
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @param {boolean} props.isCreateForm - Se é um formulário de criação (opcional)
 * @returns {JSX.Element}
 */
function PassengerForm({ initialData, onSubmit, onCancel, isCreateForm = null }) {
  // Determina se é um formulário de edição baseado na presença de initialData
  const isEditMode = initialData && Object.keys(initialData).length > 0;
  
  // Usa configuração específica para edição se estiver em modo de edição
  const config = isEditMode ? passengerEditFormConfig : passengerFormConfig;
  
  return (
    <GenericForm
      config={config}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isCreateForm={isCreateForm}
      steps={config.steps}
    />
  );
}

PassengerForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCreateForm: PropTypes.bool
};

export default PassengerForm;
