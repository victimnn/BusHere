import React from 'react';
import PropTypes from 'prop-types';
import DetailCard from '../common/detail/DetailCard';
import { driverConfig } from '../common/detail/detailConfigs';

function DriverDetails({ driver, onEdit, onDelete }) {
  // Ajustar a configuração baseada na estrutura do objeto motorista
  const adjustedConfig = {
    ...driverConfig,
    idField: driver?.id ? "id" : "motorista_id"
  };

  return (
    <DetailCard 
      item={driver}
      onEdit={onEdit}
      onDelete={onDelete}
      config={adjustedConfig}
    />
  );
}

DriverDetails.propTypes = {
  driver: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DriverDetails;
