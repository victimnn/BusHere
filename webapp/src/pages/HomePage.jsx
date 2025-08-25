import React,{useState, useEffect} from "react";
import MapComponent from "../components/MapComponent";
import BottomSheet from "../components/BottomSheet";

const FloatingButton = ({ onClick }) => {
	return (
		<button className="btn btn-light rounded-circle m-0 d-flex align-items-center justify-content-center" 
			style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1050, aspectRatio: '1 / 1',}}
			onClick={onClick}
		>
				<i className="bi bi-list" style={{ fontSize: '24px' }} />
		</button>
	)

}

const HomePage = () => {
	const [anchor,setAnchors] = useState(0);

	return (
		<>	
			<MapComponent 
				center={[37.7749, -122.4194]} // Default center (San Francisco)	
				zoom={13} // Default zoom level
				className="w-100 h-100"
				markers={
					[{
						id: 1,
						position: [37.7749, -122.4194],
						color: 'red',
						size: 32,
						popupContent: <div className="m-4">Popup Content</div>
					}]
				}
			/>
			<BottomSheet
				isOpen={true}
				onClose={() => {}}
				anchorPoints={[20, 50, 80]}
				setAnchorPoint={setAnchors}
			>
				<div>Your content here</div>
				<p>{anchor}</p>
			</BottomSheet>

			<FloatingButton 
				onClick={() => {alert('Clicked!')}}
			/>
		</>
	);
};

export default HomePage;

