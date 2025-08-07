import React from 'react';
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
    <div className="p-4">
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
        <button 
          className="btn btn-primary btn-lg px-4 py-2"
          onClick={handleCreateClick}
        >
          <i className="bi bi-plus-circle me-2"></i>
          <span>Criar Ponto</span>
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary btn-lg px-4 py-2" 
          onClick={onCancel}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default MapClickPopup;
