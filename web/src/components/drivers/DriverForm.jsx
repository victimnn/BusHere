import React from 'react';
import PropTypes from 'prop-types';
import GenericForm from '../common/form/GenericForm';
import { driverFormConfig } from '../common/form/formConfigs';

/**
 * Componente de formulário para criação e edição de motoristas
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @returns {JSX.Element}
 */
function DriverForm({ initialData, onSubmit, onCancel }) {
  return (
    <GenericForm
      config={driverFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

DriverForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DriverForm;
