import React from 'react';
import PropTypes from 'prop-types';
import { DetailCard } from '@web/components/common';
import { stopConfig } from '@web/components/common/detail/detailConfigs';

function StopDetails({ stop, onEdit = () => {}, onDelete = () => {} }) {
  // Debug para verificar os dados recebidos
  console.log("StopDetails - stop data:", stop);
  
  // Ajustar a configuração baseada na estrutura do objeto passageiro
  const adjustedConfig = {
    ...stopConfig,
    idField: stop?.id ? "id" : "ponto_id"
  };

  console.log("StopDetails - adjustedConfig:", adjustedConfig);

  return (
    <DetailCard 
      item={stop}
      onEdit={onEdit}
      onDelete={onDelete}
      config={adjustedConfig}
    />
  );
}

StopDetails.propTypes = {
  stop: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default StopDetails;
