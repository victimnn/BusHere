import React from 'react';
import PropTypes from 'prop-types';
import { DetailCard } from '@web/components/common';
import { routeConfig } from '@web/components/common/detail/detailConfigs';

function RouteDetails({ route, onEdit, onDelete }) {
  return (
    <DetailCard 
      item={route}
      onEdit={onEdit}
      onDelete={onDelete}
      config={routeConfig}
    />
  );
}

RouteDetails.propTypes = {
  route: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RouteDetails;
