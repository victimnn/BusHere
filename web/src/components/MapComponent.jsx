import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapClickHandler({ onMapClick }) {
  useMapEvent('click', (e) => {
    onMapClick(e.latlng);
  });
  return null;
}

function getColoredIcon(color = 'blue', size = 32) {
  return L.divIcon({
    className: '',
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="2"/>
    </svg>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
  });
}

function MapComponent({ center, zoom = 13, markers = [], polylines = [], onMapClick = null, onMarkerClick = null, className = '' }) {

  return (
    <div className={`map-container-wrapper ${className}`}> {/* Um wrapper para controlar o tamanho */}
      <MapContainer center={center} zoom={zoom} className="w-100 h-100">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* For each markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index} 
            position={marker.position} 
            icon={getColoredIcon(marker.color, marker.size)} 
            eventHandlers={ 
              // Se tem onMarkerClick, adiciona o handler de clique
              onMarkerClick ? { click: (e) => onMarkerClick(marker, e),} : undefined
            }
          >
            {marker.popupContent && <Popup>{marker.popupContent}</Popup> /* Se o marcador tiver conteúdo de popup, exibe */}
          </Marker>
        ))}

        {/* For each das polylines */}
        {polylines.map((polyline, index) => ( 
          <Polyline key={index} positions={polyline.positions} color={polyline.color} />
        ))}

        {/* Se onMapClick for fornecido, adiciona o handler de clique no mapa */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Adicione mais marcadores ou polylines para rotas conforme necessário */}
      </MapContainer>
    </div>
  );
}

export default MapComponent;