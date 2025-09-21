import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MapComponent, BottomSheet, MapTest, InstallButton } from "../components";

import api from "./../api/api"

/**
 * Página principal da aplicação
 * Contém o mapa e bottom sheet
 * Sidebar e FloatingButton agora são gerenciados pelo Layout global
 * Otimizada para dispositivos móveis
 */
const HomePage = () => {
	const [anchor, setAnchors] = useState(0);
	const [showMap, setShowMap] = useState(true); // Toggle para testar mapa vs teste
	
	const [stops, setStops] = useState([]);
	const [route, setRoute] = useState(null);
	const [markers, setMarkers] = useState([]);
	// Debug: log do estado
	useEffect(() => {
		console.log('HomePage renderizada, estado atual:', { anchor, showMap });
	}, [anchor, showMap]);
	
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

	// Dados de exemplo para os marcadores do mapa
	const mapMarkers = [
		{
			id: 1,
			position: [-22.7065182,-46.7651778,21.2],
			color: 'red',
			size: 32,
			popupContent: (
				<div className="m-3">
					<h6>Localização</h6>
					<p className="mb-0">Informações sobre este ponto</p>
				</div>
			)
		}
	];
	
	// Configurações padrão do mapa
	const mapConfig = {
		center: [-22.7065182,-46.7651778,21.2], // Centro padrão (etec)
		zoom: 15,
		className: "w-100 h-100"
	};
	
	// Configurações do bottom sheet otimizado para mobile
	const bottomSheetConfig = {
		anchorPoints: [15, 40, 70], // Pontos de ancoragem ajustados para mobile
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

				<button className="btn btn-secondary btn-sm w-100" onClick={() => { window.location.href = '/login'; }}>
					Ir para Login
				</button>

				<button className="btn btn-secondary btn-sm w-100" onClick={() => { window.location.href = '/register'; }}>
					Ir para Registro
				</button>
			</div>
		)
	};
	
	return (
		<div className="home-page" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
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
				{bottomSheetConfig.content}
			</BottomSheet>
		</div>
	);
};

export default HomePage;

