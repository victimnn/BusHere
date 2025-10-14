import React from 'react';
import PropTypes from 'prop-types';
import DetailCard from '../../common/detail/DetailCard';
import { notificationConfig } from '../../common/detail/detailConfigs';

function NotificationDetails({ notification, onEdit, onDelete }) {
  const adjustedConfig = {
    ...notificationConfig,
    idField: notification?.id ? "id" : "aviso_id"
  };

  return (
    <DetailCard 
      item={notification}
      onEdit={onEdit}
      onDelete={onDelete}
      config={adjustedConfig}
    />
  );
}

NotificationDetails.propTypes = {
  notification: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default NotificationDetails;
