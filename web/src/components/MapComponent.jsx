import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapClickHandler({ onMapClick }) {
  useMapEvent('click', (e) => {
    onMapClick(e.latlng);
  });
  return null;
}

const iconCache = new Map();

function getColoredIcon(color = 'blue', size = 32, zoom = 13) {
  const zoomInfluence = Math.min(13, zoom);

  const newSize = size * (zoomInfluence / 13)**2; 
  let borderSize = newSize > 16 ? 2 : 1;
  if (newSize < 8) {
    borderSize = 0;
  }

  const cacheKey = `${color}-${newSize}`;
  if (iconCache.has(cacheKey)) {
    console.log("icone com cache", color, size, zoom, newSize);
    return iconCache.get(cacheKey);
  } 

  // Se o icone não estiver no cache, cria um novo
  console.log("icone sem cache", color, size, zoom, newSize);
  const icon = L.divIcon({
    className: '',
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="${newSize}" height="${newSize}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="${borderSize}"/>
    </svg>
    `,
    iconSize: [newSize, newSize],
    iconAnchor: [newSize/2, newSize],
    popupAnchor: [0, -newSize],
  });

  iconCache.set(cacheKey, icon);
  return icon
}

// Add a component to handle zoom change event
function ZoomChangeHandler({ handleZoomChange }) {
  const map = useMap();
  useEffect(() => {
    if (!handleZoomChange) return;
    map.on('zoomend', handleZoomChange);
    return () => {
      map.off('zoomend', handleZoomChange);
    };
  }, [map, handleZoomChange]);

  return null;
}

function MapComponent({ center, zoom = 13, markers = [], polylines = [], onMapClick = null, onMarkerClick = null, className = '', handleZoomChange = null }) {
  const maxBounds = [
    [-90, -180], // Southwest (lat, lng) - whole world
    [90, 180],   // Northeast (lat, lng)
  ];

  return (
    <div className={`map-container-wrapper ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={3} // Set your minimum zoom
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        className="w-100 h-100"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {/* For each markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index} 
            position={marker.position} 
            icon={getColoredIcon(marker.color, marker.size, zoom)} 
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
        {/* Zoom change handler */}
        {handleZoomChange && <ZoomChangeHandler handleZoomChange={handleZoomChange} />}

        {/* Adicione mais marcadores ou polylines para rotas conforme necessário */}
      </MapContainer>
    </div>
  );
}

export default MapComponent;