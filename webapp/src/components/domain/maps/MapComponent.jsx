import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
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
    return iconCache.get(cacheKey);
  } 

  // Se o icone não estiver no cache, cria um novo
  const icon = L.divIcon({
    className: '',
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="${newSize}" height="${newSize}" viewBox="0 0 24 24">
      <defs>
        <filter id="shadow${newSize}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="9" fill="${color}" stroke="white" stroke-width="${borderSize + 1}" filter="url(#shadow${newSize})"/>
      <circle cx="12" cy="12" r="5" fill="rgba(255,255,255,0.3)"/>
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

// Component to handle popup control
function PopupController({ onPopupClose }) {
  const map = useMap();
  
  useEffect(() => {
    if (!onPopupClose) return;
    
    const handlePopupClose = () => {
      onPopupClose();
    };

    map.on('popupclose', handlePopupClose);
    return () => {
      map.off('popupclose', handlePopupClose);
    };
  }, [map, onPopupClose]);

  return null;
}

// Component to expose map methods to parent
function MapRef({ onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

// Component to handle center changes
function CenterChangeHandler({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length >= 2 && typeof zoom === 'number') {
      const [lat, lng] = center;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], zoom);
      } else {
        console.error('Coordenadas inválidas para setView:', { lat, lng, zoom });
      }
    }
  }, [map, center, zoom]);
  return null;
}

const MapComponent = forwardRef(({ 
  center, 
  zoom = 13, 
  markers = [], 
  polylines = [], 
  onMapClick = null, 
  onMarkerClick = null, 
  className = '', 
  handleZoomChange = null,
  onPopupClose = null
}, ref) => {
  const [mapInstance, setMapInstance] = useState(null);

  // Expose map methods to parent component
  useImperativeHandle(ref, () => ({
    closePopup: () => {
      if (mapInstance) {
        mapInstance.closePopup();
      }
    }
  }), [mapInstance]);

  const maxBounds = [
    [-90, -180], // Southwest (lat, lng) - whole world
    [90, 180],   // Northeast (lat, lng)
  ];

  // Usando apenas OpenStreetMap padrão
  const tileConfig = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  };

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
        zoomControl={false}
      >
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
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
            {marker.popupContent && (
              <Popup 
                className="custom-popup"
                closeButton={true}
                autoPan={true}
                maxWidth={420}
                minWidth={300}
              >
                {marker.popupContent}
              </Popup>
            )}
          </Marker>
        ))}

        {/* For each das polylines */}
        {polylines.map((polyline, index) => ( 
          <Polyline 
            key={index} 
            positions={polyline.positions} 
            color={polyline.color}
            weight={polyline.weight || 3}
            opacity={polyline.opacity || 0.7}
            dashArray={polyline.dashArray}
          />
        ))}

        {/* Se onMapClick for fornecido, adiciona o handler de clique no mapa */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {/* Zoom change handler */}
        {handleZoomChange && <ZoomChangeHandler handleZoomChange={handleZoomChange} />}
        {/* Popup controller */}
        <PopupController onPopupClose={onPopupClose} />
        {/* Map ref component */}
        <MapRef onMapReady={setMapInstance} />
        {/* Center change handler */}
        <CenterChangeHandler center={center} zoom={zoom} />

        {/* Adicione mais marcadores ou polylines para rotas conforme necessário */}
      </MapContainer>
    </div>
  );
});

export default MapComponent;