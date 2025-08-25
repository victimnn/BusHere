const SideBarContent = () => {
    return (
        <div className="p-3">
            <h5>Conteúdo da Sidebar</h5>
            <p>Adicione aqui os elementos que deseja exibir na sidebar.</p>
        </div>
    )
}



const SideBar = ({isOpen, onClickOutside}) => {
	return (
        <>
		<div // Sidebar em si
            className="bg-light"
            style={{
                width: '80vw', height: '100vh',
                position: 'fixed',
                top: 0, left: 0,
                zIndex: 2000,
                overflowY: 'auto',
                transition: 'transform 0.3s ease-in-out',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}
        >
			<SideBarContent />
		</div>

        <div // Parte escura de fundo
            className="bg-dark"
            style={{
               opacity: isOpen ? 0.4 : 0,
               width: '100vw', height: '100vh',
               position: 'fixed',
               top: 0, left: 0,
               zIndex: 1999,
               backdropFilter: isOpen ? 'blur(30px)' : 'none',
               transition: 'opacity 0.3s ease-in-out',
               pointerEvents: isOpen ? 'auto' : 'none',
            }}
            onClick={onClickOutside}
        >

        </div>
        </>
	);
};

export default SideBar;
