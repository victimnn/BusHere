import React from 'react';
import PropTypes from 'prop-types';
import DetailCard from '../../common/detail/DetailCard';
import { busConfig } from '../../common/detail/detailConfigs';

function BusDetails({ bus, onEdit, onDelete }) {
  return (
    <DetailCard 
      item={bus}
      onEdit={onEdit}
      onDelete={onDelete}
      config={busConfig}
    />
  );
}

BusDetails.propTypes = {
  bus: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BusDetails;
