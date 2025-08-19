import React from "react";
import MapComponent from "../components/MapComponent";
import BottomSheet from "../components/BottomSheet";

const HomePage = () => {
	return (
		<>	
			pagina inicial
			<MapComponent 
				center={[37.7749, -122.4194]} // Default center (San Francisco)	
				zoom={13} // Default zoom level
				className="w-100 h-100"
			/>
			<BottomSheet
				isOpen={true}
				onClose={() => {}}
				
			>
				<div>Your content here</div>
			</BottomSheet>
		</>
	);
};

export default HomePage;

