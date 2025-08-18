import React from "react";

const HomePage = () => {
	return (
		<div className="homepage-container">
			<header className="homepage-header">
				<img src="/logo.svg" alt="Logo" className="homepage-logo" />
				<h1>Bem-vindo ao WebApp BusHere!</h1>
			</header>
			<main className="homepage-main">
                <h1>BusHere!</h1>
			</main>
			<footer className="homepage-footer">
				<small>&copy;BusHere</small>
			</footer>
		</div>
	);
};

export default HomePage;
