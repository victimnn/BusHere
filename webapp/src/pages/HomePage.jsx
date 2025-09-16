import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MapComponent from "../components/MapComponent";
import BottomSheet from "../components/BottomSheet";
import SideBar from "../components/SideBar";
import MapTest from "../components/MapTest";
import { FloatingButton } from "../components/common";

/**
 * Página principal da aplicação
 * Contém o mapa, bottom sheet, sidebar e botão flutuante
 * Otimizada para dispositivos móveis
 */
const HomePage = ({ isDark, setIsDark }) => {
	const [anchor, setAnchors] = useState(0);
	const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
	const [showMap, setShowMap] = useState(true); // Toggle para testar mapa vs teste
	
	// Debug: log do estado
	useEffect(() => {
		console.log('HomePage renderizada, estado atual:', { anchor, sideBarIsOpen, showMap });
	}, [anchor, sideBarIsOpen, showMap]);
	
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
				{bottomSheetConfig.content}
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
	);
};

export default HomePage;

