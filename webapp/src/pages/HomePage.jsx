import React, { useState, useEffect, useRef } from "react";
// ...existing code...
import PropTypes from "prop-types";
import { MapComponent, BottomSheet, MapTest, InstallButton, BottomSheetContent, UserLocationPopup } from "../components";

import api from "./../api/api"
import { useRoutes } from "../hooks/data/useRoutes";
import { useMapMarkers } from "../hooks";
import { MAP_CONSTANTS } from "../utils/mapConstants";
//import { useStops } from "../hooks/data/useStops";

/**
 * Página principal da aplicação
 * Contém o mapa e bottom sheet
 * Sidebar e FloatingButton agora são gerenciados pelo Layout global
 * Otimizada para dispositivos móveis
 */
const HomePage = ({ isDark, setIsDark }) => {
	const [anchor, setAnchors] = useState(0);
	const [showMap, setShowMap] = useState(true); // Toggle para testar mapa vs teste
	
	// Estado para centro e zoom do mapa
	const defaultCenter = [-22.7065182, -46.7651778, 21.2];
	const [mapState, setMapStateInternal] = useState({
		center: defaultCenter,
		zoom: 15
	});

	// Função pública para alterar centro/zoom do mapa
	const setMapState = (lat, lng, zoom = 15) => {
		console.log('setMapState chamado com:', { lat, lng, zoom });
		
		// Converter strings para números se necessário
		const numLat = typeof lat === 'string' ? parseFloat(lat) : lat;
		const numLng = typeof lng === 'string' ? parseFloat(lng) : lng;
		
           if (typeof numLat === 'number' && typeof numLng === 'number' && !isNaN(numLat) && !isNaN(numLng)) {
               // Ajustar posição para mostrar o popup corretamente
               // Centralizar horizontalmente e deslocar bem mais para baixo na vertical
               const offsetLat = numLat + 0.010; // Deslocar bem mais para baixo (sul)
               const offsetLng = numLng; // Manter centralizado horizontalmente
			
			setMapStateInternal(prev => ({
				center: [offsetLat, offsetLng, prev.center[2] || 0],
				zoom: zoom !== undefined ? zoom : prev.zoom
			}));
		} else {
			console.error('Coordenadas inválidas em setMapState:', { lat, lng, zoom, numLat, numLng });
		}
	};

	const { routes } = useRoutes();
	const { markers: routeMarkers, polylines: routePolylines, routingLoading, cacheStats } = useMapMarkers(routes, true, setMapState);
	const [currentPosition, setCurrentPosition] = useState(null); // { latitude, longitude, altitude }
	const [geoError, setGeoError] = useState(null);

// Os dados de stops e route agora vêm dos hooks useStops e useRoutes

	// Atualiza a posição atual do usuário e move o mapa na primeira localização
	useEffect(() => {
		let firstLocation = true;
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude, altitude } = position.coords;
					setCurrentPosition({ latitude, longitude, altitude: altitude || 0 });
					setGeoError(null);
					if (firstLocation) {
						//alert("Posição inicial obtida. Centralizando mapa.");
						setMapState(latitude, longitude, 10);
						firstLocation = false;
					}
				},
				(error) => {
					setGeoError(error.message);
					setCurrentPosition(null);
					console.error("Erro ao obter posição:", error);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				}
			);
			return () => navigator.geolocation.clearWatch(watchId);
		} else {
			setGeoError("Geolocalização não é suportada por este navegador.");
			setCurrentPosition(null);
		}
	}, []);

	// Usar marcadores e polylines do hook useMapMarkers
	let mapMarkers = routeMarkers;
	let mapPolylines = [...routePolylines];



	// Só adiciona marcador de posição atual se latitude e longitude forem válidos
	if (currentPosition && typeof currentPosition.latitude === 'number' && typeof currentPosition.longitude === 'number') {
		mapMarkers.push({
			id: 'current-position',
			position: [currentPosition.latitude, currentPosition.longitude],
			color: MAP_CONSTANTS.MARKER_COLORS.CURRENT_POSITION,
			size: MAP_CONSTANTS.MARKER_SIZES.DEFAULT,
			popupContent: (
				<UserLocationPopup 
					position={currentPosition} 
					geoError={geoError} 
				/>
			)
		});
	}

	// Configurações do mapa vindas do estado
	const mapConfig = {
		center: mapState.center,
		zoom: mapState.zoom,
		className: "w-100 h-100"
	};

	// Configurações do bottom sheet otimizado para mobile
	const bottomSheetConfig = {
		anchorPoints: [15, 65, 95], // Aumentado MEDIUM de 50% para 65% para acomodar VehicleDetails
		content: (
			<div className="p-3">
				<h6 className="mb-2">Informações</h6>
				<p className="mb-2 small">Ponto de ancoragem atual: {anchor}</p>
				
				{/* Indicador de carregamento do roteamento */}
				{routingLoading && (
					<div className="alert alert-info d-flex align-items-center mb-3" role="alert">
						<div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
						<span className="small">Calculando rota real...</span>
					</div>
				)}
				
				{/* Estatísticas do cache */}
				{cacheStats && (
					<div className="mb-2 small text-muted">
						<i className="bi bi-info-circle me-1"></i>
						Cache: {cacheStats.hitRate}% hits ({cacheStats.hits}/{cacheStats.hits + cacheStats.apiCalls})
					</div>
				)}
				
				<div className="mb-2">Seu conteúdo aqui</div>
				<button 
					className="btn btn-primary btn-sm w-100"
					onClick={() => setShowMap(!showMap)}
				>
					{showMap ? 'Mostrar Teste' : 'Mostrar Mapa'}
				</button>

				<button className="btn btn-secondary btn-sm w-100" onClick={() => { window.location.href = '/login'; }}>
					Ir para Login
				</button>

				<button className="btn btn-secondary btn-sm w-100" onClick={() => { window.location.href = '/register'; }}>
					Ir para Registro
				</button>
			</div>
		)
	};
	
	/**
	 * Abre a sidebar
	 */
	const handleSidebarOpen = () => {
		setSideBarIsOpen(true);
	};
	
	/**
	 * Fecha a sidebar
	 */
	const handleSidebarClose = () => {
		setSideBarIsOpen(false);
	};
	
	/**
	 * Fecha a sidebar após navegação (otimização para mobile)
	 */
	const handleSidebarNavigate = () => {
		handleSidebarClose();
	};
	
	
	return (
		<>
		<div className="home-page" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
			{/* Componente principal do mapa ou teste */}
			<div style={{ height: '100%', width: '100%' }}>
				{showMap ? (
					<MapComponent 
						{...mapConfig}
						markers={mapMarkers}
						polylines={mapPolylines}
						onMarkerClick={(marker) => {
							// Centralizar automaticamente ao clicar no marcador
							if (marker.onClick) {
								marker.onClick();
							}
						}}
					/>
				) : (
					<MapTest />
				)}
			</div>

			{/* Bottom sheet para informações adicionais */}
			<BottomSheet
				isOpen={true}
				onClose={() => {}}
				anchorPoints={bottomSheetConfig.anchorPoints}
				setAnchorPoint={setAnchors}
				maxHeight={90}
			>   
				<div className="d-flex justify-content-center w-100">
					<div style={{ maxWidth: 600 }} className="w-100">
						<BottomSheetContent anchor={anchor} isDark={isDark}/>
					</div>
				</div>
			</BottomSheet>
		</div>
	{/* Localização é solicitada automaticamente pela API do navegador ao carregar a página. Nenhum pop-up extra é exibido. */}
		</>
	);
};

export default HomePage;

