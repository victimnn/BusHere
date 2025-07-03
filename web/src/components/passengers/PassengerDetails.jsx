import React from 'react';
import PropTypes from 'prop-types';
import DetailCard from '../common/detail/DetailCard';
import { passengerConfig } from '../common/detail/detailConfigs';

function PassengerDetails({ passenger, onEdit, onDelete }) {
  // Ajustar a configuração baseada na estrutura do objeto passageiro
  const adjustedConfig = {
    ...passengerConfig,
    idField: passenger?.id ? "id" : "passageiro_id"
  };

  return (
    <DetailCard 
      item={passenger}
      onEdit={onEdit}
      onDelete={onDelete}
      config={adjustedConfig}
    />
  );
}

PassengerDetails.propTypes = {
  passenger: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PassengerDetails;
