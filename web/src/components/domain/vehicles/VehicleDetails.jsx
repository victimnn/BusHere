import React from 'react';
import PropTypes from 'prop-types';
import DetailCard from '../../common/detail/DetailCard';
import { vehicleConfig } from '../../common/detail/detailConfigs';

function VehicleDetails({ vehicle, onEdit, onDelete }) {
  return (
    <DetailCard 
      item={vehicle}
      onEdit={onEdit}
      onDelete={onDelete}
      config={vehicleConfig}
    />
  );
}

VehicleDetails.propTypes = {
  vehicle: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default VehicleDetails;
