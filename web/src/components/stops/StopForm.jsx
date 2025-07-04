import React from 'react';
import PropTypes from 'prop-types';
import GenericForm from '../common/form/GenericForm';
import { stopFormConfig } from '../common/form/formConfigs';

/**
 * Componente de formulário para criação e edição de paradas
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @param {Function} props.onDelete - Função chamada ao deletar (opcional)
 * @param {boolean} props.showDeleteButton - Se deve mostrar o botão de deletar
 * @returns {JSX.Element}
 */
function StopForm({ initialData, onSubmit, onCancel, onDelete, showDeleteButton = false }) {
  return (
    <GenericForm
      config={stopFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
      showDeleteButton={showDeleteButton}
    />
  );
}

StopForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showDeleteButton: PropTypes.bool
};

export default StopForm;
