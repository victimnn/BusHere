import React from 'react';
import MapComponent from '@web/components/ui/MapComponent';

const StopsMapSection = ({ 
  mapCenter, 
  zoom, 
  markers, 
  polylines, 
  onMapClick, 
  onZoomChange,
  isDark
}) => {
  return (
    <div className="col-lg-8 mb-3 mb-lg-0 stops-map-section">
      <div className="card border-0 shadow-sm h-100 d-flex flex-column">
        <div className="card-header bg-light py-2">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-map me-2"></i>
            Mapa dos Pontos
          </h6>
        </div>
        <div className="card-body p-0 d-flex flex-column flex-grow-1">
          <div className="flex-grow-1">
            <MapComponent 
              className="w-100 h-100"
              center={mapCenter}
              zoom={zoom}
              markers={markers}
              polylines={polylines}
              onMapClick={onMapClick} 
              handleZoomChange={onZoomChange}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopsMapSection;
