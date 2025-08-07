import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuses } from '@web/hooks/useBuses';
import { useDrivers} from '@web/hooks/useDrivers';
import { useStops } from '@web/hooks/useStops';
import MapComponent from '@web/components/ui/MapComponent';
import { popup } from 'leaflet';

function MarkerDetails({ marker, onClick }) {
    return (
        <div>
            <h5>{marker.title}</h5>
            <button className="btn btn-primary" onClick={() => onClick(marker)}>
                {marker.title}
            </button>
        </div>
    );
}

function RouteStopsPage({ pageFunctions }) {
    const navigate = useNavigate();
    useEffect(() => {
        pageFunctions.set("Paradas da Rota", true, true);
    }, [pageFunctions]);

    const [selectedStops, setSelectedStops] = useState([]);
    
    const { stops } = useStops();
    const { buses } = useBuses();
    const { drivers } = useDrivers();
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const markers = stops.map(stop => ({
        position: { lat: stop.latitude, lng: stop.longitude },
        title: stop.descricao,
        id: stop.id,
        popupContent: (
            <div>
                <h5>{stop.descricao}</h5>
                <p>Ordem: {stop.ordem}</p>
                <p>Latitude: {stop.latitude}</p>
                <p>Longitude: {stop.longitude}</p>
            </div>
        ),
    }));


    return (
        <div className="w-100 d-flex flex-row" style={{ height: "calc(100vh - 120px)", overflow: "hidden"}}>
            <div className="border w-25">
                <pre><code>{JSON.stringify(selectedStops, null, 2)}</code></pre>
            </div>
            <div className="border flex-grow-1">
                <MapComponent className='w-100 h-100' 
                    center={{ lat: -23.5505, lng: -46.6333 }} // Ponto central do mapa
                    zoom={12} // Nível de zoom inicial
                    markers={markers} // Lista de marcadores
                    onMarkerClick={(marker) => {
                        setSelectedStops(prev => {
                            const exists = prev.find(stop => stop.id === marker.id); // Se já existe, nao adiciona novamente
                            if (exists) return prev;
                            return [...prev, {}]; // Adiciona o marcador selecionado
                        });
                    }}
                    onMapClick={(event) => {
                        console.log('Mapa clicado:', event.latLng);
                    }}
                />
            </div>
        </div>
    );
}

export default RouteStopsPage;