import React, { useState, useEffect, useRef } from "react";
// ...existing code...
import PropTypes from "prop-types";
import MapComponent from "../components/MapComponent";
import BottomSheet from "../components/BottomSheet";
import SideBar from "../components/SideBar";
import MapTest from "../components/MapTest";
import { FloatingButton } from "../components/common";
import BottomSheetContent from "../components/features/homepage/BottomSheetContent";

import api from "./../api/api"

/**
 * Página principal da aplicação
 * Contém o mapa, bottom sheet, sidebar e botão flutuante
 * Otimizada para dispositivos móveis
 */
const HomePage = ({ isDark, setIsDark }) => {
	// ...existing code...
	const [anchor, setAnchors] = useState(0);
	const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
	const [showMap, setShowMap] = useState(true); // Toggle para testar mapa vs teste

	const [stops, setStops] = useState([]);
	const [route, setRoute] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [currentPosition, setCurrentPosition] = useState(null); // { latitude, longitude, altitude }
	const [geoError, setGeoError] = useState(null);

	// Estado para centro e zoom do mapa
	const defaultCenter = [-22.7065182, -46.7651778, 21.2];
	const [mapState, setMapStateInternal] = useState({
		center: defaultCenter,
		zoom: 15
	});

	// Função pública para alterar centro/zoom do mapa
	const setMapState = ({ lat, lng, zoom }) => {
		setMapStateInternal(prev => ({
			center: [lat, lng, prev.center[2] || 0],
			zoom: zoom !== undefined ? zoom : prev.zoom
		}));
	};

	// Debug: log do estado
	useEffect(() => {
		console.log('HomePage renderizada, estado atual:', { anchor, sideBarIsOpen, showMap });
	}, [anchor, sideBarIsOpen, showMap]);

	// ...existing code...
	
	// Carrega os pontos de parada da API ao montar o componente
	useEffect(() => {
		// Função para buscar os pontos de parada da API
		const fetchThings = async () => {
			try {
				const stopsResponse = await api.stops.getAll();
				setStops(stopsResponse);
				console.log("Pontos de parada carregados:", stopsResponse);

				const routeResponse = await api.routes.get();
				setRoute(routeResponse);
				console.log("Rota carregada:", routeResponse);
			} catch (error) {
				console.error("Erro ao carregar pontos de parada:", error);
			}
		};
		
		fetchThings();
	}, []);

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
						setMapState({ lat: latitude, lng: longitude, zoom: 10 });
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

	// Dados de exemplo para os marcadores do mapa
	// const mapMarkers = [
	// 	{
	// 		id: 1,
	// 		position: [-22.7065182,-46.7651778,21.2],
	// 		color: 'red',
	// 		size: 32,
	// 		popupContent: (
	// 			<div className="m-3">
	// 				<h6>Localização</h6>
	// 				<p className="mb-0">Informações sobre este ponto</p>
	// 			</div>
	// 		)
	// 	}
	// ];

	const mapMarkers = stops.map(stop => ({
		id: stop.ponto_id,
		position: [stop.latitude, stop.longitude, 0],
		color: 'blue',
		size: 32,
		popupContent: (
			<div className="m-3 gap-0 d-flex flex-column">
				<h6>{stop.nome}</h6>
				<p className="mb-0"><b>ID: </b>{stop.ponto_id}</p>
			</div>
		)
	}));



	// Só adiciona marcador de posição atual se latitude e longitude forem válidos
	if (currentPosition && typeof currentPosition.latitude === 'number' && typeof currentPosition.longitude === 'number') {
		mapMarkers.push({
			id: 'current-position',
			position: [currentPosition.latitude, currentPosition.longitude, currentPosition.altitude || 0],
			color: 'red',
			size: 32,
			popupContent: (
				<div className="m-3">
					<h6>Você está aqui</h6>
					<p className="mb-0">Lat: {currentPosition.latitude.toFixed(6)}<br/>Lng: {currentPosition.longitude.toFixed(6)}</p>
					{geoError && <p className="text-danger small">{geoError}</p>}
				</div>
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
		anchorPoints: [15, 50, 80], // Pontos de ancoragem ajustados para mobile
		content: (
			<div className="p-3">
				<h6 className="mb-2">Informações</h6>
				<p className="mb-2 small">Ponto de ancoragem atual: {anchor}</p>
				<div className="mb-2">Seu conteúdo aqui</div>
				<button 
					className="btn btn-primary btn-sm w-100"
					onClick={() => setShowMap(!showMap)}
				>
					{showMap ? 'Mostrar Teste' : 'Mostrar Mapa'}
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
			{/* FloatingButton para abrir sidebar */}
			<FloatingButton 
				onClick={handleSidebarOpen}
				isOpen={sideBarIsOpen}
			/>

			{/* Componente principal do mapa ou teste */}
			<div style={{ height: '100%', width: '100%' }}>
				{showMap ? (
					<MapComponent 
						{...mapConfig}
						markers={mapMarkers}
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
			>
				<BottomSheetContent anchor={anchor} />
			</BottomSheet>

			{/* Sidebar lateral */}
			<SideBar
				isOpen={sideBarIsOpen}
				onClickOutside={handleSidebarClose}
				isDark={isDark}
				setIsDark={setIsDark}
				onNavigate={handleSidebarNavigate}
			/>
		</div>
	{/* Localização é solicitada automaticamente pela API do navegador ao carregar a página. Nenhum pop-up extra é exibido. */}
		</>
	);
};

export default HomePage;

