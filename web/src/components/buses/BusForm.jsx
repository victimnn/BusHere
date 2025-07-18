import React from 'react';
import PropTypes from 'prop-types';
import GenericForm from '../common/form/GenericForm';
import { busFormConfig } from '../common/form/formConfigs';

/**
 * Componente de formulário para criação e edição de ônibus
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @param {boolean} props.isCreateForm - Se é um formulário de criação (opcional)
 * @returns {JSX.Element}
 */
function BusForm({ initialData, onSubmit, onCancel, isCreateForm = null }) {
  return (
    <GenericForm
      config={busFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isCreateForm={isCreateForm}
    />
  );
}

BusForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCreateForm: PropTypes.bool
};

export default BusForm;