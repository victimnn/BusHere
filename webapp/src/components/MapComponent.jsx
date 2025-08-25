import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Estilos customizados para o mapa
const mapStyles = `
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px 0px 0px 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #e9ecef;
  }
  
  .custom-popup .leaflet-popup-content {
    margin: 0;
    font-family: inherit;
  }
  
  .custom-popup .leaflet-popup-tip {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .leaflet-container {
    font-family: inherit;
  }
  
  .leaflet-control-zoom a {
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    color: #495057;
    font-weight: 600;
    font-size: 18px;
    transition: all 0.2s ease;
    margin-bottom: 2px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  } 
  
  .leaflet-control-zoom a:hover {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    transform: translateY(-1px);
  }
  
  .leaflet-control-zoom a:active {
    transform: translateY(0);
  }
  
  .leaflet-control-zoom {
    border: none;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .leaflet-control-zoom a.leaflet-disabled {
    background: rgba(248, 249, 250, 0.8);
    color: #adb5bd;
    cursor: not-allowed;
  }
  
  .leaflet-control-zoom a.leaflet-disabled:hover {
    background: rgba(248, 249, 250, 0.8);
    color: #adb5bd;
    transform: none;
  }
  
  @media (max-width: 768px) {
    .leaflet-control-zoom a {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
  }
  
  .leaflet-control-attribution {
    border-radius: 8px 0 0 0;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(222, 226, 230, 0.5);
    border-bottom: none;
    border-right: none;
    font-size: 12px;
    color: #6c757d;
    padding: 4px 8px;
    transition: all 0.2s ease;
  }
  
  .leaflet-control-attribution:hover {
    background: rgba(255, 255, 255, 0.98);
    color: #495057;
  }
  
  .leaflet-control-attribution a {
    color: #28a745;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .leaflet-control-attribution a:hover {
    color: #1e7e34;
    text-decoration: underline;
  }
`;

// Injeta os estilos na página apenas uma vez
if (typeof document !== 'undefined' && !document.getElementById('map-custom-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'map-custom-styles';
  styleSheet.innerText = mapStyles;
  document.head.appendChild(styleSheet);
}

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
function CenterChangeHandler({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);

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
    <div className={`map-container-wrapper ${className}`} style={{
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      background: '#f8f9fa',
      position: 'relative',
      borderRadius: '0px 0px 12px 12px',
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={3} // Set your minimum zoom
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        className="w-100 h-100"
        style={{borderRadius: '0px 0px 12px 12px'}}
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
                maxWidth={300}
              >
                {marker.popupContent}
              </Popup>
            )}
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
        {/* Popup controller */}
        <PopupController onPopupClose={onPopupClose} />
        {/* Map ref component */}
        <MapRef onMapReady={setMapInstance} />
        {/* Center change handler */}
        <CenterChangeHandler center={center} />

        {/* Adicione mais marcadores ou polylines para rotas conforme necessário */}
      </MapContainer>
    </div>
  );
});

export default MapComponent;