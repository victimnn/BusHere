import React from "react";
import MapComponent from "../components/MapComponent";
import BottomSheet from "../components/BottomSheet";

const FloatingButton = () => {
	return (
		<button className="btn btn-primary" style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1050 }}>
			=
		</button>
	)

}

const HomePage = () => {
	return (
		<>	
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

			<FloatingButton />
		</>
	);
};

export default HomePage;

