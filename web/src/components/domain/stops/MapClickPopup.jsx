import React from 'react';
import { ActionButton } from '@web/components/common';
import api from '@web/api/api';

const MapClickPopup = ({ latlng, onCreateStop, onCancel }) => {
  const handleCreateClick = async () => {
    onCancel(); // Fecha o popup atual
    
    try {
      const data = await api.geolocation.getInfoFromCoordinates(latlng.lat, latlng.lng);
      
      const initialData = {
        latitude: latlng.lat,
        longitude: latlng.lng,
        logradouro: data.road || '',
        bairro: data.suburb || '',
        cidade: data.city || '',
        uf: data.uf || '',
        cep: data.cep || '',
      };
      
      console.log('🗺️ Dados obtidos do mapa + geolocalização:', initialData);
      onCreateStop(initialData);
    } catch (error) {
      console.warn('⚠️ API de geolocalização falhou, usando apenas coordenadas:', error.message);
      
      // Se a API de geolocalização falhar, criar com apenas as coordenadas
      const initialData = {
        latitude: latlng.lat,
        longitude: latlng.lng,
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
      };
      
      console.log('🗺️ Dados fallback (apenas coordenadas):', initialData);
      onCreateStop(initialData);
    }
  };

  return (
    <div className="p-4 map-click-popup">
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-geo-alt-fill text-primary fs-1"></i>
        </div>
        
        <h5 className="mb-2 fw-bold text-dark">
          Novo Ponto de Parada
        </h5>

        <div className="bg-light rounded-pill px-3 py-2 d-inline-block">
          <i className="bi bi-compass me-2 text-primary"></i>
          <span className="font-monospace text-dark">
            {latlng.lat.toFixed(6)}, {latlng.lng.toFixed(6)}
          </span>
        </div>
      </div>
      
      <div className="d-flex gap-3 justify-content-center">
        <ActionButton
          onClick={handleCreateClick}
          icon="bi bi-plus-circle"
          text="Criar Ponto"
          variant="primary"
          size="lg"
          className="px-4 py-2"
        />
        <ActionButton
          onClick={onCancel}
          icon="bi bi-x-circle"
          text="Cancelar"
          variant="outline-secondary"
          size="lg"
          className="px-4 py-2"
        />
      </div>
    </div>
  );
};

export default MapClickPopup;
