import React from 'react';
import PropTypes from 'prop-types';
import GenericForm from '../../common/forms/GenericForm';
import { stopFormConfig } from '../../common/form/formConfigs';

/**
 * Componente de formulário para criação e edição de paradas
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @param {Function} props.onDelete - Função chamada ao deletar (opcional)
 * @param {boolean} props.showDeleteButton - Se deve mostrar o botão de deletar
 * @param {boolean} props.isCreateForm - Se é um formulário de criação (opcional)
 * @returns {JSX.Element}
 */
function StopForm({ initialData, onSubmit, onCancel, onDelete, showDeleteButton = false, isCreateForm = null }) {
  return (
    <GenericForm
      config={stopFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
      showDeleteButton={showDeleteButton}
      isCreateForm={isCreateForm}
    />
  );
}

StopForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  isCreateForm: PropTypes.bool
};

export default StopForm;
